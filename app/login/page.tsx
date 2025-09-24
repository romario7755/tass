"use client"
import { signIn } from "@/lib/auth-client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const reset = searchParams.get('reset')
    const registered = searchParams.get('registered')
    const buyParam = searchParams.get('buy')

    if (reset === 'success') {
      setSuccess("Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.")
    } else if (registered === 'true') {
      setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.")
    } else if (errorParam === 'auth_error') {
      setError("Erreur d'authentification. Veuillez vous reconnecter.")
    } else if (buyParam) {
      setSuccess("Connectez-vous pour finaliser votre achat.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validation côté client
    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      setLoading(false)
      return
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide")
      setLoading(false)
      return
    }

    try {
      await signIn.email(
        { email, password },
        {
          onSuccess: () => {
            setError("")
            setSuccess("Connexion réussie ! Redirection...")

            // Vérifier s'il y a un paramètre d'achat
            const buyParam = searchParams.get('buy')
            const redirectParam = searchParams.get('redirect')

            if (buyParam) {
              // Rediriger vers l'achat automatiquement
              setTimeout(() => {
                window.location.href = `/api/checkout?items=${encodeURIComponent(JSON.stringify([{
                  id: buyParam,
                  quantity: 1
                }]))}`
              }, 1000)
            } else if (redirectParam) {
              // Redirection personnalisée
              window.location.href = redirectParam
            } else {
              // Redirection par défaut vers dashboard
              window.location.href = "/dashboard"
            }
          },
          onError: (ctx) => {
            console.error("Erreur de connexion:", ctx.error)

            const errorMessage = (ctx.error as { message?: string })?.message || ""
            const errorCode = (ctx.error as { code?: string })?.code || ""

            if (errorMessage.includes("email_not_verified") ||
                errorCode === "EMAIL_NOT_VERIFIED") {
              setError("Veuillez vérifier votre email avant de vous connecter. Vérifiez votre boîte de réception.")
            } else if (errorMessage.includes("Invalid credentials") ||
                       errorMessage.includes("invalid_credentials") ||
                       errorMessage.includes("INVALID_CREDENTIALS") ||
                       errorCode === "INVALID_CREDENTIALS") {
              setError("Email ou mot de passe incorrect.")
            } else if (errorMessage.includes("TOO_MANY_REQUESTS") ||
                       errorCode === "TOO_MANY_REQUESTS") {
              setError("Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.")
            } else if (errorMessage.includes("USER_NOT_FOUND") ||
                       errorCode === "USER_NOT_FOUND") {
              setError("Aucun compte trouvé avec cette adresse email.")
            } else {
              setError(errorMessage || "Erreur de connexion. Veuillez réessayer.")
            }
          }
        }
      )
    } catch (error) {
      console.error("Exception lors de la connexion:", error)
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }


  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      })
    } catch (error) {
      console.error("Erreur lors de la connexion Google:", error)
      setError("Erreur lors de la connexion avec Google. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Éléments de fond décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 -right-4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8">
          {/* Lien de retour */}
          <Link
            href="/"
            className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors duration-300 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour à l&apos;accueil
          </Link>

          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-white/60 text-lg">Connectez-vous à votre compte</p>
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm" role="alert">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-red-300 text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Messages de succès */}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm" role="alert">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-emerald-300 text-sm leading-relaxed">{success}</p>
              </div>
            </div>
          )}


          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Champ email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-white/90">
                Adresse email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-white/40 backdrop-blur-sm text-lg"
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  aria-describedby={error && error.includes('email') ? 'email-error' : undefined}
                />
              </div>
            </div>

            {/* Champ mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-white/90">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-white/40 backdrop-blur-sm text-lg"
                  placeholder="••••••••••"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/80 transition-colors duration-300"
                  disabled={loading}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Lien mot de passe oublié */}
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300 hover:underline"
                tabIndex={loading ? -1 : 0}
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-blue-500/25 disabled:scale-100 disabled:shadow-none text-lg disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </div>
              ) : "Se connecter"}
            </button>
          </form>

          {/* Séparateur */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900/50 text-white/60 rounded-full backdrop-blur-sm font-medium">
                  Ou continuer avec
                </span>
              </div>
            </div>

            {/* Bouton de connexion Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mt-6 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>

          {/* Lien d'inscription */}
          <div className="mt-8 text-center">
            <p className="text-white/60">
              Pas encore de compte ?{" "}
              <Link 
                href="/register" 
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                tabIndex={loading ? -1 : 0}
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}