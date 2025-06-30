'use client'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { dashboardSidebarItems as sidebarItems } from '@/lib/dashboard-data';
import { UserRole } from '@/types/user';
import { menuItems } from '@/lib/data';
import { Search, ExternalLink, SearchX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { useSession } from 'next-auth/react';
import { roleRefactor } from '@/lib/utils';
import { Close } from '@/public/svg';
import { AnimatePresence, motion } from 'framer-motion';

interface SearchResult {
  name: string;
  href: string;
  section: string;
  description?: string;
  icon?: React.ReactNode;
}

const DEBOUNCE_DELAY = 300;
const MAX_RESULTS = 10;

const SearchModalButton = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('USER');
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      setUserRole(roleRefactor(session?.user?.name as UserRole));
    }
  }, [status, session]);

  const [debouncedSearchQuery] = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];
    const searchLower = debouncedSearchQuery.toLowerCase();
    const filteredResults: SearchResult[] = [];
    sidebarItems.forEach(section => {
      if (section.roles && !section.roles.includes(userRole)) return;
      section.items.forEach(item => {
        if (item.roles && !item.roles.includes(userRole)) return;
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
        setIsOpen(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [results, selectedIndex, router]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const handleResultClick = useCallback((href: string) => {
    router.push(href);
    setIsOpen(false);
    setSearchQuery('');
  }, [router]);

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const renderResults = () => {
    if (isLoading) {
      return (
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
    }
    if (!debouncedSearchQuery.trim()) {
      return (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center py-8 px-4 text-center"
        >
          <Search className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Write something you want to search</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Start typing to see suggestions</p>
        </motion.div>
      );
    }
    if (results.length > 0) {
      return (
        <AnimatePresence mode="popLayout">
          {results.map((result, index) => (
            <motion.div
              key={`${result.href}-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: (index + 1) % 20 * 0.06 }}
              className={`block px-4 py-3 group border-b cursor-pointer ${
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
            </motion.div>
          ))}
        </AnimatePresence>
      );
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
        <p className="text-sm text-gray-500 dark:text-gray-400">Try different keywords or check your spelling</p>
      </motion.div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1 md:p-3 rounded-full md:bg-surface-main cursor-pointer hover:bg-surface-alt text-black"
        aria-label="Open search"
      >
        <Search className="size-5" />
      </button>
      <AnimatePresence mode='wait'>
      {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center">
          <div className="fixed inset-0 bg-black/80 z-40" />
          <div ref={modalRef} className="relative z-50 w-full md:max-w-4xl max-md:h-full mx-auto bg-white dark:bg-gray-900 flex flex-col">
            <div className="flex items-center mb-4 px-6 pt-4">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 p-2 pr-6 bg-transparent outline-none text-lg dark:text-white"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                aria-label="Search navigation"
                role="searchbox"
              />
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-80px)] rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              {renderResults()}
            </div>
            <button
              className="absolute top-5 right-5 cursor-pointer text-gray-400"
              onClick={() => setIsOpen(false)}
              aria-label="Close search modal"
            >
              <Close className="size-5" />
            </button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchModalButton;