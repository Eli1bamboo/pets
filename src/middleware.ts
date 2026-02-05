import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set({ name, value, ...options })
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected Routes logic
    const isLoginPage = request.nextUrl.pathname === '/login'
    const isAdminLoginPage = request.nextUrl.pathname === '/admin/login'
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isProtectedCustomerRoute = ['/profile', '/booking', '/history', '/tracking'].includes(request.nextUrl.pathname)

    // 1. Redirect to appropriate login if user is not authenticated
    if (!user) {
        // If accessing admin area (but not the login page itself), redirect to admin login
        if (isAdminRoute && !isAdminLoginPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/login'
            return NextResponse.redirect(url)
        }

        // If accessing protected customer routes, redirect to customer login
        if (isProtectedCustomerRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('redirectTo', request.nextUrl.pathname)
            return NextResponse.redirect(url)
        }
    }

    // 2. Admin Route Protection (RBAC)
    if (isAdminRoute && user) {
        // Fetch role from profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            // Redirect unauthorized users to home
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
    }

    // 3. Prevent logged in users from visiting login page
    if (user && isLoginPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
