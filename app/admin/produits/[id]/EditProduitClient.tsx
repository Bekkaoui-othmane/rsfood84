'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import type { Produit, Ingredient } from '@prisma/client';
import TagInput from '@/components/admin/TagInput';

const CATEGORIES = ['Burgers', 'Tacos', 'Sandwichs', 'Poutines', 'Formules', 'Riz Crousty'];

type ProduitAvecIngredients = Produit & { ingredients: Ingredient[] };

interface Props {
  produit: ProduitAvecIngredients;
}

export default function EditProduitClient({ produit }: Props) {
  const router = useRouter();
  const [nom, setNom] = useState(produit.nom);
  const [tagsDescription, setTagsDescription] = useState<string[]>(
    produit.description ? produit.description.split(',').map(t => t.trim()).filter(Boolean) : []
  );
  const [tagsIngredients, setTagsIngredients] = useState<string[]>(
    produit.ingredients.filter(i => !i.estSuppl).map(i => i.nom)
  );
  const [prix, setPrix] = useState(String(produit.prix));
  const [categorie, setCategorie] = useState(produit.categorie);
  const [imageUrl, setImageUrl] = useState(produit.image);
  const [imagePreview, setImagePreview] = useState(produit.image);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestionsDescription, setSuggestionsDescription] = useState<string[]>([]);
  const [suggestionsIngredients, setSuggestionsIngredients] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/admin/suggestions')
      .then(res => res.json())
      .then(data => {
        setSuggestionsDescription(data.description ?? []);
        setSuggestionsIngredients(data.ingredients ?? []);
      });
  }, []);

  const { startUpload, isUploading } = useUploadThing('productImage', {
    onClientUploadComplete: (res) => {
      const file = res?.[0] as { ufsUrl?: string; url?: string } | undefined;
      const url = file?.ufsUrl ?? file?.url;
      if (url) {
        setImageUrl(url);
        setImagePreview(url);
      }
    },
    onUploadError: (err) => {
      setError(`Erreur upload : ${err.message}`);
    },
  });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Fichier non valide : doit être une image');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    await startUpload([file]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/produits/${produit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          description: tagsDescription.join(', '),
          prix: parseFloat(prix),
          categorie,
          image: imageUrl,
          ingredientsDemontables: tagsIngredients,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      router.push('/admin/produits');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--orange)] mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Retour à la liste
      </Link>

      <h1 className="text-4xl font-bold text-white mb-8 font-[family-name:var(--font-outfit)]">
        Modifier le produit
      </h1>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl p-8 space-y-6">

          {/* Zone drag & drop */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image du produit
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
                dragActive
                  ? 'border-[var(--orange)] bg-[var(--orange)]/5'
                  : 'border-[#333] hover:border-[var(--orange)]/50'
              }`}
            >
              {imagePreview ? (
                <div className="relative">
                  <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                      unoptimized={imagePreview.startsWith('data:')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setImagePreview(''); setImageUrl(''); }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full"
                  >
                    <X size={14} />
                  </button>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                      <Loader2 className="animate-spin text-white" size={32} />
                    </div>
                  )}
                  <p className="text-center text-gray-500 text-xs mt-2">
                    Glissez une nouvelle image pour remplacer
                  </p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload size={48} className="text-gray-500 mb-4" />
                  <p className="text-white font-medium mb-1">Glissez une image ici</p>
                  <p className="text-sm text-gray-400">ou cliquez pour parcourir (max 4MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom du produit</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[var(--orange)] outline-none transition-colors"
            />
          </div>

          {/* Description via TagInput */}
          <TagInput
            label="Description (composée de tags)"
            tags={tagsDescription}
            onChange={setTagsDescription}
            suggestions={suggestionsDescription}
            placeholder="Ex: Steak haché, Cheddar..."
          />

          {/* Ingrédients démontables via TagInput */}
          <TagInput
            label="Ingrédients démontables (que le client pourra retirer)"
            tags={tagsIngredients}
            onChange={setTagsIngredients}
            suggestions={suggestionsIngredients}
            placeholder="Ex: Oignon, Cornichon..."
          />

          {/* Prix + Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prix (€)</label>
              <input
                type="number"
                step="0.50"
                min="0"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                required
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[var(--orange)] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[var(--orange)] outline-none transition-colors"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isUploading}
            className="w-full bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Enregistrement...' : isUploading ? 'Upload en cours...' : 'Enregistrer les modifications'}
          </button>
        </form>
    </div>
  );
}
