import ClientWrapper from '@/context/client-wrapper'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../styles/globals.css'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AMSA Fintech and IT Solutions',
  description:
    'AmsaFintech offers cutting-edge financial technology solutions, empowering businesses and individuals with secure, efficient, and innovative tools for financial management and growth.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden bg-white dark:bg-black">
      <body
        className={`${geistSans.variable} flex flex-col ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}
