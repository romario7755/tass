import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth API routes
        if (req.nextUrl.pathname.startsWith('/api/auth')) {
          return true
        }

        // For protected routes, require a valid token
        if (req.nextUrl.pathname.startsWith('/dashboard') ||
            req.nextUrl.pathname.startsWith('/api/cars') && !req.nextUrl.pathname.includes('public') ||
            req.nextUrl.pathname.startsWith('/api/upload') ||
            req.nextUrl.pathname.startsWith('/api/checkout')) {
          return !!token
        }

        return true
      },
    },
    pages: {
      signIn: '/login',
      error: '/login',
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/cars/((?!public).)*',
    '/api/upload/:path*',
    '/api/checkout/:path*',
  ]
}