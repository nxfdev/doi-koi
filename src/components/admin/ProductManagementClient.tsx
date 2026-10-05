'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatBDT } from '@/lib/utils';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Video,
} from 'lucide-react';

interface ProductManagementClientProps {
  initialProducts: Product[];
}

export function ProductManagementClient({
  initialProducts,
}: ProductManagementClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formBengaliName, setFormBengaliName] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formPotType, setFormPotType] = useState('');
  const [formStock, setFormStock] = useState<number>(10);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIngredients, setFormIngredients] = useState('');
  const [formStorage, setFormStorage] = useState('');
  const [formShelfLife, setFormShelfLife] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formVideos, setFormVideos] = useState<string[]>([]);

  const startEdit = (p: Product) => {
    setIsCreating(false);
    setEditingProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormBengaliName(p.bengaliName || '');
    setFormPrice(p.price || 0);
    setFormTagline(p.tagline || '');
    setFormDescription(p.description || '');
    setFormWeight(p.weight || '1kg Terracotta Pot');
    setFormPotType(p.potType || 'Traditional Bogura Mati Shora');
    setFormStock(p.stock || 0);
    setFormIsAvailable(p.isAvailable);
    setFormIsFeatured(p.isFeatured);
    setFormIngredients(p.ingredients?.join('\n') || '');
    setFormStorage(p.storageInstructions || '');
    setFormShelfLife(p.shelfLife || '');
    setFormImages(p.images || ['/assets/home/hero/hero-doi.png']);
    setFormVideos(p.videos || []);
  };

  const startCreate = () => {
    setEditingProduct(null);
    setIsCreating(true);
    setFormName('');
    setFormSlug('');
    setFormBengaliName('');
    setFormPrice(400);
    setFormTagline('');
    setFormDescription('');
    setFormWeight('1kg Terracotta Pot');
    setFormPotType('Traditional Bogura Mati Shora');
    setFormStock(20);
    setFormIsAvailable(true);
    setFormIsFeatured(false);
    setFormIngredients('Pure cow milk\nSugar\nHeritage cultures');
    setFormStorage('Refrigerate at 2°C–5°C');
    setFormShelfLife('5 to 7 days');
    setFormImages(['/assets/home/hero/hero-doi.png']);
    setFormVideos([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVideo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        if (isVideo) {
          setFormVideos((prev) => [...prev, data.url]);
        } else {
          setFormImages((prev) => [...prev, data.url]);
        }
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed. Check server logs.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');

    const payload = {
      name: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-'),
      bengaliName: formBengaliName.trim(),
      price: Number(formPrice),
      tagline: formTagline.trim(),
      description: formDescription.trim(),
      weight: formWeight.trim(),
      potType: formPotType.trim(),
      stock: Number(formStock),
      isAvailable: formIsAvailable,
      isFeatured: formIsFeatured,
      ingredients: formIngredients
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      storageInstructions: formStorage.trim(),
      shelfLife: formShelfLife.trim(),
      images: formImages.length > 0 ? formImages : ['/assets/home/hero/hero-doi.png'],
      videos: formVideos,
    };

    try {
      if (isCreating) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setProducts((prev) => [...prev, data.product]);
          setIsCreating(false);
          setEditingProduct(null);
          setSaveStatus('Created successfully!');
        } else {
          alert(data.error || 'Failed to create');
        }
      } else if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          );
          setEditingProduct(null);
          setSaveStatus('Updated successfully!');
        } else {
          alert(data.error || 'Failed to update');
        }
      }
    } catch {
      alert('Network or server error');
    } finally {
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete product.');
      }
    } catch {
      alert('Delete failed.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-[#763C1E]/15 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-1">
            Curd Catalog & Inventory
          </span>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#502813]">
            Product Management
          </h1>
        </div>

        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 bg-[#763C1E] text-[#FCE08B] px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#502813] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-mono">
          {saveStatus}
        </div>
      )}

      {/* Main Products Table */}
      <div className="bg-white border border-[#763C1E]/15 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#763C1E]/20 bg-[#FFF9E6]/60 text-[#763C1E]/70 font-mono uppercase">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Price (BDT)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Vessel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#763C1E]/10 font-mono">
              {products.map((p) => {
                const isPriceUnset = p.price <= 0;
                const isOutOfStock = p.stock <= 0 || !p.isAvailable;

                return (
                  <tr key={p.id} className="hover:bg-[#FFF9E6]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F4D272]/30 border border-[#763C1E]/15 shrink-0 relative flex items-center justify-center">
                          <Image
                            src={p.images[0] || '/assets/home/hero/hero-doi.png'}
                            alt={p.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-bold font-sans text-sm text-[#502813] block">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[#763C1E]/60 font-mono">
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-sm text-[#502813]">
                      {isPriceUnset ? (
                        <span className="text-amber-800 bg-amber-100 px-2 py-0.5 text-[10px]">
                          Unset (Edit)
                        </span>
                      ) : (
                        formatBDT(p.price)
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold ${
                          p.stock <= 5 ? 'text-red-700' : 'text-emerald-800'
                        }`}
                      >
                        {p.stock} pots
                      </span>
                      {p.stock === 0 && (
                        <span className="block text-[10px] text-red-600 font-bold uppercase">
                          SOLD OUT
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-sans text-[#763C1E]/80">
                      {p.potType || 'Terracotta'}
                    </td>

                    <td className="py-3.5 px-4">
                      {p.isAvailable ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                          Disabled
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 border border-[#763C1E]/30 text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 border border-red-300 text-red-700 hover:bg-red-700 hover:text-white transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit / Create Modal or Slide-in Drawer */}
      {(editingProduct || isCreating) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white min-h-screen p-8 sm:p-10 border-l border-[#763C1E]/20 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#763C1E]/15 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block">
                  {isCreating ? 'New Catalogue Item' : 'Modify Product'}
                </span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#502813]">
                  {isCreating ? 'Create Product' : editingProduct?.name}
                </h2>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreating(false);
                }}
                className="p-2 border border-[#763C1E] text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Mishti Doi"
                    className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. mishti-doi"
                    className="w-full border border-[#763C1E]/30 p-2.5 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                    Price in BDT (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full border border-[#763C1E]/30 p-2.5 text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                    Inventory Stock (Pots) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full border border-[#763C1E]/30 p-2.5 text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1">
                  Bengali Name
                </label>
                <input
                  type="text"
                  value={formBengaliName}
                  onChange={(e) => setFormBengaliName(e.target.value)}
                  placeholder="বগুড়ার মিষ্টি দই"
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1">
                  Tagline / Essence
                </label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="The timeless caramelized classic in red clay pots"
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-[#763C1E] mb-1">
                    Weight / Volume
                  </label>
                  <input
                    type="text"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#763C1E] mb-1">
                    Pot / Vessel Type
                  </label>
                  <input
                    type="text"
                    value={formPotType}
                    onChange={(e) => setFormPotType(e.target.value)}
                    className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1">
                  Ingredients (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                />
              </div>

              {/* Media Upload Area */}
              <div className="border border-dashed border-[#763C1E]/30 p-4 space-y-3 bg-[#FFF9E6]/30">
                <span className="font-mono uppercase font-bold text-[#763C1E] block">
                  Product Media Management
                </span>

                <div className="flex flex-wrap gap-3">
                  {formImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 border border-[#763C1E]/20 relative bg-white p-1"
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 items-center">
                  <label className="cursor-pointer inline-flex items-center gap-2 border border-[#763C1E] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>

                  <label className="cursor-pointer inline-flex items-center gap-2 border border-[#763C1E] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors">
                    <Video className="w-3.5 h-3.5" />
                    <span>Upload Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
                {isUploading && (
                  <span className="text-[10px] text-[#763C1E] font-mono">
                    Uploading media to server...
                  </span>
                )}
              </div>

              {/* Checkbox Toggles */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-xs">
                  <input
                    type="checkbox"
                    checked={formIsAvailable}
                    onChange={(e) => setFormIsAvailable(e.target.checked)}
                    className="accent-[#763C1E] w-4 h-4"
                  />
                  <span>Available for Ordering</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-xs">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="accent-[#763C1E] w-4 h-4"
                  />
                  <span>Featured Selection</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#763C1E]/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 border border-[#763C1E]/30 uppercase font-mono tracking-wider text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-7 py-2.5 bg-[#763C1E] text-[#FCE08B] font-bold uppercase tracking-wider text-xs hover:bg-[#502813] transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
