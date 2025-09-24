"use client"

export default function CancelPage() {
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg text-center">
      <div className="text-red-600 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Paiement annulé
      </h1>
      
      <p className="text-gray-600 mb-6">
        Votre paiement a été annulé. Aucun montant n&apos;a été débité.
      </p>
      
      <button
        onClick={() => window.location.href = '/'}
        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
      >
        Retour à l&apos;accueil
      </button>
    </div>
  );
}