import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: "Email requis" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        isActive: true,
        emailVerified: true
      }
    })

    if (!user) {
      return NextResponse.json({
        exists: false,
        isActive: false
      })
    }

    return NextResponse.json({
      exists: true,
      isActive: user.isActive,
      emailVerified: !!user.emailVerified
    })

  } catch (error) {
    console.error("Erreur lors de la vérification de l'utilisateur:", error)
    return NextResponse.json(
      { message: "Erreur lors de la vérification" },
      { status: 500 }
    )
  }
}