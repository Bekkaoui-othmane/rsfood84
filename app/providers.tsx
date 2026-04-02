'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// Composant Fournisseur pour envelopper l'application avec la session NextAuth
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}