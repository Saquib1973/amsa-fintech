'use client'
import React, { useState, useMemo } from 'react'
import StillBuildingPage from './still-building-page'
import AnimateWrapper from './wrapper/animate-wrapper'
import SectionWrapper from './wrapper/section-wrapper'
import SecondaryButton from './button/secondary-button'
import Link from 'next/link'
import { Search, ExternalLink, SearchX } from 'lucide-react'
import { dashboardSidebarItems as sidebarItems } from '@/lib/dashboard-data'
import { menuItems } from '@/lib/data'
import { useDebounce } from '@/hooks/use-debounce'

const navOptions = [
  {
    label: 'Home',
    description: 'Back to the main page',
    href: '/',
  },
  {
    label: 'Support',
    description: 'Get help or contact us',
    href: '/support',
  },
  {
    label: 'Assets',
    description: 'Browse our resources and assets',
    href: '/assets',
  },
]

interface SearchResult {
  name: string;
  href: string;
  section: string;
  description?: string;
  icon?: React.ReactNode;
}

const ErrorPage = ({
  error = null,
  building = null,
  simple = false,
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist.",
}: {
  error?: boolean | null
  building?: boolean | null
  simple?: boolean
  title?: string
  message?: string
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [] as SearchResult[];
    const searchLower = debouncedSearchQuery.toLowerCase();
    const filteredResults: SearchResult[] = [];
    sidebarItems.forEach(section => {
      section.items.forEach(item => {
        if (item.name.toLowerCase().includes(searchLower) && item.href) {
          filteredResults.push({
            name: item.name,
            href: item.href,
            section: section.title,
            description: `Navigate to ${item.name.toLowerCase()} page`,
            icon: item.icon
          });
        }
        if (item.submenuItems) {
          item.submenuItems.forEach(subItem => {
            if (subItem.name.toLowerCase().includes(searchLower) && subItem.href) {
              filteredResults.push({
                name: subItem.name,
                href: subItem.href,
                section: `${section.title} > ${item.name}`,
                description: `Access ${subItem.name.toLowerCase()} settings`,
                icon: subItem.icon
              });
            }
          });
        }
      });
    });
    menuItems.forEach(item => {
      if (item.title.toLowerCase().includes(searchLower) && item.href) {
        filteredResults.push({
          name: item.title,
          href: item.href,
          section: 'Main Menu',
          description: `View ${item.title.toLowerCase()} information`
        });
      }
      if (item.children) {
        item.children.forEach(child => {
          if (child.title.toLowerCase().includes(searchLower) && child.href) {
            filteredResults.push({
              name: child.title,
              href: child.href,
              section: `${item.title}`,
              description: `Explore ${child.title.toLowerCase()}`
            });
          }
        });
      }
    });
    return filteredResults.slice(0, 10);
  }, [debouncedSearchQuery]);

  if (error || building === null) {
    if (simple) {
      return (
        <AnimateWrapper>
          <SectionWrapper>
            <div className="page-container">
              <div className="width-1600 py-20 p-10 flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-light text-gray-900">
                  {title}
                </h1>
                <p className="text-gray-600 text-lg">
                  {message}
                </p>
                <SecondaryButton
                  link="/"
                  className=""
                >
                  Return to Home
                </SecondaryButton>
              </div>
            </div>
          </SectionWrapper>
        </AnimateWrapper>
      )
    }
    return (
      <AnimateWrapper>
        <div className="flex items-center justify-start bg-white">
          <div className="w-full max-w-3xl mx-auto p-8 rounded-xl flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2 w-full">
              <span className="inline-flex items-center justify-center bg-gray-100 rounded-full w-20 h-20 mb-2">
                <Search className="w-10 h-10 text-gray-400" />
              </span>
              <h1 className="text-3xl font-bold text-gray-900 text-center">404 - Page Not Found</h1>
              <p className="text-gray-600 text-center">Sorry, the page you are looking for does not exist or has been moved.</p>

            </div>
            <form className="w-full flex max-w-xl" onSubmit={e => e.preventDefault()}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for pages, features, or help..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-l-md outline-none bg-gray-50"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-r-md hover:bg-gray-300 transition flex items-center justify-center"
                  aria-label="Clear search input"
                >
                  <SearchX className="w-5 h-5" />
                </button>
              ) : (
                <span className="px-4 py-2 bg-gray-100 rounded-r-md flex items-center justify-center text-gray-400 cursor-not-allowed">
                  <Search className="w-5 h-5" />
                </span>
              )}
            </form>
            <div className="w-full max-w-xl max-h-[calc(100vh-380px)] p-2 overflow-y-auto flex flex-col gap-3 mt-2">
              {debouncedSearchQuery && searchResults.length > 0 ? (
                searchResults.map((result, idx) => (
                  <Link
                    key={result.href + idx}
                    href={result.href}
                    className="flex flex-col items-start p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-900 flex justify-between w-full items-center gap-2">
                      <div className='flex gap-2'>

                      {result.icon && <span className="text-gray-500">{result.icon}</span>}
                      {result.name}
                      </div>
                      <ExternalLink className="w-4 h-4 ml-1 text-blue-500" />
                    </span>
                    <span className="text-xs text-gray-500">{result.section}</span>
                    {result.description && <span className="text-xs text-gray-400 mt-1">{result.description}</span>}
                  </Link>
                ))
              ) : debouncedSearchQuery && searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <SearchX className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium mb-1">No results found</p>
                  <p className="text-sm text-gray-500">Try different keywords or check your spelling</p>
                </div>
              ) : (
                navOptions.map((opt) => (
                  <Link
                    key={opt.label}
                    href={opt.href}
                    className="flex flex-col items-start p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-900">{opt.label}</span>
                    <span className="text-xs text-gray-500">{opt.description}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </AnimateWrapper>
    )
  } else if (building) {
    return <StillBuildingPage />
  }
}

export default ErrorPage
