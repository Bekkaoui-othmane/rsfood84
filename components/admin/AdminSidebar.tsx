'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  Tags,
  Image as ImageIcon,
  Settings,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Produits', href: '/admin/produits', icon: Package },
  { name: 'Tags', href: '/admin/tags', icon: Tags },
  { name: 'Carrousel', href: '/admin/carrousel', icon: ImageIcon },
  { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

interface AdminSidebarProps {
  email: string;
}

export default function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-[#0A0A0A] border-r border-[#1F1F1F] flex flex-col z-40">

      {/* Section profil */}
      <div className="p-6 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--orange)]/20 border border-[var(--orange)]/30 flex items-center justify-center text-[var(--orange)] font-bold shrink-0">
            {email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{email}</p>
            <p className="text-gray-500 text-xs">Administrateur</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/30'
                  : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white border border-transparent'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bouton déconnexion */}
      <div className="p-4 border-t border-[#1F1F1F]">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
