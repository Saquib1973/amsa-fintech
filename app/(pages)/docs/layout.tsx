'use client'
import DocsHeader from '@/components/docs/docs-header'
import DocsSidebar from '@/components/docs/docs-sidebar'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col">
      <DocsHeader />
      <div className="flex w-full max-w-7xl mx-auto">
        <DocsSidebar />
        <main className="flex flex-col w-full px-4 py-8">{children}</main>
      </div>
    </div>
  )
}
