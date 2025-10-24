'use client';

import React, { useState, useContext, createContext, ReactNode, useRef, useEffect } from 'react';

interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export const Popover = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block" ref={popoverRef}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({ children }: { children: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }> }) => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within a Popover');

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      context.setIsOpen(!context.isOpen);
      children.props.onClick?.(e);
    },
  });
};

export const PopoverContent = ({ children }: { children: ReactNode }) => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverContent must be used within a Popover');

  if (!context.isOpen) return null;

  return (
    <div className="absolute z-20 w-72 mt-2 -translate-x-1/2 left-1/2">
        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white p-4">
            {children}
        </div>
    </div>
  );
};