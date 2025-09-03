import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.car.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Voiture introuvable" }, { status: 404 })
  }
}
