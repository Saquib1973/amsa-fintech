import AssetDetails from '@/components/assets/asset-details'
import React from 'react'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const formattedName = id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: `${formattedName} | AMSA Fintech and IT solutions`,
    description: `Detailed information about ${formattedName}, including its price, market cap, and trading volume.`,
    keywords: `${formattedName}, crypto, trading, AMSA Fintech and IT solutions`,
  }
}

const AssetsByIdPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string; network?: string }>
}) => {
  const { id } = await params
  const { network } = await searchParams
  return <AssetDetails id={id} network={network} />
}

export default AssetsByIdPage
