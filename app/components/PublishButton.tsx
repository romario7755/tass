"use client"
export default function PublishButton({
  title, price, userId, destinationAccountId,
}: { title: string; price: number; userId: string; destinationAccountId: string }) {
  const pay = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price, userId, destinationAccountId }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else alert("Erreur paiement")
  }
  return <button onClick={pay} className="bg-blue-600 text-white px-4 py-2 rounded">
    Publier « {title} » — {price} €
  </button>
}
