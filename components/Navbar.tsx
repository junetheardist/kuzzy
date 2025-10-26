import React from 'react';
import Link from 'next/link';
import { Truck } from 'lucide-react';
import { NotificationBell } from '@/components/ui/NotificationBell'

export const Navbar = () => {
  return (
    <header className="bg-white shadow-sm z-30 sticky top-0">
      <div className="w-[90vw] mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">Kuzzy</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium">
              Dashboard
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 font-medium">
              Analytics
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 font-medium">
              Settings
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};