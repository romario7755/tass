import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

// ✅ Configuration correcte du client R2
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

// ✅ Types de fichiers autorisés
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: Request) {
  try {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      console.error("Variables d'environnement R2 manquantes")
      return NextResponse.json({ error: "Configuration serveur incomplète" }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 })
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non autorisé" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `Le fichier dépasse ${MAX_FILE_SIZE / 1024 / 1024}MB` }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .substring(0, 50)

    const key = `uploads/${Date.now()}-${uuidv4()}-${sanitizedName}.${fileExtension}`

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
        uploadDate: new Date().toISOString(),
      },
    }

    await r2.send(new PutObjectCommand(uploadParams))

    // ✅ Construire l’URL publique
    const url = `${process.env.R2_PUBLIC_DOMAIN}/${key}`;
     
    console.log("URL générée:", url)

    return NextResponse.json({
      success: true,
      url,
      key,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error) {
    console.error("Erreur upload R2:", error)
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
    const isProduction = process.env.NODE_ENV === "production"

    return NextResponse.json(
      {
        success: false,
        error: isProduction ? "Erreur lors de l'upload" : errorMessage,
        ...(isProduction ? {} : { details: errorMessage }),
      },
      { status: 500 }
    )
  }
}

// ✅ Bloquer GET
export async function GET() {
  return NextResponse.json({ error: "Méthode non autorisée" }, { status: 405 })
}
