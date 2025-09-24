"use server"

import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/session"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Publier/dépublier une annonce
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { published } = await req.json()

    // Vérifier que la voiture appartient à l'utilisateur
    const car = await prisma.car.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!car) {
      return NextResponse.json({ error: "Voiture non trouvée" }, { status: 404 })
    }

    // Mettre à jour le statut de publication
    const updatedCar = await prisma.car.update({
      where: { id },
      data: { published: published }
    })

    return NextResponse.json(updatedCar)
  } catch (error) {
    console.error("Erreur lors de la publication:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}