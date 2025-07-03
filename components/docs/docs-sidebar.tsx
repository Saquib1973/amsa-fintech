import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { uiComponents } from '@/app/(pages)/docs/ui-patterns/data';
import { apiEndpoints } from '@/app/(pages)/docs/apis/data';

const mainSections = [
  {
    title: 'UI Patterns',
    href: '/docs/ui-patterns',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )
  },
  {
    title: 'APIs',
    href: '/docs/apis',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )
  }
];

export default function DocsSidebar() {
  const pathname = usePathname();
  const isUI = pathname.startsWith('/docs/ui-patterns');
  const isAPI = pathname.startsWith('/docs/apis');

  return (
    <aside className="hidden lg:block w-64  border-r border-gray-200 h-screen sticky top-0 p-4 overflow-y-auto">
      <nav className="space-y-2">
        {mainSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`flex items-center gap-2 px-3 py-2 font-medium transition-colors ${pathname.startsWith(section.href) ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
          >
            {section.icon}
            {section.title}
          </Link>
        ))}
      </nav>
      {/* Sub-navigation */}
      {isUI && (
        <div className="mt-8">
          <div className="text-xs font-semibold text-gray-400 mb-2 px-3">
            UI Patterns
          </div>
          <nav className="space-y-1">
            {uiComponents.map((comp) => (
              <Link
                key={comp.id}
                href={`#${comp.id}`}
                className={`block px-5 py-1 rounded-md text-sm transition-colors ${typeof window !== 'undefined' && window.location.hash === `#${comp.id}` ? 'text-blue-600 underline' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {comp.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
      {isAPI && (
        <div className="mt-8">
          <div className="text-xs font-semibold text-gray-400 mb-2 px-3">
            API Endpoints
          </div>
          <nav className="space-y-1">
            {apiEndpoints.map((api) => (
              <Link
                key={api.id}
                href={`#${api.id}`}
                className={`block px-5 py-1 rounded-md text-sm transition-colors ${typeof window !== 'undefined' && window.location.hash === `#${api.id}` ? 'text-blue-600 underline' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {api.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </aside>
  )
}