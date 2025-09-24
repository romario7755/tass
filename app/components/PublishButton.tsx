'use client';
import { useState } from 'react';

interface Car {
  id: string;
  title: string;
  price: number;
  published: boolean;
  brand: string;
  model: string;
  year?: number;
  description?: string;
  imageUrl?: string;
}

interface PublishButtonProps {
  carId: string;
  car: Car;
  onUpdate?: () => void;
}

export default function PublishButton({ carId, car, onUpdate }: PublishButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePublishToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cars/${carId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !car.published
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la publication');
      }

      if (onUpdate) {
        onUpdate();
      }

      // Actualiser la page pour voir les changements
      window.location.reload();

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la publication de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <button disabled className="flex-1 btn-secondary opacity-50 cursor-not-allowed">
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2"></div>
          Traitement...
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handlePublishToggle}
      className={`flex-1 font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg btn-hover-lift px-4 py-3 rounded-xl ${
        car.published
          ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
      }`}
    >
      {car.published ? (
        <>
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m3.878-3.878L21 3m-6.122 6.878L12 12" />
          </svg>
          Dépublier
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Publier
        </>
      )}
    </button>
  );
}