    // src/middleware.ts
    import { NextResponse } from 'next/server'
    import type { NextRequest } from 'next/server'

    export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Only apply to admin routes
    if (path.startsWith('/admin')) {
        const authHeader = request.headers.get('authorization')

        // Check for basic auth
        if (authHeader) {
        const [username, password] = Buffer.from(
            authHeader.split(' ')[1], 
            'base64'
        ).toString().split(':')

        // Replace with your desired credentials
        const validUsername = process.env.ADMIN_USERNAME || 'admin'
        const validPassword = process.env.ADMIN_PASSWORD || 'webinar2024!'

        if (
            username === validUsername && 
            password === validPassword
        ) {
            return NextResponse.next()
        }
        }

        // If no valid credentials, request authentication
        return new NextResponse(
        'Authentication required', 
        {
            status: 401,
            headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"'
            }
        }
        )
    }
    }