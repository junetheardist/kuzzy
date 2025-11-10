'use client';

import React, { useState, useContext, createContext, ReactNode, useRef, useEffect } from 'react';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const Dropdown = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger = ({ children }: { children: React.ReactElement }) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownTrigger must be used within a Dropdown');

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      context.setIsOpen(!context.isOpen);
      (children.props as any).onClick?.(e);
    },
  } as any);
};

export const DropdownContent = ({ children }: { children: ReactNode }) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownContent must be used within a Dropdown');

  if (!context.isOpen) return null;

  return (
    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
      <div className="py-1" role="menu" aria-orientation="vertical">
        {children}
      </div>
    </div>
  );
};

export const DropdownItem = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => {
  const context = useContext(DropdownContext);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick?.();
    context?.setIsOpen(false);
  };
  return (
    <div className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={handleClick}>
      {children}
    </div>
  );
};