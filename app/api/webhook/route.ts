import { NextResponse } from "next/server"
import Stripe from "stripe"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const config = { api: { bodyParser: false } } // Next 15 route handler lit req.text()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" })

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!
  const body = await req.text()
  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.userId
      const title = session.metadata?.carTitle
      
      if (!userId || !title) {
        console.error("Missing required metadata")
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
      }
      
      const amount = (session.amount_total ?? 0) / 100
      const fee = Math.round((session.amount_total ?? 0) * 0.05) / 100

      // Crée la voiture publiée
      const car = await prisma.car.create({
        data: {
          title,
          price: amount,
          published: true,
          userId,
          brand: "Non spécifié",
          model: "Non spécifié", 
          year: 2020,
          mileage: 0,
          fuel: "Non spécifié",
          transmission: "Non spécifié",
        },
      })

      // Enregistre le paiement
      await prisma.payment.create({
        data: {
          amount,
          fee,
          status: "completed",
          stripeId: session.id,
          userId,
          carId: car.id,
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook error:", err)
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur inconnue" }, { status: 400 })
  }
}
