'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function ImageModal({ 
  src, 
  alt, 
  isOpen, 
  onClose 
}: { 
  src: string; 
  alt: string; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#333] text-white hover:bg-[var(--orange)] hover:border-[var(--orange)] transition-all z-50"
      >
        <X size={24} />
      </button>

      <div 
        className="relative w-full max-w-4xl max-h-[90vh] aspect-square md:aspect-video rounded-lg overflow-hidden flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Évite de fermer si on clique sur l'image elle-même
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}