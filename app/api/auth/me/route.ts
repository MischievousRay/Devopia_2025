import { getSession } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return NextResponse.json(session.user)
  } catch (error) {
    console.error("Error getting session:", error)
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
