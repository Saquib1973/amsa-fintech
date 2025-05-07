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
  keywords: 'fintech, financial technology, crypto, blockchain, digital finance, financial solutions',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'AMSA Fintech and IT Solutions',
    description: 'Cutting-edge financial technology solutions for businesses and individuals',
    type: 'website',
    locale: 'en_AU',
    siteName: 'AMSA Fintech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMSA Fintech and IT Solutions',
    description: 'Cutting-edge financial technology solutions for businesses and individuals',
  },
  alternates: {
    canonical: 'https://amsafintech.com',
  },
}

export default async function RootLayout({
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
