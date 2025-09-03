"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) setError("Identifiants invalides")
    else router.push("/dashboard")
  }

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col gap-3">
      <h1 className="text-xl font-bold">Connexion</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2" placeholder="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white p-2 rounded">Se connecter</button>
      </form>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="bg-red-600 text-white p-2 rounded"
      >
        Continuer avec Google
      </button>
    </div>
  )
}
