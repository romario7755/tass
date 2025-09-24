"use client"

import { useSession, signOut } from "next-auth/react"
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [archivedCars, setArchivedCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({})
  
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
    images: [] as File[],
  })

  // Redirection si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Récupération des voitures actives
  async function fetchCars() {
    try {
      const res = await fetch("/api/cars?type=active")
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
      console.error("Erreur récupération voitures actives:", error)
    }
  }

  // Récupération des voitures archivées
  async function fetchArchivedCars() {
    try {
      const res = await fetch("/api/cars?type=archived")
      if (res.ok) {
        const data = await res.json()
        const carsWithCommission = data.map((car: Car) => ({
          ...car,
          commission: car.price * 0.05,
          netPrice: car.price * 0.95
        }))
        setArchivedCars(carsWithCommission)
      }
    } catch (error) {
      console.error("Erreur récupération voitures archivées:", error)
    }
  }

  useEffect(() => {
    if (session) {
      fetchCars()
      fetchArchivedCars()
    }
  }, [session])

  // Gestion multiple images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Limiter à 3 images
    if (files.length > 3) {
      alert("Vous pouvez sélectionner maximum 3 images")
      return
    }
    
    // Vérifier la taille de chaque fichier
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`L'image ${file.name} dépasse 5MB`)
        return
      }
    }
    
    setForm({ ...form, images: files })
    
    // Créer les prévisualisations
    const previews: string[] = []
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        previews.push(reader.result as string)
        if (previews.length === files.length) {
          setImagePreviews(previews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Création voiture avec upload multiple
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!form.title || !form.price || !form.brand || !form.model) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    setLoading(true)
    setUploadProgress(0)

    try {
      const imageUrls: string[] = []
      
      // Upload de chaque image
      if (form.images.length > 0) {
        const progressPerImage = 50 / form.images.length
        
        for (let i = 0; i < form.images.length; i++) {
          const formData = new FormData()
          formData.append("file", form.images[i])
          
          const uploadRes = await fetch("/api/upload", { 
            method: "POST", 
            body: formData 
          })
          
          if (!uploadRes.ok) {
            const error = await uploadRes.json()
            throw new Error(error.error || `Erreur upload image ${i + 1}`)
          }
          
          const uploadData = await uploadRes.json()
          imageUrls.push(uploadData.url)
          setUploadProgress(25 + (progressPerImage * (i + 1)))
        }
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
          imageUrl: imageUrls[0] || "",
          imageUrl2: imageUrls[1] || "",
          imageUrl3: imageUrls[2] || "",
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
        images: [],
      })
      setImagePreviews([])
      
      await fetchCars()
      await fetchArchivedCars()
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
        await fetchArchivedCars()
        alert("Annonce supprimée")
      }
    } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in-up">
        <div className="showcase-card p-8 stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Bienvenue {session?.user?.name || 'Utilisateur'} !
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Gérez vos annonces et suivez vos performances
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/purchases')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg btn-hover-lift flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                </svg>
                <span className="hidden sm:inline">Mes Achats</span>
              </button>

              <div className="hidden md:flex items-center space-x-4">
                <div className="showcase-card px-6 py-4 hover:scale-105 transition-transform duration-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {new Date().toLocaleDateString('fr-FR', { day: '2-digit' })}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm">
                      {new Date().toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center animate-pulse-glow hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-xl">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                  </span>
                </div>
              </div>

              {/* Bouton de déconnexion */}
              <button
                onClick={() => signOut()}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg btn-hover-lift flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up animation-delay-500">
        <div className="showcase-card p-6 stat-card group card-animation hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center stat-card-icon">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-green-600 dark:text-green-400 text-sm font-semibold">+12%</div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Total annonces</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalCars}</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Actives ce mois</p>
        </div>

        <div className="showcase-card p-6 stat-card group card-animation hover:scale-105 transition-all duration-300" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center stat-card-icon">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="text-green-600 dark:text-green-400 text-sm font-semibold">+8%</div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Valeur totale</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalValue.toLocaleString()} €</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Portfolio actuel</p>
        </div>

        <div className="showcase-card p-6 stat-card group card-animation hover:scale-105 transition-all duration-300" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center stat-card-icon">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-green-600 dark:text-green-400 text-sm font-semibold">+15%</div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Commission (5%)</h3>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.totalCommission.toLocaleString()} €</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Revenus potentiels</p>
        </div>

        <div className="showcase-card p-6 stat-card group card-animation hover:scale-105 transition-all duration-300" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center stat-card-icon">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-green-600 dark:text-green-400 text-sm font-semibold">+5%</div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Prix moyen</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{Math.round(stats.averagePrice).toLocaleString()} €</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Par véhicule</p>
        </div>
      </div>

      {/* Formulaire ajout voiture */}
      <div className="showcase-card p-8 mb-8 animate-fade-in-up animation-delay-1000 group">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ajouter une nouvelle annonce</h2>
            <p className="text-slate-600 dark:text-slate-400">Créez une annonce pour votre véhicule</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Titre de l'annonce *</label>
              <input
                placeholder="Ex: Peugeot 308 - Excellent état"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Prix (€) *</label>
              <input
                placeholder="15000"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                required
              />
              {form.price && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Vous recevrez: {(parseFloat(form.price) * 0.95).toFixed(2)} € (après commission 5%)
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Marque *</label>
              <input
                placeholder="Peugeot"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Modèle *</label>
              <input
                placeholder="308"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Année</label>
              <input
                placeholder="2020"
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kilométrage</label>
              <input
                placeholder="50000"
                type="number"
                value={form.mileage}
                onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Carburant</label>
              <select
                value={form.fuel}
                onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              >
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybride">Hybride</option>
                <option value="Electrique">Électrique</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Transmission</label>
              <select
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="Manuelle">Manuelle</option>
                <option value="Automatique">Automatique</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
            <textarea
              placeholder="Décrivez votre véhicule en détail..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-4 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Photos du véhicule (maximum 3)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 transition-all duration-300"
              />
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-4 flex gap-3 animate-fade-in-up">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <img
                      src={preview}
                      alt={`Prévisualisation ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-400 transition-all duration-300"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {imagePreviews.length}/3 images sélectionnées
            </p>
          </div>

          {uploadProgress > 0 && (
            <div className="space-y-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">Création en cours...</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full py-4 px-6 text-lg font-semibold transition-all duration-300 btn-hover-lift ${
              loading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-[1.02] active:scale-[0.98] btn-glow'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                Création en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer l'annonce
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Liste des voitures avec carrousel d'images */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Mes annonces</h2>
              <p className="text-slate-600 dark:text-slate-400">Gérez et suivez vos véhicules en ligne</p>
            </div>
          </div>

          {/* Onglets Actives/Archivées */}
          <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 shadow-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Actives ({cars.length})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'archived'
                  ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Vendues ({archivedCars.length})
            </button>
          </div>
        </div>
        
        {(() => {
          const displayCars = activeTab === 'active' ? cars : archivedCars
          const emptyMessage = activeTab === 'active'
            ? { title: "Aucune annonce active", subtitle: "Créez votre première annonce pour commencer à vendre" }
            : { title: "Aucune annonce vendue", subtitle: "Vos véhicules vendus apparaîtront ici après confirmation de paiement" }

          return displayCars.length === 0 ? (
            <div className="showcase-card p-16 text-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {activeTab === 'active' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  )}
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{emptyMessage.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">{emptyMessage.subtitle}</p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {displayCars.map((car, index) => {
              const images = [car.imageUrl, car.imageUrl2, car.imageUrl3].filter(Boolean)
              const currentIndex = currentImageIndex[car.id] || 0
              const hasMultipleImages = images.length > 1
              
              return (
                <div key={car.id} className="showcase-card overflow-hidden group card-animation hover:scale-105 transition-all duration-500"
                     style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="h-56 w-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 relative overflow-hidden image-carousel">
                    {images.length > 0 ? (
                      <>
                        <img
                          src={car.imageUrl}
                          alt={car.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            const img = e.currentTarget
                            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad1)' width='400' height='300'/%3E%3Ctext fill='white' font-size='18' font-weight='bold' x='50%25' y='45%25' text-anchor='middle' dominant-baseline='middle'%3E🚗 TASS-AUTO PREMIUM%3C/text%3E%3Ctext fill='white' font-size='14' x='50%25' y='60%25' text-anchor='middle' dominant-baseline='middle'%3EImage non disponible%3C/text%3E%3C/svg%3E"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={() => prevImage(car.id, car)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 backdrop-blur-sm text-white rounded-full hover:bg-black/80 transition-all duration-300 flex items-center justify-center font-bold text-xl shadow-lg carousel-button"
                            >
                              ‹
                            </button>
                            <button
                              onClick={() => nextImage(car.id, car)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 backdrop-blur-sm text-white rounded-full hover:bg-black/80 transition-all duration-300 flex items-center justify-center font-bold text-xl shadow-lg carousel-button"
                            >
                              ›
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
                  
                  <div className="p-6 backdrop-blur-sm bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95">
                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">{car.title}</h3>
                    
                    <div className="mb-4">
                      <div className="price-highlight text-3xl font-black text-emerald-400 mb-2">
                        {car.price.toLocaleString()} €
                      </div>
                      <p className="text-sm text-emerald-300 font-medium flex items-center gap-1">
                        💰 Net vendeur: {car.netPrice?.toLocaleString()} € <span className="text-white/60">(après commission 5%)</span>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <div className="text-white/60 text-xs mb-1">Véhicule</div>
                        <div className="text-white font-bold text-sm">{car.brand} {car.model}</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <div className="text-white/60 text-xs mb-1">Année</div>
                        <div className="text-white font-bold text-sm">{car.year}</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <div className="text-white/60 text-xs mb-1">Kilométrage</div>
                        <div className="text-white font-bold text-sm">{car.mileage?.toLocaleString()} km</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <div className="text-white/60 text-xs mb-1">Type</div>
                        <div className="text-white font-bold text-sm">{car.fuel}</div>
                      </div>
                    </div>
                    
                    {car.description && (
                      <div className="bg-white/10 rounded-xl p-3 mb-4">
                        <p className="text-white/80 text-sm" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>{car.description}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      {activeTab === 'active' ? (
                        <>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg btn-hover-lift"
                          >
                            🗑️ Supprimer
                          </button>
                          <div className="flex-1">
                            <PublishButton carId={car.id} car={car} onUpdate={() => { fetchCars(); fetchArchivedCars(); }} />
                          </div>
                        </>
                      ) : (
                        <div className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl font-bold text-sm text-center">
                          ✅ Vendu avec succès
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          )
        })()}
      </div>
      </div>
    </div>
  )
}