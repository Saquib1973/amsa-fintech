"use client"
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/use-debounce'

interface SearchButtonProps {
  onSearch: (q: string) => void
}

const SearchButton = ({ onSearch }: SearchButtonProps) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 400)

  useEffect(() => {
    onSearch(debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <div className="flex items-center gap-2 mb-6">
      <input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        type="text"
        placeholder="Search users by name or email..."
        className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-md outline-none"
      />
    </div>
  )
}

export default SearchButton