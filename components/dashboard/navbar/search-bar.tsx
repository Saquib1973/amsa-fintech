"use client"
import { useState, useEffect, useRef, KeyboardEvent, useCallback, useMemo } from 'react';
import { dashboardSidebarItems as sidebarItems } from '@/lib/dashboard-data';
import { UserRole } from '@/types/user';
import { menuItems } from '@/lib/data';
import Link from 'next/link';
import { Search, Command, ExternalLink, SearchX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence,motion } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';
import {  useSession } from 'next-auth/react';
import { roleRefactor } from '@/lib/utils';

interface SearchResult {
  name: string;
  href: string;
  section: string;
  description?: string;
  icon?: React.ReactNode;
}

const DEBOUNCE_DELAY = 300;
const MAX_RESULTS = 10;

//Skeleton
const SearchSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SearchBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [showShortcut, setShowShortcut] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('USER');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession()
  useEffect(()=>{
    if (status === 'authenticated') {
      setUserRole(roleRefactor(session?.user?.name as UserRole))
    }
  },[status,session])

  const [debouncedSearchQuery] = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];

    const searchLower = debouncedSearchQuery.toLowerCase();
    const filteredResults: SearchResult[] = [];

    // Filter sidebar items based on user role
    sidebarItems.forEach(section => {
      // Check if section is accessible to user role
      if (section.roles && !section.roles.includes(userRole)) {
        return;
      }

      section.items.forEach(item => {
        // Check if item is accessible to user role
        if (item.roles && !item.roles.includes(userRole)) {
          return;
        }

        if (item.name.toLowerCase().includes(searchLower) && item.href) {
          filteredResults.push({
            name: item.name,
            href: item.href,
            section: section.title,
            description: `Navigate to ${item.name.toLowerCase()} page`,
            icon: item.icon
          });
        }

        // Check submenu items
        if (item.submenuItems) {
          item.submenuItems.forEach(subItem => {
            // Note: submenu items inherit parent's role restrictions
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

    // Filter menu items
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

    return filteredResults.slice(0, MAX_RESULTS);
  }, [debouncedSearchQuery, userRole]);

  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setResults(searchResults);
    setIsLoading(false);
  }, [debouncedSearchQuery, searchResults]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selectedResult = results[selectedIndex];
      if (selectedResult) {
        router.push(selectedResult.href);
        setShowResults(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  }, [results, selectedIndex, router, setSelectedIndex, setShowResults, setSearchQuery]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = useCallback((href: string) => {
    router.push(href);
    setShowResults(false);
    setSearchQuery('');
  }, [router, setShowResults, setSearchQuery]);

  const renderResults = () => {
    if (isLoading) {
      return <SearchSkeleton />;
    }
    if (showResults && !debouncedSearchQuery.trim()) {
      return (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <Search className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Write something you want to search</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Start typing to see suggestions
          </p>
        </motion.div>
      );
    }
    if (results.length > 0) {
      return results.map((result, index) => (
        <motion.div
          key={`${result.href}-${index}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, delay: (index+1)%20 * 0.06 }}
        >
          <Link
          href={result.href}
          className={`block px-4 py-3 group transition-all border-b duration-200 ${
            index === selectedIndex
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onClick={() => handleResultClick(result.href)}
        >
          <div className="flex items-center justify-between group/item">
            <div className="flex items-center gap-3">
              {result.icon && (
                <div className="text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 transition-all">
                  {result.icon}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover/item:text-blue-500 transition-all">
                  {result.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {result.section}
                </span>
                {result.description && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {result.description}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
              <ExternalLink className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          </Link>
        </motion.div>
      ));
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center justify-center py-8 px-4 text-center"
      >
        <SearchX className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">No results found</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try different keywords or check your spelling
        </p>
      </motion.div>
    );
  };

  return (
    <div
      className="w-full flex justify-center items-center relative"
      ref={searchRef}
    >
      {showResults && (
        <button
          type="button"
          className="fixed inset-0  z-40 w-full h-full"
          onClick={() => setShowResults(false)}
          aria-label="Close search"
        />
      )}
      <div className="w-full relative flex items-center justify-center z-50">
        <input
          ref={inputRef}
          type="text"
          className="w-full p-2 pl-10 bg-white border-2 border-gray-100 outline-none dark:border-gray-700
                  rounded-md transition-all duration-200 dark:bg-gray-800 dark:text-white"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowResults(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => {
            setShowResults(true)
            setShowShortcut(false)
          }}
          onBlur={() => setShowShortcut(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search navigation"
          role="searchbox"
        />
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {showShortcut && !searchQuery && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 animate-spin" />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -5,
              transition: { duration: ((results.length + 1) % 20) * 0.04 },
            }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 rounded-md bg-white dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-69px)] overflow-y-auto z-50
                      backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
          >
            {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
};

export default SearchBar;