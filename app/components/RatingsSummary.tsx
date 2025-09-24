'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StarRating from './StarRating';

interface RatingStats {
  totalRatings: number;
  averageRating: number;
}

interface RecentRating {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
  };
}

export default function RatingsSummary() {
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [recentRatings, setRecentRatings] = useState<RecentRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatingsData = async () => {
      try {
        const response = await fetch('/api/ratings');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setRecentRatings(data.ratings.slice(0, 3)); // Prendre seulement les 3 dernières
        }
      } catch (error) {
        console.error('Erreur lors du chargement des évaluations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingsData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!stats || stats.totalRatings === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Évaluez notre service
            </h2>
            <p className="text-gray-600 mb-8">
              Soyez le premier à partager votre expérience avec TASS-AUTO
            </p>
            <Link
              href="/evaluations"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Laisser une évaluation
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ce que disent nos clients
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-4xl font-bold text-blue-600">
              {stats.averageRating}/5
            </div>
            <div>
              <StarRating rating={stats.averageRating} readonly size="lg" />
              <p className="text-gray-600 text-sm mt-1">
                {stats.totalRatings} évaluation{stats.totalRatings > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Évaluations récentes */}
        {recentRatings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recentRatings.map((rating) => (
              <div key={rating.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-2 mb-3">
                  <StarRating rating={rating.rating} readonly size="sm" />
                  <span className="text-sm text-gray-500">
                    par {rating.user.name || 'Utilisateur anonyme'}
                  </span>
                </div>
                {rating.comment && (
                  <p className="text-gray-700 text-sm line-clamp-3">
                    "{rating.comment}"
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/evaluations"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir toutes les évaluations
          </Link>
        </div>
      </div>
    </section>
  );
}