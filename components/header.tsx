import React from 'react'

interface HeaderProps {
  title: string;
  showBackground?: boolean;
}

const Header = ({ title, showBackground = true }: HeaderProps) => {
  return (
    <div className="text-5xl w-fit font-light p-4 relative">
      <h1 className='z-20 relative text-black'>{title}</h1>
      {showBackground && (
        <div className="absolute right-1 bottom-0 z-10 min-h-fit h-[90%] border border-gray-200 rounded-md w-[60%] min-w-fit bg-gray-100/80" />
      )}
    </div>
  )
}

export default Header