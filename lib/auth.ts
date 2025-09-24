import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
// import { sendWelcomeEmail, sendLoginNotification } from "./email"

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : []
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Credentials manquants")
            return null
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log("Utilisateur non trouvé pour l'email:", credentials.email)
            return null
          }

          if (!user.password) {
            console.log("Pas de mot de passe pour l'utilisateur:", credentials.email)
            return null
          }

          if (!user.isActive) {
            console.log("Compte non activé pour l'utilisateur:", credentials.email)
            throw new Error("EMAIL_NOT_VERIFIED")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("Mot de passe invalide pour l'utilisateur:", credentials.email)
            return null
          }

          console.log("Authentification réussie pour:", credentials.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified,
          }
        } catch (error) {
          console.error("Erreur lors de l'authentification:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    async jwt({ token, user, account, isNewUser }) {
      if (user) {
        token.id = user.id
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.emailVerified = token.emailVerified as Date | null
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}

export const auth = NextAuth(authOptions)