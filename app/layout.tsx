import React from 'react';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import Provider from '@/redux/provider';

export const metadata = {
  title: 'Kuzzy Admin Dashboard',
  description: 'Admin panel for Kuzzy operations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen overflow-clip w-screen ">
        <Navbar />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}