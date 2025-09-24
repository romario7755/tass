"use client"

import { useSession, signOut } from "@/lib/auth-client"
import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TASS-AUTO
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Accueil
            </Link>
            <Link href="#vehicles" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Véhicules
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              À propos
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Contact
            </Link>
            <Link href="/evaluations" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Évaluations
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!session ? (
              <>
                <Link 
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Se connecter
                </Link>
                <Link 
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  S&apos;inscrire
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Tableau de bord
                </Link>
                <button
                  onClick={async () => {
                    await signOut()
                    window.location.href = '/'
                  }}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Accueil
              </Link>
              <Link href="#vehicles" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Véhicules
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                À propos
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Contact
              </Link>
              <Link href="/evaluations" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Évaluations
              </Link>
              
              <div className="border-t border-gray-200 pt-4">
                {!session ? (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      href="/login"
                      className="text-center py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                    >
                      Se connecter
                    </Link>
                    <Link 
                      href="/register"
                      className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      S&apos;inscrire
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      href="/dashboard"
                      className="text-center py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                    >
                      Tableau de bord
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut()
                        window.location.href = '/'
                      }}
                      className="text-center py-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}