import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/app/lib/stripe"
import { PrismaClient } from "@prisma/client"
import { sendPurchaseConfirmationToBuyer, sendSaleNotificationToSeller, sendInvoiceEmailToBuyer } from "@/app/lib/resend"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Webhook Stripe reçu")
    const body = await request.text()
    const sig = request.headers.get("stripe-signature")

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ Signature manquante ou secret webhook non configuré")
      return NextResponse.json(
        { error: "Signature manquante ou secret webhook non configuré" },
        { status: 400 }
      )
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
      console.log(`✅ Événement Stripe validé: ${event.type}`)
    } catch (err: unknown) {
      console.error("❌ Erreur webhook Stripe:", err instanceof Error ? err.message : 'Unknown error')
      return NextResponse.json(
        { error: `Webhook error: ${err instanceof Error ? err.message : 'Unknown error'}` },
        { status: 400 }
      )
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        console.log(`💰 Paiement réussi: ${paymentIntent.id}`)

        // Mettre à jour le statut du paiement
        const payment = await prisma.payment.update({
          where: { stripeId: paymentIntent.id },
          data: { status: "completed" },
          include: {
            user: true,
            car: {
              include: {
                user: true
              }
            }
          }
        })
        console.log(`📝 Paiement mis à jour en base: ${payment.id}`)

        // Envoyer les emails et archiver l'achat si toutes les informations sont disponibles
        if (payment.car && payment.user && payment.car.user) {
          console.log(`👥 Données trouvées - Acheteur: ${payment.user.email}, Vendeur: ${payment.car.user.email}`);
          const buyer = payment.user
          const seller = payment.car.user
          const carInfo = {
            title: payment.car.title,
            brand: payment.car.brand,
            model: payment.car.model,
            year: payment.car.year,
            price: payment.car.price
          }

          // Créer un enregistrement d'achat archivé
          try {
            await prisma.purchase.create({
              data: {
                buyerId: buyer.id,
                carId: payment.car.id,
                paymentId: payment.id,
                amount: payment.amount,
                status: "completed"
              }
            })
            console.log(`📦 Achat archivé pour l'acheteur: ${buyer.email}`)
          } catch (error) {
            console.error("❌ Erreur lors de l'archivage de l'achat:", error)
          }

          // Archiver l'article (le retirer de la publication) pour le vendeur
          try {
            await prisma.car.update({
              where: { id: payment.car.id },
              data: {
                published: false
              }
            })
            console.log(`🗄️ Article archivé (retiré de la publication) pour le vendeur: ${seller.email}`)
          } catch (error) {
            console.error("❌ Erreur lors de l'archivage de l'article:", error)
          }

          // Email de facture à l'acheteur
          if (buyer.email && buyer.name && seller.name) {
            console.log(`📧 Tentative d'envoi de facture à: ${buyer.email}`)
            try {
              const result = await sendInvoiceEmailToBuyer(
                buyer.email,
                buyer.name,
                seller.name,
                payment.id,
                carInfo
              )
              console.log(`✅ Facture envoyée avec succès à l'acheteur: ${buyer.email}`, result)
            } catch (error) {
              console.error("❌ Erreur envoi facture acheteur:", error)
            }

            // Email de confirmation avec informations du vendeur
            if (seller.email) {
              console.log(`📧 Tentative d'envoi de confirmation à: ${buyer.email}`)
              try {
                const result = await sendPurchaseConfirmationToBuyer(
                  buyer.email,
                  buyer.name,
                  seller.email,
                  seller.name,
                  carInfo
                )
                console.log(`✅ Email de confirmation envoyé avec succès à l'acheteur: ${buyer.email}`, result)
              } catch (error) {
                console.error("❌ Erreur envoi email confirmation acheteur:", error)
              }
            }
          } else {
            console.log(`⚠️ Données manquantes pour l'acheteur - email: ${buyer.email}, name: ${buyer.name}, seller.name: ${seller.name}`)
          }

          // Email au vendeur avec les informations de l'acheteur
          if (seller.email && seller.name && buyer.email && buyer.name) {
            console.log(`📧 Tentative d'envoi de notification au vendeur: ${seller.email}`)
            try {
              const result = await sendSaleNotificationToSeller(
                seller.email,
                seller.name,
                buyer.email,
                buyer.name,
                carInfo
              )
              console.log(`✅ Email de notification envoyé avec succès au vendeur: ${seller.email}`, result)
            } catch (error) {
              console.error("❌ Erreur envoi email vendeur:", error)
            }
          } else {
            console.log(`⚠️ Données manquantes pour le vendeur - seller.email: ${seller.email}, seller.name: ${seller.name}, buyer.email: ${buyer.email}, buyer.name: ${buyer.name}`)
          }
        }
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        await prisma.payment.update({
          where: { stripeId: failedPayment.id },
          data: { status: "failed" }
        })
        break

      default:
        console.log(`Type d'événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Erreur webhook:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
