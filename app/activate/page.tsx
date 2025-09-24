"use client"
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ActivatePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_active'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('Token d\'activation manquant')
      return
    }

    activateAccount(token)
  }, [searchParams])

  const activateAccount = async (token: string) => {
    try {
      const response = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
      } else {
        if (data.message.includes('déjà activé')) {
          setStatus('already_active')
        } else {
          setStatus('error')
        }
        setMessage(data.message)
      }
    } catch (error) {
      setStatus('error')
      setMessage('Erreur lors de l\'activation du compte')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Activation du compte
          </h2>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10 border border-blue-100">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                  <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Activation en cours...
                </h3>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🎉 Compte activé avec succès !
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {message}
                </p>
                <Link
                  href="/login"
                  className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 hover:scale-105"
                >
                  Se connecter maintenant
                </Link>
              </>
            )}

            {status === 'already_active' && (
              <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Compte déjà activé
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {message}
                </p>
                <Link
                  href="/login"
                  className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105"
                >
                  Se connecter
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Erreur d'activation
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {message}
                </p>
                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105"
                  >
                    Créer un nouveau compte
                  </Link>
                  <Link
                    href="/"
                    className="w-full inline-flex justify-center items-center py-3 px-6 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}