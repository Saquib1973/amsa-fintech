import AssetDetails from '@/components/assets/asset-details'
import React from 'react'
const AssetsByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  console.log(id)
  return <AssetDetails id={id} />
}

export default AssetsByIdPage
