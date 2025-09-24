"use server"

import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/session"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ✅ Récupérer les voitures de l'utilisateur (actives par défaut, archivées si paramètre)
export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'active', 'archived', ou 'all'

  let whereClause: any = { userId: session.user.id }

  if (type === 'archived') {
    whereClause.published = false
  } else if (type === 'active') {
    whereClause.published = true
  }
  // Si type === 'all', on récupère tout

  const cars = await prisma.car.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(cars)
}

// ✅ Créer une voiture
export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await req.json()

  const car = await prisma.car.create({
    data: {
      title: body.title,
      price: body.price,
      brand: body.brand,
      model: body.model,
      year: body.year,
      mileage: body.mileage,
      fuel: body.fuel,
      transmission: body.transmission,
      description: body.description,
      published: true, // ✅ Publier automatiquement les nouvelles annonces
      userId: session.user.id,

      imageUrl: body.imageUrl,
      imageUrl2: body.imageUrl2,
      imageUrl3: body.imageUrl3,


    },
  })

  return NextResponse.json(car, { status: 201 })
}
