import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer TOUTES les voitures de la base de données (accessible sans authentification)
export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      where: {
        published: true
      },
      orderBy: { createdAt: "desc" },
    })

    // Pour chaque voiture, récupérer l'utilisateur séparément
    const carsWithUser = []
    for (const car of cars) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: car.userId },
          select: {
            name: true,
            email: true
          }
        })

        if (user) {
          carsWithUser.push({
            ...car,
            user
          })
        }
      } catch (userError) {
        console.warn(`Utilisateur introuvable pour la voiture ${car.id}:`, userError)
      }
    }

    return NextResponse.json(carsWithUser)
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}