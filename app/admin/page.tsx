import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
              Espace Admin
            </h1>
            <p className="text-gray-400 mt-2">Connecté : {session.user?.email}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)]">
              Produits
            </h2>
            <p className="text-gray-400 text-sm">CRUD à venir</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)]">
              Options
            </h2>
            <p className="text-gray-400 text-sm">Boissons, sauces... à venir</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)]">
              Carrousel
            </h2>
            <p className="text-gray-400 text-sm">Formules à venir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
