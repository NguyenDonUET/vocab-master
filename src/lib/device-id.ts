import { cookies, headers } from 'next/headers'

export const DEVICE_ID_COOKIE = 'learn-vocab-device-id'
export const DEVICE_ID_HEADER = 'x-device-id'

export async function getDeviceId(): Promise<string> {
  const headerStore = await headers()
  const fromHeader = headerStore.get(DEVICE_ID_HEADER)

  if (fromHeader) {
    return fromHeader
  }

  const cookieStore = await cookies()
  const fromCookie = cookieStore.get(DEVICE_ID_COOKIE)?.value

  if (fromCookie) {
    return fromCookie
  }

  throw new Error('Device ID not found.')
}
