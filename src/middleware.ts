import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { DEVICE_ID_COOKIE, DEVICE_ID_HEADER } from '@/lib/device-id'

export function middleware(request: NextRequest) {
  let deviceId = request.cookies.get(DEVICE_ID_COOKIE)?.value
  const requestHeaders = new Headers(request.headers)

  if (!deviceId) {
    deviceId = crypto.randomUUID()
  }

  requestHeaders.set(DEVICE_ID_HEADER, deviceId)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  if (!request.cookies.get(DEVICE_ID_COOKIE)) {
    response.cookies.set(DEVICE_ID_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
