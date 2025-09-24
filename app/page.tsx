"use client"

import { useSession } from "@/lib/auth-client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Loading from "./components/Loading"
import CheckoutButton from "./components/CheckoutButton"
import Header from "./components/Header"
import Footer from "./components/Footer"
import RatingsSummary from "./components/RatingsSummary"
import Image from "next/image"

interface Car {
  id: string
  title: string
  price: number
  brand: string
  model: string
  year: number
  mileage: number
  fuel: string
  transmission: string
  description?: string
  imageUrl?: string
  imageUrl2?: string
  imageUrl3?: string
  user: {
    name?: string
    email?: string
  }
}

export default function Home() {
  const { data: session } = useSession()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0) // Initialize currentIndex

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars/public')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des annonces')
        }
        const data = await response.json()
        setCars(data)
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen flex items-center pt-16 hero-mobile">
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Advanced animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-morphing-advanced"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-hero-glow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-complex-float"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-morphing-advanced animation-delay-4000"></div>
        </div>

        {/* Enhanced floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-60 animate-particle-float"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full opacity-80 animate-complex-float"></div>
          <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-purple-300 rounded-full opacity-40 animate-particle-float animation-delay-500"></div>
          <div className="absolute top-60 right-1/4 w-1 h-1 bg-cyan-300 rounded-full opacity-70 animate-complex-float animation-delay-1000"></div>
          <div className="absolute top-1/3 left-1/6 w-2 h-2 bg-pink-400 rounded-full opacity-50 animate-particle-float animation-delay-2000"></div>
          <div className="absolute bottom-1/3 right-1/6 w-1 h-1 bg-indigo-400 rounded-full opacity-60 animate-complex-float animation-delay-4000"></div>
          <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-yellow-400 rounded-full opacity-40 animate-particle-float animation-delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 text-center z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tight animate-title-pulse hero-title-mobile">
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                TASS-AUTO
              </span>
            </h1>
            <div className="text-2xl md:text-3xl text-blue-100 mb-10 max-w-4xl mx-auto leading-relaxed hero-subtitle-mobile mobile-text-xl">
              <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent font-semibold">
                La plateforme premium pour l'achat et la vente de véhicules d'exception
              </span>
            </div>
            <div className="flex items-center justify-center space-x-4 mb-12">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-cyan-400 animate-pulse"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"></div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent via-purple-400 to-pink-400 animate-pulse"></div>
            </div>

            {/* Decorative floating icons */}
            <div className="absolute top-10 left-10 text-blue-300 opacity-20 animate-complex-float">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="absolute top-20 right-20 text-purple-300 opacity-20 animate-particle-float">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute bottom-10 left-20 text-cyan-300 opacity-20 animate-complex-float animation-delay-2000">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          
          {!session && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fade-in-up animation-delay-500">
              <Link
                href="/login"
                className="group relative overflow-hidden inline-flex items-center px-10 py-5 text-lg font-bold rounded-full text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-700 shadow-2xl hover:shadow-blue-500/40 transform hover:-translate-y-3 hover:scale-105 border border-blue-500/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400 before:to-cyan-400 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-20"
              >
                <span className="relative z-10 mr-2">Se connecter</span>
                <svg className="relative z-10 w-5 h-5 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
              </Link>
              <Link
                href="/register"
                className="group relative overflow-hidden inline-flex items-center px-10 py-5 text-lg font-bold rounded-full text-blue-600 bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-700 shadow-2xl hover:shadow-white/40 transform hover:-translate-y-3 hover:scale-105 border border-white/30 hover:border-blue-300/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-100 before:to-purple-100 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-30"
              >
                <span className="relative z-10 mr-2">S'inscrire</span>
                <svg className="relative z-10 w-5 h-5 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </Link>
            </div>
          )}

          {session && (
            <div className="mb-12 animate-fade-in-up animation-delay-500">
              <p className="text-blue-100 mb-6 text-xl font-medium">
                Bienvenue, <span className="text-white font-bold bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">{session.user?.name || session.user?.email}</span>
              </p>
              <Link
                href="/dashboard"
                className="group relative overflow-hidden inline-flex items-center px-10 py-5 text-lg font-bold rounded-full text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 transition-all duration-700 shadow-2xl hover:shadow-green-500/40 transform hover:-translate-y-3 hover:scale-105 border border-green-500/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-400 before:to-green-400 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-20"
              >
                <span className="relative z-10 mr-2">Tableau de bord</span>
                <svg className="relative z-10 w-5 h-5 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
              </Link>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium mb-2 opacity-80">Découvrir</span>
            <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <div className="inline-block p-2 bg-blue-100 rounded-full mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-6">
              Pourquoi choisir TASS-AUTO ?
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Une expérience d'achat automobile <span className="text-blue-600 font-semibold">révolutionnaire</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            <div className="group text-center p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 border border-white/50 hover:border-blue-200/70 transform hover:-translate-y-6 hover:scale-105 hover:rotate-1 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/30 before:to-cyan-50/30 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100 feature-card-mobile mobile-shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-300/50 relative z-10 feature-icon-mobile">
                <svg className="w-10 h-10 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-blue-600 transition-colors duration-500 relative z-10">Véhicules Vérifiés</h3>
              <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300 relative z-10">Tous nos véhicules sont inspectés et certifiés par des experts pour votre tranquillité d'esprit</p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full group-hover:w-20 group-hover:h-1.5 transition-all duration-500 relative z-10"></div>

              {/* Micro-interactions - particles */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              </div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-500">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="group text-center p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-700 border border-white/50 hover:border-green-200/70 transform hover:-translate-y-6 hover:scale-105 hover:rotate-1 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-green-50/30 before:to-emerald-50/30 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100 feature-card-mobile mobile-shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-green-300/50 relative z-10">
                <svg className="w-10 h-10 text-green-600 group-hover:text-green-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-green-600 transition-colors duration-500 relative z-10">Transactions Sécurisées</h3>
              <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300 relative z-10">Paiements 100% sécurisés avec notre système de protection bancaire intégré</p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full group-hover:w-20 group-hover:h-1.5 transition-all duration-500 relative z-10"></div>

              {/* Micro-interactions - particles */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-600">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="group text-center p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-700 border border-white/50 hover:border-purple-200/70 transform hover:-translate-y-6 hover:scale-105 hover:rotate-1 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-50/30 before:to-pink-50/30 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100 feature-card-mobile mobile-shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-300/50 relative z-10">
                <svg className="w-10 h-10 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-purple-600 transition-colors duration-500 relative z-10">Service Rapide</h3>
              <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300 relative z-10">Support client réactif 24/7 et processus d'achat simplifié en quelques clics</p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-600 mx-auto rounded-full group-hover:w-20 group-hover:h-1.5 transition-all duration-500 relative z-10"></div>

              {/* Micro-interactions - particles */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              </div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-700">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Section */}
      <div id="vehicles" className="container mx-auto px-4 py-16">

        {/* Section titre des annonces */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Véhicules Disponibles</h2>
          <p className="text-xl text-gray-600">Découvrez notre sélection de véhicules d'exception</p>
        </div>

        {/* Liste des annonces */}
        {cars.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Aucun véhicule disponible</h3>
              <p className="text-gray-600">Revenez bientôt pour découvrir nos nouvelles annonces</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100 hover:border-blue-300/50 transform hover:-translate-y-4 hover:scale-[1.03] hover:rotate-1 card-animation relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/50 before:to-purple-50/50 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100 block cursor-pointer"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="relative overflow-hidden h-64">
                  {car.imageUrl ? (
                    <div className="relative h-full">
                     <img
                          src={car.imageUrl}
                          alt={car.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                          onError={(e) => {
                            const img = e.currentTarget
                            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad1)' width='400' height='300'/%3E%3Ctext fill='white' font-size='18' font-weight='bold' x='50%25' y='45%25' text-anchor='middle' dominant-baseline='middle'%3E🚗 TASS-AUTO PREMIUM%3C/text%3E%3Ctext fill='white' font-size='14' x='50%25' y='60%25' text-anchor='middle' dominant-baseline='middle'%3EImage non disponible%3C/text%3E%3C/svg%3E"
                          }}
                        />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 group-hover:from-blue-200/70 group-hover:to-purple-200/70 transition-colors duration-700"></div>
                      <svg className="w-20 h-20 text-gray-400 z-10 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                  
                  {/* Badge prix amélioré */}
                  <div className="absolute top-6 right-6 z-20">
                    <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-white/50 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                      <span className="text-2xl font-bold text-blue-600 group-hover:text-white transition-colors duration-500">
                        {car.price.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  {/* Overlay avec icône de vue amélioré */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700 flex items-center justify-center z-10">
                    <div className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-700">
                      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-full shadow-2xl border border-white/30 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-500">
                        <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Nouveaux éléments décoratifs */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {car.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <span className="font-semibold">{car.brand}</span>
                      <span className="mx-2">•</span>
                      <span>{car.model}</span>
                      <span className="mx-2">•</span>
                      <span>{car.year}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <span className="text-gray-600">{car.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10a5.94 5.94 0 01.6 4.3c0 .3-.1.6-.3.8a8 8 0 008.4 3.6z"></path>
                      </svg>
                      <span className="text-gray-600">{car.fuel}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="text-gray-600">{car.transmission}</span>
                    </div>
                  </div>
                  
                  {car.description && (
                    <p className="text-gray-700 mb-6 line-clamp-3 leading-relaxed">
                      {car.description}
                    </p>
                  )}
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span>Vendu par {car.user.name || car.user.email}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700 group-hover:scale-105">
                      Voir les détails
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1000ms'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Des milliers de clients satisfaits nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 hover:rotate-1 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/10 before:to-cyan-500/10 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100">
              <div className="flex items-center mb-6 relative z-10">
                <div className="flex text-yellow-400 group-hover:text-yellow-300 transition-colors duration-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-300"
                      style={{transitionDelay: `${i * 100}ms`}}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-white/90 text-lg mb-6 leading-relaxed group-hover:text-white transition-colors duration-500 relative z-10">
                "Service exceptionnel ! J'ai trouvé la voiture de mes rêves en quelques clics. L'équipe TASS-AUTO est vraiment professionnelle."
              </p>
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-400/50">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <p className="text-white font-semibold group-hover:text-blue-100 transition-colors duration-300">Marie Dubois</p>
                  <p className="text-blue-200 text-sm group-hover:text-cyan-200 transition-colors duration-300">Cliente depuis 2023</p>
                </div>
              </div>

              {/* Micro-interactions */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              </div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 hover:rotate-1 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-green-500/10 before:to-emerald-500/10 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100">
              <div className="flex items-center mb-6 relative z-10">
                <div className="flex text-yellow-400 group-hover:text-yellow-300 transition-colors duration-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-300"
                      style={{transitionDelay: `${i * 100}ms`}}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-white/90 text-lg mb-6 leading-relaxed group-hover:text-white transition-colors duration-500 relative z-10">
                "Transaction ultra-sécurisée et rapide. Je recommande vivement TASS-AUTO pour l'achat de véhicules de qualité."
              </p>
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-green-400/50">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <p className="text-white font-semibold group-hover:text-green-100 transition-colors duration-300">Pierre Martin</p>
                  <p className="text-blue-200 text-sm group-hover:text-emerald-200 transition-colors duration-300">Client depuis 2022</p>
                </div>
              </div>

              {/* Micro-interactions */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-500">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 hover:rotate-1 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/10 before:to-pink-500/10 before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100">
              <div className="flex items-center mb-6 relative z-10">
                <div className="flex text-yellow-400 group-hover:text-yellow-300 transition-colors duration-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-300"
                      style={{transitionDelay: `${i * 100}ms`}}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-white/90 text-lg mb-6 leading-relaxed group-hover:text-white transition-colors duration-500 relative z-10">
                "Interface intuitive et véhicules de qualité exceptionnelle. TASS-AUTO a dépassé toutes mes attentes !"
              </p>
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-400/50">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <p className="text-white font-semibold group-hover:text-purple-100 transition-colors duration-300">Sophie Laurent</p>
                  <p className="text-blue-200 text-sm group-hover:text-pink-200 transition-colors duration-300">Cliente depuis 2023</p>
                </div>
              </div>

              {/* Micro-interactions */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              </div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-700">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-200">Véhicules vendus</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99%</div>
              <div className="text-blue-200">Clients satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Support client</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">5⭐</div>
              <div className="text-blue-200">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Comment fonctionne TASS-AUTO ?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Découvrez le fonctionnement complet de notre plateforme premium de véhicules d'exception
              </p>
            </div>

            {/* Vue d'ensemble */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mb-16 border border-blue-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Marketplace Premium avec Commission 5%</h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  TASS-AUTO est une plateforme sécurisée qui connecte vendeurs et acheteurs de véhicules d'exception.
                  Nous prélevons une commission de 5% sur chaque vente pour garantir un service d'excellence.
                </p>
              </div>
            </div>

            {/* Architecture Technique */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Architecture & Technologies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Next.js 15</h4>
                  <p className="text-sm text-gray-600">Framework React avec App Router pour une performance optimale</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">MongoDB</h4>
                  <p className="text-sm text-gray-600">Base de données NoSQL avec Prisma ORM pour la flexibilité</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Stripe</h4>
                  <p className="text-sm text-gray-600">Paiements sécurisés avec gestion complète des transactions</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Cloudflare R2</h4>
                  <p className="text-sm text-gray-600">Stockage d'images haute performance avec CDN mondial</p>
                </div>
              </div>
            </div>

            {/* Flux Utilisateur */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Parcours Utilisateur</h3>

              {/* Pour les Vendeurs */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 mb-8 border border-green-100">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  Parcours Vendeur
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Inscription</h5>
                    <p className="text-sm text-gray-600">Création de compte avec vérification email</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Activation</h5>
                    <p className="text-sm text-gray-600">Validation du compte via email sécurisé</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Dashboard</h5>
                    <p className="text-sm text-gray-600">Accès à l'interface de gestion</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Annonce</h5>
                    <p className="text-sm text-gray-600">Création avec 3 photos max</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">5</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Vente</h5>
                    <p className="text-sm text-gray-600">95% du prix après commission</p>
                  </div>
                </div>
              </div>

              {/* Pour les Acheteurs */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 17a2 2 0 11-4 0 2 2 0 014 0zM9 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  Parcours Acheteur
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Navigation</h5>
                    <p className="text-sm text-gray-600">Parcours des véhicules disponibles</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Sélection</h5>
                    <p className="text-sm text-gray-600">Consultation détaillée du véhicule</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Connexion</h5>
                    <p className="text-sm text-gray-600">Authentification obligatoire</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Paiement</h5>
                    <p className="text-sm text-gray-600">Stripe Checkout sécurisé</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">5</div>
                    <h5 className="font-semibold text-gray-900 mb-2">Contact</h5>
                    <p className="text-sm text-gray-600">Coordonnées vendeur par email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sécurité et Features */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sécurité & Fonctionnalités</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Authentification Forte</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Vérification email obligatoire</li>
                    <li>• Hachage bcrypt des mots de passe</li>
                    <li>• Sessions JWT sécurisées</li>
                    <li>• Middleware de protection</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Gestion d'Images</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 3 images maximum par véhicule</li>
                    <li>• Limite 5MB par fichier</li>
                    <li>• Upload sécurisé vers Cloudflare R2</li>
                    <li>• Prévisualisation en temps réel</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Notifications Email</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Activation de compte</li>
                    <li>• Confirmation d'achat</li>
                    <li>• Notification de vente</li>
                    <li>• Réinitialisation mot de passe</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Analytics Vendeur</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Statistiques en temps réel</li>
                    <li>• Valeur totale du portfolio</li>
                    <li>• Commission calculée automatiquement</li>
                    <li>• Prix moyen des véhicules</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Webhooks Stripe</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Traitement automatique des paiements</li>
                    <li>• Archivage des transactions</li>
                    <li>• Notifications instantanées</li>
                    <li>• Gestion des échecs de paiement</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3">Interface Moderne</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Design responsive mobile-first</li>
                    <li>• Animations CSS avancées</li>
                    <li>• Carrousel d'images interactif</li>
                    <li>• Micro-interactions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Base de Données */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Structure de Données</h3>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-lg mr-2"></div>
                      User
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Authentification complète</li>
                      <li>• Activation par email</li>
                      <li>• Tokens de sécurité</li>
                      <li>• Relations avec cars/payments</li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <div className="w-6 h-6 bg-green-600 rounded-lg mr-2"></div>
                      Car
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Détails complets du véhicule</li>
                      <li>• 3 URLs d'images</li>
                      <li>• Statut de publication</li>
                      <li>• Relation avec vendeur</li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <div className="w-6 h-6 bg-purple-600 rounded-lg mr-2"></div>
                      Payment
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Intégration Stripe complète</li>
                      <li>• Tracking des statuts</li>
                      <li>• Commission calculée</li>
                      <li>• Liens avec user/car</li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <div className="w-6 h-6 bg-orange-600 rounded-lg mr-2"></div>
                      Purchase
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Archive des transactions</li>
                      <li>• Historique d'achats</li>
                      <li>• Liens acheteur/vendeur</li>
                      <li>• Traçabilité complète</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission et Valeurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Notre mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  Offrir une expérience d'achat automobile transparente, sécurisée et sans stress.
                  Nous connectons les vendeurs et acheteurs dans un environnement de confiance mutuelle
                  grâce à une technologie de pointe et un service client d'excellence.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Commission transparente de 5% seulement</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Paiements sécurisés via Stripe</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Notifications automatiques par email</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Nos valeurs</h3>
                <p className="text-gray-600 leading-relaxed">
                  Transparence, sécurité et innovation technologique sont au cœur de notre approche.
                  Chaque transaction est une opportunité de créer une relation de confiance durable
                  entre nos utilisateurs.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Transparence totale</h4>
                      <p className="text-gray-600 text-sm">Code source moderne, commission clairement affichée,
                      processus de paiement entièrement sécurisé et traçable</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Innovation technologique</h4>
                      <p className="text-gray-600 text-sm">Architecture moderne avec Next.js, base de données MongoDB,
                      intégration Stripe et stockage cloud Cloudflare</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluations Section */}
      <RatingsSummary />

      {/* FAQ Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
              <p className="text-xl text-gray-600">Tout ce que vous devez savoir sur TASS-AUTO</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Comment fonctionne le processus d'achat ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Notre processus est simple : parcourez nos véhicules vérifiés, contactez le vendeur, organisez un essai si souhaité, 
                  et finalisez l'achat via notre plateforme sécurisée. Nous gérons tous les aspects administratifs pour vous.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quelle est votre commission ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nous prélevons une commission de 5% sur chaque transaction, déjà incluse dans le prix affiché. 
                  Cette commission couvre l'inspection du véhicule, la sécurisation du paiement et notre support client.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Comment vendez-vous votre véhicule ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Créez votre compte, ajoutez votre annonce avec photos et description détaillée. Nos experts inspectent votre véhicule, 
                  puis nous le publions sur notre plateforme. Vous recevez 95% du prix de vente une fois la transaction finalisée.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quelles sont les garanties offertes ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tous nos véhicules bénéficient d'une garantie de 6 mois sur les éléments mécaniques principaux. 
                  Nous offrons également une garantie de remboursement de 7 jours si le véhicule ne correspond pas à la description.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h2>
              <p className="text-xl text-gray-600">Notre équipe est là pour vous accompagner</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Nom</label>
                      <input type="text" className="form-input" placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className="form-label">Email</label>
                      <input type="email" className="form-input" placeholder="votre@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Sujet</label>
                    <select className="form-input">
                      <option>Sélectionnez un sujet</option>
                      <option>Question générale</option>
                      <option>Support technique</option>
                      <option>Vendre mon véhicule</option>
                      <option>Problème avec un achat</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Message</label>
                    <textarea 
                      className="form-input min-h-[120px] resize-y" 
                      placeholder="Décrivez votre demande..."
                      rows={5}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Téléphone</h4>
                        <p className="text-gray-600">+33 1 23 45 67 89</p>
                        <p className="text-sm text-gray-500">Du lundi au vendredi, 9h-18h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                        <p className="text-gray-600">contact@enre.fr</p>
                        <p className="text-sm text-gray-500">Réponse sous 24h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Adresse</h4>
                        <p className="text-gray-600">123 Avenue des Champs-Élysées<br />75008 Paris, France</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-4">Besoin d'aide immédiate ?</h4>
                  <p className="text-gray-600 mb-6">
                    Notre chat en ligne est disponible 24/7 pour répondre à vos questions urgentes.
                  </p>
                  <button className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-300">
                    Démarrer le chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
