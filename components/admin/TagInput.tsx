'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function TagInput({ label, tags, onChange, suggestions, onRefresh, refreshing }: TagInputProps) {
  const [filtre, setFiltre] = useState('');

  const ajouterTag = (tag: string) => {
    const trim = tag.trim();
    if (!trim) return;
    if (!suggestions.includes(trim)) {
      alert(`Le tag "${trim}" n'existe pas. Crée-le d'abord dans /admin/tags.`);
      return;
    }
    onChange([...tags, trim]);
  };

  const retirerTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const suggestionsAffichees = suggestions.filter(s =>
    s.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Colonne gauche — Tags sélectionnés */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 min-h-[200px]">
          {tags.length === 0 ? (
            <p className="text-gray-500 text-sm italic">
              Clique sur une suggestion à droite pour l&apos;ajouter
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 bg-[var(--orange)]/10 border border-[var(--orange)]/30 text-[var(--orange)] px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => retirerTag(i)}
                    className="hover:bg-[var(--orange)]/20 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Colonne droite — Suggestions */}
        <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-4">
          {/* Barre recherche + actualiser */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              placeholder="Rechercher dans les suggestions..."
              className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:border-[var(--orange)] outline-none"
            />
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                title="Actualiser les suggestions"
                className="p-2 rounded-lg bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-[var(--orange)] hover:border-[var(--orange)] transition-colors disabled:opacity-50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={refreshing ? 'animate-spin' : ''}
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </button>
            )}
          </div>

          <p className="text-gray-500 text-xs mb-2">
            {suggestionsAffichees.length} tag{suggestionsAffichees.length > 1 ? 's' : ''} disponible{suggestionsAffichees.length > 1 ? 's' : ''}
          </p>

          <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto">
            {suggestionsAffichees.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                {filtre ? `Aucun tag contenant "${filtre}"` : 'Aucune suggestion'}
              </p>
            ) : (
              suggestionsAffichees.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => ajouterTag(sug)}
                  className="bg-[#1A1A1A] border border-[#333] text-gray-300 hover:border-[var(--orange)] hover:text-[var(--orange)] px-3 py-1 rounded-full text-sm transition-colors"
                >
                  + {sug}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Cliquer plusieurs fois sur un même tag l&apos;ajoute en double (ex. double fromage).
      </p>
    </div>
  );
}
