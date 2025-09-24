import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"
import { generateActivationToken, sendActivationEmail } from "../../../lib/resend"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const activationToken = generateActivationToken()

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: false,
        activationToken,
        emailVerified: null,
      }
    })

    const emailResult = await sendActivationEmail(email, name, activationToken)

    if (!emailResult.success) {
      console.error("Erreur lors de l'envoi de l'email d'activation:", emailResult.error)

      await prisma.user.delete({
        where: { id: user.id }
      })

      return NextResponse.json(
        { message: "Erreur lors de l'envoi de l'email d'activation. Veuillez réessayer." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "Compte créé avec succès ! Veuillez vérifier votre email pour activer votre compte.",
        userId: user.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json(
      { message: "Erreur lors de la création du compte. Veuillez réessayer." },
      { status: 500 }
    )
  }
}