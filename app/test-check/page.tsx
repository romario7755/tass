'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testVerificationEmail = async () => {
    if (!email) {
      setResult({ success: false, message: 'Veuillez entrer un email' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'verification'
        }),
      });

      const data = await response.json();
      setResult({
        success: data.success,
        message: data.success
          ? `Email de vérification envoyé avec succès à ${email}`
          : `Erreur: ${data.error}`
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const testPasswordResetEmail = async () => {
    if (!email) {
      setResult({ success: false, message: 'Veuillez entrer un email' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'password-reset'
        }),
      });

      const data = await response.json();
      setResult({
        success: data.success,
        message: data.success
          ? `Email de réinitialisation envoyé avec succès à ${email}`
          : `Erreur: ${data.error}`
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Test Configuration SMTP
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vérifiez que vos emails d&apos;authentification fonctionnent
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse email de test
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="votre-email@example.com"
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={testVerificationEmail}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi...' : 'Tester Email de Vérification'}
            </button>

            <button
              onClick={testPasswordResetEmail}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi...' : 'Tester Email de Réinitialisation'}
            </button>
          </div>

          {result && (
            <div className={`mt-4 p-4 rounded-md ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {result.success ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}