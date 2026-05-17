'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}

export default function TagInput({ label, tags, onChange, suggestions, placeholder }: TagInputProps) {
  const [input, setInput] = useState('');
  const [filtre, setFiltre] = useState('');

  const ajouterTag = (tag: string) => {
    const trim = tag.trim();
    if (!trim) return;
    onChange([...tags, trim]);
  };

  const retirerTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      ajouterTag(input);
      setInput('');
    }
  };

  const suggestionsAffichees = suggestions.filter(s =>
    s.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Colonne gauche — Tags ajoutés */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 min-h-[200px] flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3 flex-grow">
            {tags.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                Aucun tag — clique sur les suggestions à droite ou tape dans le champ
              </p>
            ) : (
              tags.map((tag, i) => (
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
              ))
            )}
          </div>

          {/* Champ pour ajouter un tag custom */}
          <div className="flex gap-2 mt-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || 'Tape et appuie sur Entrée'}
              className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:border-[var(--orange)] outline-none"
            />
            <button
              type="button"
              onClick={() => { ajouterTag(input); setInput(''); }}
              className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white p-2 rounded-lg"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Colonne droite — Suggestions */}
        <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-4">
          <input
            type="text"
            value={filtre}
            onChange={(e) => setFiltre(e.target.value)}
            placeholder="Rechercher dans les suggestions..."
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm mb-3 focus:border-[var(--orange)] outline-none"
          />

          <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto">
            {suggestionsAffichees.length === 0 ? (
              <p className="text-gray-500 text-sm italic">Aucune suggestion</p>
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
        Tu peux cliquer plusieurs fois sur le même tag pour le dupliquer.
      </p>
    </div>
  );
}
