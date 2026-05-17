'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-2 rounded-xl hover:bg-red-500/20 transition-colors"
    >
      Déconnexion
    </button>
  );
}
