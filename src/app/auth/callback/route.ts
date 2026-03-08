import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
// if "next" is in param, use it, otherwise default to home
  const next = searchParams.get('next') ?? '/'
  
  console.log('📥 Callback invoked:', { 
    hasCode: !!code, 
    next, 
    origin,
    fullUrl: request.url 
  })

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Force httpOnly to false so client can read the session
            cookieStore.set({ name, value, ...options, httpOnly: false })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
    // Exchange code for session
    console.log('🔄 Exchanging code for session...')
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('✅ Session created successfully:', {
        userId: user?.id,
        email: user?.email,
        nextRedirect: next
      })
      
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      let redirectUrl = `${origin}${next}`
      if (!isLocalEnv && forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      }

      const response = NextResponse.redirect(redirectUrl)
      
      // Manually copy cookies from cookieStore to response to ensure they are set
      // The createServerClient's cookie.set method modifies the request cookie store, 
      // but we need to ensure the response also sets them if we are redirecting immediately.
      // However, usually middleware or the fact that we awaited supabase.auth.exchangeCodeForSession
      // and used the cookieStore passed to createServerClient should handle this?
      // Actually, looking at Supabase docs for SSR:
      // "The cookies object is used to read and write cookies."
      // In Next.js App Router route handlers, we use standard cookies().
      // The issue might be that we are not redirecting TO THE SAME DOMAIN properly?
      // No, origin is localhost:3000.
      
      return response
    } else {
        console.error('❌ Auth error exchangeCodeForSession:', error)
        return NextResponse.redirect(`${origin}/login?error=auth_exchange_failed`)
    }
  } else {
      console.error('No code found in searchParams')
      return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  // Fallback return (should be unreachable given logic above but good for types)
  return NextResponse.redirect(`${origin}/login?error=unknown_callback_error`)
}
