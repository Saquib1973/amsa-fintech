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
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  return <AssetDetails id={id} />
}

export default AssetsByIdPage
