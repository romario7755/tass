import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: "Token d'activation requis" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: { activationToken: token }
    })

    if (!user) {
      return NextResponse.json(
        { message: "Token d'activation invalide" },
        { status: 400 }
      )
    }

    if (user.isActive) {
      return NextResponse.json(
        { message: "Ce compte est déjà activé" },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        activationToken: null,
        emailVerified: new Date()
      }
    })

    return NextResponse.json(
      { message: "Compte activé avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de l'activation:", error)
    return NextResponse.json(
      { message: "Erreur lors de l'activation du compte" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { message: "Token d'activation requis" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: { activationToken: token }
    })

    if (!user) {
      return NextResponse.json(
        { message: "Token d'activation invalide" },
        { status: 400 }
      )
    }

    if (user.isActive) {
      return NextResponse.json(
        { message: "Ce compte est déjà activé" },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        activationToken: null,
        emailVerified: new Date()
      }
    })

    return NextResponse.json(
      { message: "Compte activé avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de l'activation:", error)
    return NextResponse.json(
      { message: "Erreur lors de l'activation du compte" },
      { status: 500 }
    )
  }
}