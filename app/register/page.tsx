"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    if (res.ok) router.push("/login")
    else {
      const data = await res.json()
      setError(data.error || "Erreur")
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto p-6 flex flex-col gap-3">
      <h1 className="text-xl font-bold">Créer un compte</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input className="border p-2" placeholder="Nom" value={name} onChange={e=>setName(e.target.value)} />
      <input className="border p-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2" placeholder="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-green-600 text-white p-2 rounded">S’inscrire</button>
    </form>
  )
}
