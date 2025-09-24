"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import PublishButton from "@/app/components/PublishButton"

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
  description: string
  published: boolean
  imageUrl?: string
  imageUrl2?: string
  imageUrl3?: string
  commission?: number
  netPrice?: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({})


  // Redirection si non authentifié
  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  // Récupération des voitures
  async function fetchCars() {
    try {
      const res = await fetch("/api/cars")
      if (res.ok) {
        const data = await res.json()
        const carsWithCommission = data.map((car: Car) => ({
          ...car,
          commission: car.price * 0.05,
          netPrice: car.price * 0.95
        }))
        setCars(carsWithCommission)
      }
    } catch {
      console.error("Erreur récupération voitures")
    }
  }

  useEffect(() => {
    if (session) fetchCars()
  }, [session])


  // Supprimer une voiture
  async function handleDelete(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return
    
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchCars()
        alert("Annonce supprimée")
      }
    } catch {
      alert("Erreur lors de la suppression")
    }
  }

  // Navigation entre images
  const nextImage = (carId: string, car: Car) => {
    const images = [car.imageUrl, car.imageUrl2, car.imageUrl3].filter(Boolean)
    const currentIndex = currentImageIndex[carId] || 0
    const nextIndex = (currentIndex + 1) % images.length
    setCurrentImageIndex({ ...currentImageIndex, [carId]: nextIndex })
  }

  const prevImage = (carId: string, car: Car) => {
    const images = [car.imageUrl, car.imageUrl2, car.imageUrl3].filter(Boolean)
    const currentIndex = currentImageIndex[carId] || 0
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentImageIndex({ ...currentImageIndex, [carId]: prevIndex })
  }


  

  return (
    
    
  <div>
      {/* Liste des voitures avec carrousel d'images */}
      <>
        <h2 className="text-xl font-bold mb-4">Mes annonces ({cars.length})</h2>
        
        {cars.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Aucune annonce pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => {
              const images = [car.imageUrl, car.imageUrl2, car.imageUrl3].filter(Boolean)
              const currentIndex = currentImageIndex[car.id] || 0
              
              return (
                <div key={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="h-48 w-full bg-gray-100 relative">
                    {images.length > 0 ? (
                      <>
                        <Image
                          src={images[currentIndex]!}
                          alt={car.title}
                          width={400}
                          height={192}
                          className="w-full h-full object-cover"
                        />

                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => prevImage(car.id, car)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                            >
                              ←
                            </button>
                            <button
                              onClick={() => nextImage(car.id, car)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                            >
                              →
                            </button>

                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                              {images.map((_, index) => (
                                <div
                                  key={index}
                                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                      ? 'bg-white shadow-lg scale-110'
                                      : 'bg-white/50 hover:bg-white/80'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                        <div className="text-center text-white">
                          <div className="text-5xl mb-3">🚗</div>
                          <span className="text-lg font-bold">TASS-AUTO Premium</span>
                          <p className="text-sm opacity-80 mt-1">Image à venir</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{car.title}</h3>
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-2xl font-bold text-blue-600">{car.price.toLocaleString()} €</p>
                      <p className="text-sm text-green-600">
                        Net vendeur: {car.netPrice?.toLocaleString()} € (après commission 5%)
                      </p>
                    </div>
                    
                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>{car.brand} {car.model} • {car.year}</p>
                      <p>📍 {car.mileage?.toLocaleString()} km</p>
                      <p>⛽ {car.fuel} • ⚙️ {car.transmission}</p>
                    </div>
                    
                    {car.description && (
                      <p className="mt-3 text-sm text-gray-500 line-clamp-2">{car.description}</p>
                    )}
                    
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => handleDelete(car.id)} 
                        className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm font-medium"
                      >
                        Supprimer
                      </button>
                      <PublishButton carId={car.id} car={car} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        </>  
    </div>
  )
}