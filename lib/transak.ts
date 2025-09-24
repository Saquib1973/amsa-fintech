import { prisma } from '@/lib/prisma'

export const TRANSAK_BASE_URL =
  process.env.NEXT_PUBLIC_TRANSAK_ENV === 'PROD'
    ? 'https://api.transak.com/partners/api/v2'
    : 'https://staging-api.transak.com/partners/api/v2'

export const TRANSAK_CRYPTOCOVERAGE_BASE_URL =
  process.env.NEXT_PUBLIC_TRANSAK_ENV === 'PROD'
    ? 'https://api.transak.com/cryptocoverage/api/v1/public'
    : 'https://api-stg.transak.com/cryptocoverage/api/v1/public'

export async function getTransakAccessToken(): Promise<string> {
  const accessTokenRow = await prisma.config.findFirst({
    where: { key: 'TRANSAK_ACCESS_TOKEN' },
  })
  const parsed = accessTokenRow?.value ? JSON.parse(accessTokenRow.value) : {}
  return parsed.accessToken || ''
}


