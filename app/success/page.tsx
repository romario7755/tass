'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg text-center">
      <div className="text-green-600 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Paiement réussi !
      </h1>
      
      <p className="text-gray-600 mb-4">
        Merci pour votre achat. Vous allez recevoir un email de confirmation.
      </p>
      
      {sessionId && (
        <p className="text-sm text-gray-500">
          Référence: {sessionId}
        </p>
      )}
      
      <button
        onClick={() => window.location.href = '/'}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Retour à l'accueil
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}