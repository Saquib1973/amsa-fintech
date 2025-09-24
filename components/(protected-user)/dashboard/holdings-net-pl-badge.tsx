'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'

interface HoldingsNetPLBadgeProps {
  netPLAUD: number
  netPLPercent?: number
}

const HoldingsNetPLBadge: React.FC<HoldingsNetPLBadgeProps> = ({
  netPLAUD,
  netPLPercent,
}) => {
  const isPositive = netPLAUD >= 0

  const formattedAud = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 2,
  }).format(Math.abs(netPLAUD))

  return (
    <div className={`flex items-center gap-2 text-sm px-2 py-1 text-white`}>
      <span
        className={`inline-block animate-pulse w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
      />
      <span className="tabular-nums">
        {isPositive ? '+' : '-'}{formattedAud} ({(netPLPercent ?? 0).toFixed(2)}%)
      </span>
      <span className="font-medium">
        {isPositive ? (
          <TrendingUp className="size-4" />
        ) : (
          <TrendingDown className="size-4" />
        )}
      </span>
    </div>
  )
}

export default HoldingsNetPLBadge
