"use client"
import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Un email de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception.")
      } else {
        setError(data.error || "Une erreur est survenue")
      }
    } catch (err: unknown) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <Link href="/login" className="inline-flex items-center text-white/80 hover:text-white font-medium mb-8 transition-all duration-300 group">
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Retour à la connexion
        </Link>
        
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mot de passe oublié</h1>
          <p className="text-white/70">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-green-300 text-sm">{message}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2 group-focus-within:text-white transition-colors duration-300">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/40 group-focus-within:text-orange-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-white/40 backdrop-blur-sm" 
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-orange-500/25 disabled:scale-100 disabled:shadow-none"
          >
            {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Vous vous souvenez de votre mot de passe ?{" "}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-300 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
