'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import StarRating from './StarRating';

interface RatingFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  currentRating?: number;
  currentComment?: string;
  isEditing?: boolean;
}

export default function RatingForm({
  onSubmit,
  currentRating = 0,
  currentComment = '',
  isEditing = false
}: RatingFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(currentRating);
  const [comment, setComment] = useState(currentComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('Vous devez être connecté pour noter le site');
      return;
    }

    if (rating === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      if (!isEditing) {
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'évaluation:', error);
      alert('Erreur lors de l\'envoi de l\'évaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border">
        <p className="text-gray-600 text-center">
          Connectez-vous pour évaluer notre site
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Modifier votre évaluation' : 'Évaluez notre site'}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Votre note :
        </label>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Commentaire (optionnel) :
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec notre site..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          maxLength={500}
        />
        <p className="text-sm text-gray-500 mt-1">
          {comment.length}/500 caractères
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting
          ? 'Envoi...'
          : isEditing
            ? 'Modifier l\'évaluation'
            : 'Publier l\'évaluation'
        }
      </button>
    </form>
  );
}