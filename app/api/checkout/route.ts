import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "@/lib/session"
import { PrismaClient } from "@prisma/client"
import stripe from '@/app/lib/stripe';
import type { CheckoutItem, CheckoutResponse, ErrorResponse } from '@/app/type/stripe';

const prisma = new PrismaClient()

interface CheckoutRequestBody {
  items: CheckoutItem[];
}

// GET method for URL-based checkout (from login redirect)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // ✅ Vérification d'authentification obligatoire
    const userSession = await getServerSession()
    if (!userSession?.user?.id) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { searchParams } = new URL(request.url)
    const itemsParam = searchParams.get('items')

    if (!itemsParam) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    let items
    try {
      items = JSON.parse(decodeURIComponent(itemsParam))
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Récupérer les informations des voitures depuis la base de données
    const carItems = []
    for (const item of items) {
      const car = await prisma.car.findUnique({
        where: { id: item.id },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      if (car) {
        carItems.push({
          name: car.title,
          price: car.price,
          quantity: item.quantity || 1,
          description: `${car.brand} ${car.model} (${car.year})`
        })
      }
    }

    if (carItems.length === 0) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: carItems.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100), // Centimes
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    // Redirection vers Stripe
    if (session.url) {
      return NextResponse.redirect(session.url)
    } else {
      return NextResponse.redirect(new URL('/', request.url))
    }

  } catch (error) {
    console.error('Erreur Stripe GET:', error);
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<CheckoutResponse | ErrorResponse>> {
  try {
    // ✅ Vérification d'authentification obligatoire
    const userSession = await getServerSession()
    if (!userSession?.user?.id) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour effectuer un achat" },
        { status: 401 }
      )
    }

    const { items }: CheckoutRequestBody = await request.json();

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Articles manquants' },
        { status: 400 }
      );
    }

    // Validation de chaque item
    for (const item of items) {
      if (!item.name || typeof item.price !== 'number' || item.price <= 0) {
        return NextResponse.json(
          { error: 'Article invalide' },
          { status: 400 }
        );
      }
    }

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100), // Centimes
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url || undefined,
    });

  } catch (error) {
    console.error('Erreur Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}