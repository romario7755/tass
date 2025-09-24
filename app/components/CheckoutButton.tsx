'use client';
import { useState } from 'react';
import getStripe from '@/app/lib/stripe-client';
import type { CheckoutItem } from '@/app//type/stripe';

interface CheckoutButtonProps {
  items: CheckoutItem[];
}

export default function CheckoutButton({ items = [] }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Vérification renforcée
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('Aucun article à acheter');
      }

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe non disponible');
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de paiement');
      }

      const { sessionId } = await response.json();

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      console.error('Erreur checkout:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calcul sécurisé du total
  const total = Array.isArray(items) 
    ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheckout}
        disabled={loading || !items?.length}
        className="btn-primary w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        <span className="relative z-10 flex items-center justify-center">
          {loading ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Redirection...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 17a2 2 0 11-4 0 2 2 0 014 0zM9 17a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Payer {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
      </button>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fade-in-up">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-xs text-red-600 hover:text-red-800 underline mt-2 font-medium"
              >
                Fermer ce message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}