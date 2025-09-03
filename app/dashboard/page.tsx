"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
  imageUrl?: string
  commission?: number
  netPrice?: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    title: "",
    price: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    fuel: "Essence",
    transmission: "Manuelle",
    description: "",
    image: null as File | null,
  })

  // Redirection si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

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
    } catch (error) {
      console.error("Erreur récupération voitures:", error)
    }
  }

  useEffect(() => {
    if (session) fetchCars()
  }, [session])

  // Prévisualisation de l'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB")
        return
      }
      
      setForm({ ...form, image: file })
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Création voiture avec upload image
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!form.title || !form.price || !form.brand || !form.model) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    setLoading(true)
    setUploadProgress(0)

    try {
      let imageUrl = ""
      
      if (form.image) {
        setUploadProgress(25)
        const formData = new FormData()
        formData.append("file", form.image)
        
        const uploadRes = await fetch("/api/upload", { 
          method: "POST", 
          body: formData 
        })
        
        if (!uploadRes.ok) {
          const error = await uploadRes.json()
          throw new Error(error.error || "Erreur upload image")
        }
        
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
        setUploadProgress(50)
      }

      setUploadProgress(75)
      const carRes = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          year: parseInt(form.year),
          mileage: parseInt(form.mileage),
          imageUrl,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
        }),
      })

      if (!carRes.ok) {
        throw new Error("Erreur création annonce")
      }

      setUploadProgress(100)
      
      setForm({
        title: "",
        price: "",
        brand: "",
        model: "",
        year: "",
        mileage: "",
        fuel: "Essence",
        transmission: "Manuelle",
        description: "",
        image: null,
      })
      setImagePreview(null)
      
      await fetchCars()
      alert("Annonce créée avec succès!")
      
    } catch (error) {
      console.error("Erreur:", error)
      alert(error instanceof Error ? error.message : "Erreur lors de la création")
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  // Supprimer une voiture
  async function handleDelete(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return
    
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchCars()
        alert("Annonce supprimée")
      }
    } catch (error) {
      alert("Erreur lors de la suppression")
    }
  }

  const stats = {
    totalCars: cars.length,
    totalValue: cars.reduce((sum, car) => sum + car.price, 0),
    totalCommission: cars.reduce((sum, car) => sum + (car.commission || 0), 0),
    averagePrice: cars.length > 0 ? cars.reduce((sum, car) => sum + car.price, 0) / cars.length : 0
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue, {session?.user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Déconnexion
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total annonces</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalCars}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Valeur totale</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalValue.toLocaleString()} €</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Commission (5%)</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalCommission.toLocaleString()} €</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Prix moyen</h3>
          <p className="text-2xl font-bold text-gray-800">{Math.round(stats.averagePrice).toLocaleString()} €</p>
        </div>
      </div>

      {/* Formulaire ajout voiture */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Ajouter une nouvelle annonce</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'annonce *</label>
              <input 
                placeholder="Ex: Peugeot 308 - Excellent état" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
              <input 
                placeholder="15000" 
                type="number" 
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: e.target.value })} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {form.price && (
                <p className="text-sm text-gray-500 mt-1">
                  Vous recevrez: {(parseFloat(form.price) * 0.95).toFixed(2)} € (après commission 5%)
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
              <input 
                placeholder="Peugeot" 
                value={form.brand} 
                onChange={(e) => setForm({ ...form, brand: e.target.value })} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle *</label>
              <input 
                placeholder="308" 
                value={form.model} 
                onChange={(e) => setForm({ ...form, model: e.target.value })} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input 
                placeholder="2020" 
                type="number" 
                value={form.year} 
                onChange={(e) => setForm({ ...form, year: e.target.value })} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
              <input 
                placeholder="50000" 
                type="number" 
                value={form.mileage} 
                onChange={(e) => setForm({ ...form, mileage: e.target.value })} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
              <select 
                value={form.fuel} 
                onChange={(e) => setForm({ ...form, fuel: e.target.value })} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybride">Hybride</option>
                <option value="Electrique">Électrique</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select 
                value={form.transmission} 
                onChange={(e) => setForm({ ...form, transmission: e.target.value })} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Manuelle">Manuelle</option>
                <option value="Automatique">Automatique</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              placeholder="Décrivez votre véhicule..." 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo du véhicule</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Prévisualisation" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Création en cours...' : 'Créer l\'annonce'}
          </button>
        </form>
      </div>

      {/* Liste des voitures avec images */}
      <div>
        <h2 className="text-xl font-bold mb-4">Mes annonces ({cars.length})</h2>
        
        {cars.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Aucune annonce pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 w-full bg-gray-100">
                  {car.imageUrl ? (
                    <img 
                      src={car.imageUrl} 
                      alt={car.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget
                        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage non disponible%3C/text%3E%3C/svg%3E"
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-200">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
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
                    <button 
                      className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition text-sm font-medium"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}