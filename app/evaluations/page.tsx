'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import StarRating from '../components/StarRating';
import RatingForm from '../components/RatingForm';

interface Rating {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
  };
}

interface RatingStats {
  totalRatings: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface RatingsData {
  ratings: Rating[];
  stats: RatingStats;
}

export default function EvaluationsPage() {
  const { data: session } = useSession();
  const [ratingsData, setRatingsData] = useState<RatingsData | null>(null);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = async () => {
    try {
      const response = await fetch('/api/ratings');
      if (!response.ok) throw new Error('Erreur lors du chargement des évaluations');
      const data = await response.json();
      setRatingsData(data);
    } catch (err) {
      setError('Impossible de charger les évaluations');
      console.error(err);
    }
  };

  const fetchUserRating = async () => {
    if (!session) return;

    try {
      const response = await fetch('/api/ratings/my-rating');
      if (response.ok) {
        const data = await response.json();
        setUserRating(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'évaluation utilisateur:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRatings(), fetchUserRating()]);
      setLoading(false);
    };

    loadData();
  }, [session]);

  const handleSubmitRating = async (rating: number, comment: string) => {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'évaluation');
      }

      const newRating = await response.json();
      setUserRating(newRating);

      // Rafraîchir la liste des évaluations
      await fetchRatings();

      alert('Évaluation enregistrée avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const handleDeleteRating = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre évaluation ?')) {
      return;
    }

    try {
      const response = await fetch('/api/ratings/my-rating', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setUserRating(null);
      await fetchRatings();
      alert('Évaluation supprimée avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'évaluation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Évaluations du site
        </h1>

        {/* Statistiques globales */}
        {ratingsData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {ratingsData.stats.averageRating}/5
              </div>
              <StarRating rating={ratingsData.stats.averageRating} readonly size="lg" />
              <p className="text-gray-600 mt-2">
                Basé sur {ratingsData.stats.totalRatings} évaluation{ratingsData.stats.totalRatings > 1 ? 's' : ''}
              </p>
            </div>

            {/* Distribution des notes */}
            <div className="grid grid-cols-5 gap-4 mt-6">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {star} ⭐
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {ratingsData.stats.ratingDistribution[star as keyof typeof ratingsData.stats.ratingDistribution]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire d'évaluation */}
          <div>
            {userRating ? (
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Votre évaluation</h3>
                  <button
                    onClick={handleDeleteRating}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
                <div className="mb-3">
                  <StarRating rating={userRating.rating} readonly />
                </div>
                {userRating.comment && (
                  <p className="text-gray-700 mb-4">{userRating.comment}</p>
                )}
                <p className="text-sm text-gray-500">
                  Publié le {new Date(userRating.createdAt).toLocaleDateString('fr-FR')}
                </p>

                {/* Formulaire pour modifier */}
                <div className="mt-6 pt-6 border-t">
                  <RatingForm
                    onSubmit={handleSubmitRating}
                    currentRating={userRating.rating}
                    currentComment={userRating.comment || ''}
                    isEditing={true}
                  />
                </div>
              </div>
            ) : (
              <RatingForm onSubmit={handleSubmitRating} />
            )}
          </div>

          {/* Liste des évaluations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Toutes les évaluations</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ratingsData?.ratings.map((rating) => (
                <div key={rating.id} className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {rating.user.name || 'Utilisateur anonyme'}
                      </span>
                      <StarRating rating={rating.rating} readonly size="sm" />
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-gray-700">{rating.comment}</p>
                  )}
                </div>
              ))}

              {ratingsData?.ratings.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Aucune évaluation pour le moment
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}