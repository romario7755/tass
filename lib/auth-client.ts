import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, getSession as nextAuthGetSession } from "next-auth/react"
import { useSession as nextAuthUseSession } from "next-auth/react"

export const signIn = {
  email: async (credentials: { email: string; password: string }, options?: {
    onSuccess?: (context: unknown) => void;
    onError?: (ctx: { error: unknown }) => void
  }) => {
    try {
      // Vérifier d'abord si l'utilisateur existe et est activé
      const checkResponse = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email })
      })

      if (checkResponse.ok) {
        const userData = await checkResponse.json()
        if (userData.exists && !userData.isActive) {
          if (options?.onError) {
            options.onError({ error: { message: "Veuillez activer votre compte en cliquant sur le lien envoyé par email", code: "EMAIL_NOT_VERIFIED" } })
          }
          return { error: "EMAIL_NOT_VERIFIED" }
        }
      }

      const result = await nextAuthSignIn("credentials", {
        ...credentials,
        redirect: false,
      })

      if (result?.error) {
        if (options?.onError) {
          options.onError({ error: { message: result.error, code: "INVALID_CREDENTIALS" } })
        }
      } else {
        if (options?.onSuccess) {
          options.onSuccess({ user: result })
        }
      }

      return result
    } catch (error: unknown) {
      if (options?.onError) {
        options.onError({ error })
      }
      throw error
    }
  },
  social: async (options: { provider: string; callbackURL?: string }) => {
    return nextAuthSignIn(options.provider, { callbackUrl: options.callbackURL })
  }
}

export const signUp = {
  email: async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        return { error }
      }

      return { success: true }
    } catch {
      return { error: { message: "Erreur lors de l'inscription" } }
    }
  }
}

export const signOut = nextAuthSignOut
export const useSession = nextAuthUseSession
export const getSession = nextAuthGetSession

export const authClient = {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  forgetPassword: async (options: { email: string; redirectTo: string }) => {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Erreur lors de l'envoi de l'email")
    }

    return response.json()
  }
}