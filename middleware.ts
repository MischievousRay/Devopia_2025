import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "@auth0/nextjs-auth0/edge"

// List of paths that require authentication
const protectedPaths = [
  "/profile",
  // Uncomment these when you want to fully protect these routes
  // '/dashboard',
  // '/transactions',
  // '/goals',
  // '/stocks',
  // '/chat',
]

// List of paths that should redirect to dashboard if already authenticated
const authPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const path = request.nextUrl.pathname

  try {
    const session = await getSession(request, response)
    const isAuthenticated = !!session?.user

    // If the user is trying to access a protected path and is not authenticated
    if (protectedPaths.some((p) => path.startsWith(p)) && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("returnTo", path)
      return NextResponse.redirect(loginUrl)
    }

    // If the user is authenticated and trying to access auth paths
    if (authPaths.some((p) => path.startsWith(p)) && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
