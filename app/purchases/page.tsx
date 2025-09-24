'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Purchase {
  id: string
  amount: number
  purchaseDate: string
  status: string
  car: {
    id: string
    title: string
    brand: string
    model: string
    year: number
    price: number
    imageUrl?: string
    user: {
      name: string
      email: string
    }
  }
}

export default function PurchasesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }

    fetchPurchases()
  }, [session, status, router])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des achats')
      }
      const data = await response.json()
      setPurchases(data.purchases)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Mes Achats ({purchases.length})
            </h1>
          </div>

          {purchases.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-xl mb-4">Aucun achat pour le moment</p>
              <p>Vos achats apparaîtront ici après validation du paiement.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    {/* Image du véhicule */}
                    <div className="flex-shrink-0">
                      {purchase.car.imageUrl ? (
                        <img
                          src={purchase.car.imageUrl}
                          alt={purchase.car.title}
                          className="w-48 h-36 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-48 h-36 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">Pas d'image</span>
                        </div>
                      )}
                    </div>

                    {/* Informations du véhicule */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {purchase.car.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Marque</p>
                          <p className="font-medium">{purchase.car.brand}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Modèle</p>
                          <p className="font-medium">{purchase.car.model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Année</p>
                          <p className="font-medium">{purchase.car.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Prix d'achat</p>
                          <p className="font-medium text-green-600">
                            {purchase.car.price.toLocaleString('fr-FR')} €
                          </p>
                        </div>
                      </div>

                      {/* Informations du vendeur */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Informations du vendeur
                        </h4>
                        <p className="text-sm text-gray-600">
                          <strong>Nom :</strong> {purchase.car.user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Email :</strong>
                          <a
                            href={`mailto:${purchase.car.user.email}`}
                            className="text-blue-600 hover:text-blue-800 ml-1"
                          >
                            {purchase.car.user.email}
                          </a>
                        </p>
                      </div>

                      {/* Informations de l'achat */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            Acheté le {new Date(purchase.purchaseDate).toLocaleDateString('fr-FR')}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span className="text-sm text-green-600 capitalize">
                              {purchase.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}