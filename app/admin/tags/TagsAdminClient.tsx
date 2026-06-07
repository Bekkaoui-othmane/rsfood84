'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Edit3, Trash2, Check, X, Power, PowerOff, Package, Plus } from 'lucide-react';

type TagAvecCount = {
  id: number;
  nom: string;
  actif: boolean;
  _count: { produits: number };
};

interface Props {
  tags: TagAvecCount[];
}

export default function TagsAdminClient({ tags: tagsInitiaux }: Props) {
  const router = useRouter();
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState<'tous' | 'actifs' | 'inactifs'>('tous');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [creatingLoading, setCreatingLoading] = useState(false);

  const tagsFiltres = tagsInitiaux.filter(t => {
    if (filtre === 'actifs' && !t.actif) return false;
    if (filtre === 'inactifs' && t.actif) return false;
    if (recherche && !t.nom.toLowerCase().includes(recherche.toLowerCase())) return false;
    return true;
  });

  const ouvrirEdition = (tag: TagAvecCount) => {
    setEditingId(tag.id);
    setEditValue(tag.nom);
    setError('');
  };

  const annulerEdition = () => {
    setEditingId(null);
    setEditValue('');
    setError('');
  };

  const sauvegarderRename = async (id: number) => {
    if (!editValue.trim()) return;

    setLoading(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/tags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: editValue.trim() }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setError(data.error ?? 'Erreur lors du renommage');
      } else {
        setEditingId(null);
        router.refresh();
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(null);
    }
  };

  const toggleActif = async (tag: TagAvecCount) => {
    setLoading(tag.id);
    try {
      await fetch(`/api/admin/tags/${tag.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actif: !tag.actif }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const creerTag = async () => {
    if (!newTagName.trim()) return;

    setCreatingLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: newTagName.trim() }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setError(data.error ?? 'Erreur lors de la création');
      } else {
        setCreating(false);
        setNewTagName('');
        router.refresh();
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setCreatingLoading(false);
    }
  };

  const annulerCreation = () => {
    setCreating(false);
    setNewTagName('');
    setError('');
  };

  const supprimer = async (tag: TagAvecCount) => {
    if (!confirm(`Supprimer le tag "${tag.nom}" ?\n\nIl sera retiré de ${tag._count.produits} produit(s).`)) return;

    setLoading(tag.id);
    try {
      await fetch(`/api/admin/tags/${tag.id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {/* Barre de recherche + filtres + création */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un tag..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-[var(--orange)] outline-none"
          />
        </div>

        <div className="flex gap-2">
          {(['tous', 'actifs', 'inactifs'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filtre === f
                  ? 'bg-[var(--orange)] text-white'
                  : 'bg-[#1A1A1A] text-gray-400 border border-[#333] hover:border-[var(--orange)]'
              }`}
            >
              {f}
            </button>
          ))}

          <button
            onClick={() => { setCreating(true); setError(''); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--orange)] text-white hover:bg-[var(--orange-hover)] transition-colors"
          >
            <Plus size={16} />
            Nouveau tag
          </button>
        </div>
      </div>

      {/* Formulaire de création */}
      {creating && (
        <div className="bg-[var(--bg-card)] border border-[var(--orange)]/40 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') creerTag();
              if (e.key === 'Escape') annulerCreation();
            }}
            placeholder="Nom du nouveau tag..."
            autoFocus
            className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:border-[var(--orange)] outline-none"
          />
          <button
            onClick={creerTag}
            disabled={creatingLoading || !newTagName.trim()}
            className="p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 disabled:opacity-50"
          >
            <Check size={16} />
          </button>
          <button
            onClick={annulerCreation}
            className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{tagsInitiaux.length}</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-green-500/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Disponibles</p>
          <p className="text-2xl font-bold text-green-400">
            {tagsInitiaux.filter(t => t.actif).length}
          </p>
        </div>
        <div className="bg-[var(--bg-card)] border border-red-500/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">En rupture</p>
          <p className="text-2xl font-bold text-red-400">
            {tagsInitiaux.filter(t => !t.actif).length}
          </p>
        </div>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Tableau */}
      <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        {tagsFiltres.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucun tag trouvé</div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#0A0A0A] border-b border-[#1F1F1F]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Nom du tag</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">Utilisé dans</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">Statut</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tagsFiltres.map(tag => (
                <tr
                  key={tag.id}
                  className="border-b border-[#1F1F1F] last:border-b-0 hover:bg-[#0A0A0A] transition-colors"
                >
                  {/* Nom (édition inline) */}
                  <td className="px-6 py-4">
                    {editingId === tag.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') sauvegarderRename(tag.id);
                            if (e.key === 'Escape') annulerEdition();
                          }}
                          autoFocus
                          className="bg-[#1A1A1A] border border-[var(--orange)] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
                        />
                        <button
                          onClick={() => sauvegarderRename(tag.id)}
                          disabled={loading === tag.id}
                          className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={annulerEdition}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className={`font-medium ${tag.actif ? 'text-white' : 'text-gray-500 line-through'}`}>
                        {tag.nom}
                      </span>
                    )}
                  </td>

                  {/* Nombre d'utilisations */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
                      <Package size={14} />
                      {tag._count.produits} produit{tag._count.produits > 1 ? 's' : ''}
                    </span>
                  </td>

                  {/* Statut */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      tag.actif
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {tag.actif ? 'Disponible' : 'Rupture'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId !== tag.id && (
                        <button
                          onClick={() => ouvrirEdition(tag)}
                          className="p-2 rounded-lg bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-[var(--orange)] hover:border-[var(--orange)] transition-colors"
                          title="Renommer"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => toggleActif(tag)}
                        disabled={loading === tag.id}
                        className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
                          tag.actif
                            ? 'bg-[#1A1A1A] border-[#333] text-gray-400 hover:text-red-400 hover:border-red-500/50'
                            : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                        }`}
                        title={tag.actif ? 'Marquer en rupture' : 'Remettre disponible'}
                      >
                        {tag.actif ? <PowerOff size={16} /> : <Power size={16} />}
                      </button>

                      <button
                        onClick={() => supprimer(tag)}
                        disabled={loading === tag.id}
                        className="p-2 rounded-lg bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-red-400 hover:border-red-500/50 transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
