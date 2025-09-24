import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer l'évaluation de l'utilisateur connecté
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer l'évaluation de l'utilisateur
    const rating = await prisma.rating.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(rating);

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'évaluation utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer l'évaluation de l'utilisateur connecté
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer l'évaluation
    const deletedRating = await prisma.rating.delete({
      where: { userId: user.id }
    });

    return NextResponse.json({ success: true, deletedRating });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'évaluation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}