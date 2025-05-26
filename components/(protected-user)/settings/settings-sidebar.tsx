"use client"

import { History, Lock } from 'lucide-react'
import SubSidebar from '../sub-sidebar'

const SettingsSidebar = () => {
  const tabOptions = [

    {
      label: "Change Password",
      href: "/settings/security/password",
      icon: Lock,
    },
    {
      label: "Login History",
      href: "/settings/security/history",
      icon: History,
    },
  ]

  return <SubSidebar tabOptions={tabOptions} />
}

export default SettingsSidebar;