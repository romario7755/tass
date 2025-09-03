"use server"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ✅ Récupérer toutes les voitures de l'utilisateur
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const cars = await prisma.car.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(cars)
}

// ✅ Créer une voiture
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
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
      published: false,
      userId: session.user.id,
     
      imageUrl: body.imageUrl, // ✅ ici
     
    },
  })

  return NextResponse.json(car, { status: 201 })
}
