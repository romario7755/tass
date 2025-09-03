import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

// ✅ Configuration correcte du client R2
const r2 = new S3Client({
  region: "auto",
  
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, // HTTPS au lieu de HTTP
  credentials: {
     
    accessKeyId: process.env.R2_ACCESS_KEY_ID!, // R2_ au lieu de AWS_
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

// ✅ Validation du type de fichier
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg", 
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf"
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: Request) {
  try {
    // ✅ Vérifier les variables d'environnement
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      console.error("Variables d'environnement R2 manquantes")
      return NextResponse.json(
        { error: "Configuration serveur incomplète" },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    // ✅ Validation du fichier
    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier reçu" },
        { status: 400 }
      )
    }

    // ✅ Vérifier le type de fichier
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé" },
        { status: 400 }
      )
    }

    // ✅ Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Le fichier dépasse la taille maximale de ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // ✅ Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // ✅ Générer un nom de fichier unique et sécurisé
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, '') // Enlever l'extension
      .replace(/[^a-zA-Z0-9-_]/g, '_') // Remplacer caractères spéciaux
      .substring(0, 50) // Limiter la longueur
    
    const key = `uploads/${Date.now()}-${uuidv4()}-${sanitizedName}.${fileExtension}`

    // ✅ Upload vers Cloudflare R2
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // Optionnel : ajouter des métadonnées
      Metadata: {
        originalName: file.name,
        uploadDate: new Date().toISOString()
      }
    }

    await r2.send(new PutObjectCommand(uploadParams))

    // ✅ Construire l'URL publique
    // Option 1 : Si vous avez un domaine personnalisé
    const url = `${process.env.R2_PUBLIC_URL}/${key}`
    
      ? `${process.env.R2_PUBLIC_DOMAIN}/${key}`
      : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`

    // Option 2 : Si vous utilisez le domaine R2.dev public
    // const url = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`
       console.log("URL générée:", url) // Debug
       
    return NextResponse.json({
      success: true,
      url,
      key,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
      
    })

  } catch (error) {
    console.error("Erreur upload R2:", error)
    
    // ✅ Gestion d'erreur détaillée
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
    
    // Ne pas exposer les détails techniques en production
    const isProduction = process.env.NODE_ENV === 'production'
    
    return NextResponse.json(
      {
        success: false,
        error: isProduction ? "Erreur lors de l'upload" : errorMessage,
        ...(isProduction ? {} : { details: errorMessage })
      },
      { status: 500 }
    )
  }
}

// ✅ Optionnel : GET pour récupérer les fichiers
export async function GET(req: Request) {
  return NextResponse.json({
    error: "Méthode non autorisée"
  }, { status: 405 })
}