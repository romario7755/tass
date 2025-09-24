"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from "@/lib/auth-client"
import Link from 'next/link'
import Image from 'next/image'
import CheckoutButton from '@/app/components/CheckoutButton'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

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
  createdAt: string
  user: {
    name?: string
    email?: string
  }
}

export default function CarDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/public`)
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des annonces')
        }
        const cars = await response.json()
        const foundCar = cars.find((c: Car) => c.id === params.id)

        if (!foundCar) {
          setError('Article non trouvé')
        } else {
          setCar(foundCar)
        }
      } catch (error) {
        console.error('Erreur:', error)
        setError('Erreur lors du chargement de l\'article')
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-gray-300 h-96 rounded-3xl mb-8"></div>
              <div className="bg-gray-300 h-8 w-3/4 mb-4 rounded"></div>
              <div className="bg-gray-300 h-6 w-1/2 mb-8 rounded"></div>
              <div className="bg-gray-300 h-20 w-full rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-3xl p-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h2>
              <p className="text-gray-600 mb-8">{error}</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const images = [car.imageUrl, car.imageUrl2, car.imageUrl3].filter(Boolean)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors duration-300">
              Accueil
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="text-gray-900 font-medium">{car.title}</span>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-gray-100">
                {images.length > 0 ? (
                  <img
                    src={images[currentImageIndex]}
                    alt={car.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget
                      img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad1)' width='400' height='300'/%3E%3Ctext fill='white' font-size='18' font-weight='bold' x='50%25' y='45%25' text-anchor='middle' dominant-baseline='middle'%3E🚗 TASS-AUTO PREMIUM%3C/text%3E%3Ctext fill='white' font-size='14' x='50%25' y='60%25' text-anchor='middle' dominant-baseline='middle'%3EImage non disponible%3C/text%3E%3C/svg%3E"
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div className="flex space-x-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? 'border-blue-500 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${car.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Détails */}
            <div className="space-y-8">
              {/* Prix et titre */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    {car.title}
                  </h1>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                    <span className="text-3xl font-bold">
                      {car.price.toLocaleString()} €
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 text-lg mb-6">
                  <span className="font-semibold">{car.brand}</span>
                  <span className="mx-3">•</span>
                  <span>{car.model}</span>
                  <span className="mx-3">•</span>
                  <span>{car.year}</span>
                </div>
              </div>

              {/* Caractéristiques */}
              <div className="bg-gray-50 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Caractéristiques</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kilométrage</p>
                      <p className="font-semibold text-gray-900">{car.mileage.toLocaleString()} km</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10a5.94 5.94 0 01.6 4.3c0 .3-.1.6-.3.8a8 8 0 008.4 3.6z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Carburant</p>
                      <p className="font-semibold text-gray-900">{car.fuel}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transmission</p>
                      <p className="font-semibold text-gray-900">{car.transmission}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Année</p>
                      <p className="font-semibold text-gray-900">{car.year}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div className="bg-white border border-gray-200 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {car.description}
                  </p>
                </div>
              )}

              {/* Vendeur */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vendeur</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {car.user.name ? car.user.name[0].toUpperCase() : car.user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{car.user.name || 'Utilisateur'}</p>
                    
                  </div>
                </div>
              </div>

              {/* Bouton d'achat */}
              <div className="bg-white border-2 border-gray-100 rounded-3xl p-8">
                {session ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Prêt à acheter ?</h3>
                    <CheckoutButton
                      items={[{
                        id: car.id,
                        name: car.title,
                        price: car.price,
                        quantity: 1
                      }]}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Connectez-vous pour acheter</h3>
                      <p className="text-gray-600 mb-6">
                        Vous devez être connecté pour effectuer un achat sécurisé.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Link
                        href={`/login?redirect=/cars/${car.id}&buy=${car.id}`}
                        className="w-full inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        Se connecter pour acheter
                      </Link>
                      <Link
                        href={`/register?redirect=/cars/${car.id}&buy=${car.id}`}
                        className="w-full inline-block bg-white hover:bg-gray-50 text-blue-600 font-semibold py-4 px-8 rounded-xl text-center transition-all duration-300 border-2 border-blue-600 hover:border-blue-700"
                      >
                        Créer un compte pour acheter
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}