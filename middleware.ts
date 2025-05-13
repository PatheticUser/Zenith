import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Log the requested URL
  console.log(`Middleware: Requested URL: ${request.nextUrl.pathname}`)

  // Continue to the requested page
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
