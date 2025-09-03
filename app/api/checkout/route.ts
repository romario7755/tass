import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" })

export async function POST(req: Request) {
  try {
    const { title, price, userId, destinationAccountId } = await req.json()
    // price en EUR -> centimes
    const amount = Math.round(Number(price) * 100)
    const fee = Math.round(amount * 0.05)

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Publication: ${title}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        // ⚠️ Requiert Stripe Connect
        application_fee_amount: fee,
        transfer_data: {
          destination: destinationAccountId, // "acct_..." du vendeur
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata: { userId, carTitle: title, price: String(price) },
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Erreur création paiement" }, { status: 500 })
  }
}
