import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Créer ou modifier une évaluation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être entre 1 et 5' },
        { status: 400 }
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

    // Vérifier si l'utilisateur a déjà une évaluation
    const existingRating = await prisma.rating.findUnique({
      where: { userId: user.id }
    });

    let result;

    if (existingRating) {
      // Modifier l'évaluation existante
      result = await prisma.rating.update({
        where: { userId: user.id },
        data: {
          rating: parseInt(rating),
          comment: comment || null
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
    } else {
      // Créer une nouvelle évaluation
      result = await prisma.rating.create({
        data: {
          rating: parseInt(rating),
          comment: comment || null,
          userId: user.id
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'évaluation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// GET - Récupérer toutes les évaluations
export async function GET() {
  try {
    const ratings = await prisma.rating.findMany({
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculer les statistiques
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
      : 0;

    const ratingDistribution = {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length,
    };

    return NextResponse.json({
      ratings,
      stats: {
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des évaluations:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}