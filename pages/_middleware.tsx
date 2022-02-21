import { NextRequest, NextResponse } from "next/server"

const validateToken = async (cookie: string, req: NextRequest) => {
    
    if (!req.cookies['access-token']) {
        return await refreshToken(cookie, req)
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/validate-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
            Cookie: cookie || ''
        },
        credentials: 'include'
    })

    const data = await response.json()
    if (!data.status) {
        const result = await refreshToken(cookie, req)
        return result
    }

    return true
}

const refreshToken = async (cookie: string, req: NextRequest) => {
    if (!req.cookies['refresh-token']) {
        return false
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
            Cookie: cookie || ''
        },
        credentials: 'include'
    })

    const data = await response.json()

    return data.status
    
}

export const login = (req: NextRequest) => {
    if ((!req.cookies['access-token']) && (!req.cookies['refresh-token'])) {
        return NextResponse.next()
    }

    return NextResponse.redirect('http://localhost:3000')
}

export const middleware = async (req: NextRequest) => {

    if (req.nextUrl.pathname == '/login') {
        return login(req)
    }
    
    const cookie = Object.keys(req.cookies).map((key) => [key, req.cookies[key]].map(encodeURIComponent).join('=')).join('; ')
    const result = await validateToken(cookie, req)

    if (!result) {
        return NextResponse.redirect('http://localhost:3000/login')
    }

    return NextResponse.next()
}