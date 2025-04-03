'use client'
import Footer from '@/components/footer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMainDocsPage = pathname === '/docs';

  return (
    <div className="min-h-screen bg-off-white">
      {!isMainDocsPage && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-off-white border-b border-gray-200">
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-1">
                <Link href="/" className="text-xl font-semibold text-gray-900">
                  Home
                </Link>
                <span>/</span>
                <Link href="/docs" className="text-xl font-semibold text-gray-700">
                  Docs
                </Link>
              </div>
              <nav className="flex items-center space-x-4">
                <Link
                  href="/docs/ui-patterns"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/docs/ui-patterns'
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  UI Patterns
                </Link>
                <Link
                  href="/docs/apis"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/docs/apis'
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  APIs
                </Link>
              </nav>
            </div>
          </div>
        </header>
      )}
      <div className={`relative ${!isMainDocsPage ? 'py-16' : ''}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
}