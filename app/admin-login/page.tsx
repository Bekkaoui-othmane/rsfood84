'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes('Trop de tentatives')) {
          setError(result.error);
        } else {
          setError('Email ou mot de passe incorrect');
        }
        setLoading(false);
      } else if (result?.ok) {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Une erreur est survenue. Réessayez.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12 relative overflow-hidden">
      {/* Lueur orange décorative en fond */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Lien retour accueil */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[var(--orange)] transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Retour au site</span>
      </Link>

      <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl p-8 md:p-10 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative z-10">

        {/* Logo + Titre */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--orange)] shadow-[0_0_20px_rgba(232,93,4,0.4)] mb-4">
            <Image
              src="/images/logo_image_pro/logo.jpg"
              alt="Logo Rs Food84"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
            Espace <span className="text-[var(--orange)]">Admin</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Rs Food84 — Connexion sécurisée</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="admin@rsfood84.fr"
                autoComplete="email"
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-600 focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--orange)] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#1F1F1F]">
          <p className="text-xs text-gray-500 text-center">
            Accès réservé au personnel autorisé.<br />
            Toutes les tentatives sont enregistrées.
          </p>
        </div>
      </div>
    </div>
  );
}
