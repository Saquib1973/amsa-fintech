"use client"

import React from 'react'
import { Wallet, RefreshCw } from 'lucide-react'
import SubSidebar from '../sub-sidebar'

const TransakSidebar = () => {
  const tabOptions = [
    {
      label: "Transak",
      href: "/transak",
      icon: Wallet,
    },
    {
      label: "Refresh Token",
      href: "/transak/refresh-token",
      icon: RefreshCw,
    },
  ]

  return <SubSidebar tabOptions={tabOptions} />
}

export default TransakSidebar;
