import AssetDetails from '@/components/assets/asset-details'
import React from 'react'
const AssetsByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  return <AssetDetails id={id} />
}

export default AssetsByIdPage
