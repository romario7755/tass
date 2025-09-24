import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateActivationToken, sendPasswordResetEmail } from '@/app/lib/resend';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' },
        { status: 200 }
      );
    }

    const resetToken = generateActivationToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    const result = await sendPasswordResetEmail(
      email,
      user.name || 'Utilisateur',
      resetToken
    );

    if (!result.success) {
      console.error('Erreur envoi email:', result.error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur forgot-password:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}