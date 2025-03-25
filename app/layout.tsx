import ClientWrapper from '@/context'
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}
