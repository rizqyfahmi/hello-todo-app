import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
    if (!req.cookies['access-token'] && !req.cookies['refresh-token']) {
        return NextResponse.rewrite('/login')
    } 

    if (req.nextUrl.pathname == '/login') {
        return NextResponse.redirect('http://localhost:3000/')
    }

    // Auth will be on withAuth in advance
    return NextResponse.next()
}