'use client';

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, children,  }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed  w-screen h-screen  inset-0 bg-black/20 z-50 flex justify-center items-center p-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
    >
      
        
        <div className="p-6 outline outline-white  overflow-y-auto">{children}</div>
    </div>
  );
};