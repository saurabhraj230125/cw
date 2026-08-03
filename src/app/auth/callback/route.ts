import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET(request: Request) {
  // 1. Get the URL and the secure code sent by Supabase
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // 2. Initialize the Supabase Server Client
    const supabase = await createClient()
    
    // 3. Exchange the code for a secure, HTTP-only session cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Auth session error:", error.message)
      return NextResponse.redirect(new URL('/login?error=true', requestUrl.origin))
    }
  }

  // 4. Redirect the authenticated user to the Dashboard (or Onboarding)
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}