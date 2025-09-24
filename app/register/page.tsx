"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp } from "@/lib/auth-client"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    
    try {
      const result = await signUp.email({
        name,
        email,
        password,
      })
      
      if (result.error) {
        setError(result.error.message || "Erreur lors de l'inscription")
      } else {
        setSuccess("🎉 Compte créé avec succès ! Vous pouvez maintenant vous connecter.")
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search)
          const buyParam = urlParams.get('buy')
          const redirectParam = urlParams.get('redirect')

          let loginUrl = "/login?registered=true"
          if (buyParam) {
            loginUrl += `&buy=${buyParam}`
          }
          if (redirectParam) {
            loginUrl += `&redirect=${encodeURIComponent(redirectParam)}`
          }

          router.push(loginUrl)
        }, 2000)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center px-4">
      {/* Particles background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <Link href="/" className="inline-flex items-center text-white/80 hover:text-white font-medium mb-8 transition-all duration-300 group">
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Retour à l'accueil
        </Link>
        
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
          <p className="text-white/70">Rejoignez-nous dès aujourd'hui</p>
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
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-6">
          <div className="group">
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2 group-focus-within:text-white transition-colors duration-300">
              Nom complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input 
                id="name"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-white/40 backdrop-blur-sm" 
                placeholder="Votre nom complet" 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                required
              />
            </div>
          </div>
          
          <div className="group">
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2 group-focus-within:text-white transition-colors duration-300">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input 
                id="email"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-white/40 backdrop-blur-sm" 
                placeholder="votre@email.com" 
                type="email" 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                required
              />
            </div>
          </div>
          
          <div className="group">
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2 group-focus-within:text-white transition-colors duration-300">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input 
                id="password"
                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-white/40 backdrop-blur-sm" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/80 transition-colors duration-300"
                onClick={() => setShowPassword(!showPassword)}
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
            <p className="text-xs text-white/50 mt-1 ml-1">Minimum 6 caractères</p>
          </div>
          
          <div className="group">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2 group-focus-within:text-white transition-colors duration-300">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input 
                id="confirmPassword"
                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-white/40 backdrop-blur-sm" 
                placeholder="••••••••" 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={e=>setConfirmPassword(e.target.value)} 
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/80 transition-colors duration-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
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
            <p className="text-xs text-white/50 mt-1 ml-1">Ressaisissez votre mot de passe</p>
          </div>
          
          <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-emerald-500/25">
            Créer mon compte
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Vous avez déjà un compte ?{" "}
            <a href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300 hover:underline">
              Se connecter
            </a>
          </p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-xs text-white/50 text-center">
            En créant un compte, vous acceptez nos{" "}
            <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 hover:underline">conditions d'utilisation</a>{" "}
            et notre{" "}
            <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 hover:underline">politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
