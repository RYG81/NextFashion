import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FieldWithAuto } from '../components/ui/Input';
import type { ClothingItem, ClothingCategory, ClothingState } from '../types';

const CATEGORIES: { value: ClothingCategory; label: string; icon: string }[] = [
  { value: 'lingerie', label: 'Lingerie / Intimate', icon: '🌸' },
  { value: 'swimwear', label: 'Swimwear', icon: '👙' },
  { value: 'casual', label: 'Casual', icon: '👕' },
  { value: 'formal', label: 'Formal / Evening', icon: '👗' },
  { value: 'traditional-indian', label: 'Indian Traditional', icon: '🪷' },
  { value: 'streetwear', label: 'Streetwear', icon: '🧢' },
  { value: 'sportswear', label: 'Sportswear', icon: '⚡' },
  { value: 'evening', label: 'Evening Gown', icon: '✨' },
  { value: 'resort', label: 'Resort / Beach', icon: '🌴' },
  { value: 'layered', label: 'Layered Outfit', icon: '🧥' },
  { value: 'custom', label: 'Custom', icon: '🎨' },
];

const COLORS = ['Jet black', 'Ivory white', 'Cream', 'Blush pink', 'Dusty rose', 'Burgundy', 'Deep red', 'Navy blue', 'Cobalt', 'Forest green', 'Sage', 'Gold', 'Silver', 'Nude', 'Taupe', 'Lavender', 'Coral', 'Terracotta', 'Emerald', 'Chocolate brown', 'Deep purple'];
const MATERIALS = ['Satin', 'Silk', 'Lace', 'Cotton', 'Linen', 'Denim', 'Leather', 'Velvet', 'Chiffon', 'Organza', 'Jersey', 'Cashmere', 'Wool', 'Polyester', 'Georgette', 'Crepe', 'Mesh', 'Tulle'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function blankClothing(): Partial<ClothingItem> {
  return {
    name: '', category: 'casual', style: '', color: '', material: '',
    fit: '', details: '', accessories: [], layers: [], states: [], progressionNotes: '', tags: [],
  };
}

const GARMENT_PROMPTS: Record<ClothingCategory, string> = {
  'lingerie': 'Generate a photorealistic flat-lay image of elegant lingerie set on white background: bra and panties in [color] [material], [details]. Studio lighting, product photography style.',
  'swimwear': 'Generate flat-lay product photography of swimwear on white background: [style] swimsuit in [color] [material]. Clean studio lighting.',
  'casual': 'Generate flat-lay product image of casual outfit on white background: [name] in [color] [material]. Product photography style.',
  'formal': 'Generate flat-lay product image of formal wear on white background: [name] in [color] [material] with [details].',
  'traditional-indian': 'Generate flat-lay image of Indian traditional garment on white background: [name] in [color] [material] with [details]. Show complete set including blouse and accessories.',
  'streetwear': 'Generate flat-lay streetwear product shot on white background: [name] in [color] [material].',
  'sportswear': 'Generate flat-lay athletic wear product image on white background: [name] in [color] [material].',
  'evening': 'Generate flat-lay evening wear product image on white background: [name] in [color] [material] with [details].',
  'resort': 'Generate flat-lay resort/beach wear product image on white background: [name] in [color] [material].',
  'layered': 'Generate flat-lay product image showing all layers of outfit on white background: [layers listed separately]. Studio product photography.',
  'custom': 'Generate flat-lay product photography of custom garment on white background: [name] in [color] [material] with [details].',
};

export function ClothDesigner() {
  const { clothing, saveClothing, deleteClothing } = useApp();
  const [editing, setEditing] = useState<Partial<ClothingItem> | null>(null);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [saving, setSaving] = useState(false);
  const [showFlatPrompt, setShowFlatPrompt] = useState(false);
  const [newState, setNewState] = useState('');

  const handleNew = () => {
    setEditing(blankClothing());
    setView('edit');
  };

  const up = (key: keyof ClothingItem, val: any) => setEditing(e => e ? { ...e, [key]: val } : e);

  const handleAutoGen = () => {
    const cat = pick(CATEGORIES);
    setEditing(e => ({
      ...e,
      category: cat.value,
      color: pick(COLORS),
      material: pick(MATERIALS),
      name: `${pick(COLORS)} ${pick(MATERIALS)} ${cat.label}`,
      style: pick(['Minimalist', 'Romantic', 'Bold', 'Classic', 'Bohemian', 'Edgy', 'Luxurious']),
      fit: pick(['Fitted', 'Relaxed', 'Oversized', 'Tailored', 'Flowy', 'Structured']),
      details: 'Delicate trim, subtle texture, refined finish',
      accessories: ['Gold jewelry', 'Minimal accessories'],
      progressionNotes: 'Natural progression from styled to relaxed',
      states: [
        { id: uuidv4(), label: 'Fully styled', description: 'Complete look as designed', phase: 'arrival' },
        { id: uuidv4(), label: 'Relaxed', description: 'Casual adjustment, comfort shown', phase: 'build' },
        { id: uuidv4(), label: 'Partially removed', description: 'Outer layer removed or adjusted', phase: 'intimate' },
      ],
    }));
  };

  const addState = () => {
    if (!newState.trim()) return;
    const state: ClothingState = {
      id: uuidv4(),
      label: newState,
      description: `${newState} state`,
    };
    up('states', [...(editing?.states || []), state]);
    setNewState('');
  };

  const removeState = (id: string) => up('states', (editing?.states || []).filter(s => s.id !== id));

  const getFlatPrompt = () => {
    if (!editing) return '';
    const template = GARMENT_PROMPTS[editing.category as ClothingCategory] || GARMENT_PROMPTS.custom;
    return template
      .replace('[name]', editing.name || 'garment')
      .replace('[color]', editing.color || '')
      .replace('[material]', editing.material || '')
      .replace('[details]', editing.details || '')
      .replace('[style]', editing.style || '')
      .replace('[layers listed separately]', (editing.layers || []).join(', '));
  };

  const handleSave = async () => {
    if (!editing?.name) return alert('Name required');
    setSaving(true);
    const item: ClothingItem = {
      id: (editing as ClothingItem).id || uuidv4(),
      name: editing.name || '',
      category: editing.category as ClothingCategory || 'casual',
      style: editing.style || '',
      color: editing.color || '',
      material: editing.material || '',
      fit: editing.fit || '',
      details: editing.details || '',
      accessories: editing.accessories || [],
      layers: editing.layers || [],
      states: editing.states || [],
      progressionNotes: editing.progressionNotes || '',
      tags: editing.tags || [],
      createdAt: (editing as ClothingItem).createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveClothing(item);
    setSaving(false);
    setView('list');
  };

  if (view === 'edit' && editing) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">👗 Cloth Designer</h1>
            <p className="text-gray-400 text-sm">Design clothing with phase progression</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setView('list'); setEditing(null); }}>← Back</Button>
            <Button variant="secondary" onClick={handleAutoGen}>⚡ Auto Design</Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>💾 Save</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader><h2 className="font-semibold text-white">Basic Info</h2></CardHeader>
              <CardBody className="space-y-4">
                <FieldWithAuto
                  label="Clothing Name"
                  value={editing.name || ''}
                  onChange={v => up('name', v)}
                  onRandomize={() => up('name', `${pick(COLORS)} ${pick(MATERIALS)} Ensemble`)}
                  placeholder="e.g. Black Satin Lingerie Set"
                />
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => up('category', cat.value)}
                      className={`p-2 rounded-lg border text-xs text-left transition-all ${editing.category === cat.value ? 'border-pink-500 bg-pink-500/20 text-pink-300' : 'border-gray-700 hover:border-gray-600 text-gray-400'}`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWithAuto
                    label="Color"
                    value={editing.color || ''}
                    onChange={v => up('color', v)}
                    onRandomize={() => up('color', pick(COLORS))}
                    placeholder="e.g. Jet black, Ivory..."
                  />
                  <FieldWithAuto
                    label="Material"
                    value={editing.material || ''}
                    onChange={v => up('material', v)}
                    onRandomize={() => up('material', pick(MATERIALS))}
                    placeholder="e.g. Satin, Silk, Lace..."
                  />
                </div>
                <FieldWithAuto
                  label="Style"
                  value={editing.style || ''}
                  onChange={v => up('style', v)}
                  onRandomize={() => up('style', pick(['Minimalist luxury', 'Romantic boudoir', 'Casual morning', 'Power editorial', 'Bohemian free', 'Classic elegant']))}
                  placeholder="Overall style aesthetic..."
                />
                <FieldWithAuto
                  label="Fit Description"
                  value={editing.fit || ''}
                  onChange={v => up('fit', v)}
                  placeholder="How does it fit the body..."
                />
                <FieldWithAuto
                  label="Details"
                  value={editing.details || ''}
                  onChange={v => up('details', v)}
                  multiline rows={2}
                  placeholder="Special design details, embellishments..."
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h2 className="font-semibold text-white">Layers & Accessories</h2></CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Layers</label>
                  <div className="flex gap-2">
                    <input
                      placeholder="Add a layer (e.g. Blazer, Shirt, Jeans)..."
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2 text-sm"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) { up('layers', [...(editing.layers || []), val]); (e.target as HTMLInputElement).value = ''; }
                        }
                      }}
                    />
                    <span className="text-xs text-gray-500 self-center">↵ Enter</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(editing.layers || []).map((layer, i) => (
                      <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded flex items-center gap-1">
                        {layer}
                        <button onClick={() => up('layers', (editing.layers || []).filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Accessories</label>
                  <div className="flex gap-2">
                    <input
                      placeholder="Add accessory..."
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2 text-sm"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) { up('accessories', [...(editing.accessories || []), val]); (e.target as HTMLInputElement).value = ''; }
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(editing.accessories || []).map((acc, i) => (
                      <span key={i} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded flex items-center gap-1 border border-blue-700/30">
                        {acc}
                        <button onClick={() => up('accessories', (editing.accessories || []).filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400">✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h2 className="font-semibold text-white">🎬 Clothing States (Phase Progression)</h2></CardHeader>
              <CardBody className="space-y-3">
                <p className="text-xs text-gray-400">Define how the clothing changes across phases for natural story progression</p>
                {(editing.states || []).map((state, i) => (
                  <div key={state.id} className="flex gap-2 items-start p-2 bg-gray-900/30 rounded-lg border border-gray-700">
                    <div className="flex-1 space-y-1">
                      <div className="flex gap-2">
                        <input
                          value={state.label}
                          onChange={e => {
                            const newStates = [...(editing.states || [])];
                            newStates[i] = { ...newStates[i], label: e.target.value };
                            up('states', newStates);
                          }}
                          className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                          placeholder="State label"
                        />
                        <select
                          value={state.phase || ''}
                          onChange={e => {
                            const newStates = [...(editing.states || [])];
                            newStates[i] = { ...newStates[i], phase: e.target.value as any };
                            up('states', newStates);
                          }}
                          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300"
                        >
                          <option value="">Any phase</option>
                          {['arrival', 'build', 'peak', 'intimate', 'playful', 'winddown', 'closing'].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <input
                        value={state.description}
                        onChange={e => {
                          const newStates = [...(editing.states || [])];
                          newStates[i] = { ...newStates[i], description: e.target.value };
                          up('states', newStates);
                        }}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300"
                        placeholder="Describe this state..."
                      />
                    </div>
                    <button onClick={() => removeState(state.id)} className="text-red-400 hover:text-red-300 text-xs mt-1">✕</button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={newState}
                    onChange={e => setNewState(e.target.value)}
                    placeholder="New state label (e.g. 'Jacket removed')"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2 text-sm"
                    onKeyDown={e => e.key === 'Enter' && addState()}
                  />
                  <Button variant="secondary" size="sm" onClick={addState}>+ Add</Button>
                </div>
                <FieldWithAuto
                  label="Progression Notes"
                  value={editing.progressionNotes || ''}
                  onChange={v => up('progressionNotes', v)}
                  multiline rows={2}
                  placeholder="How should clothing change through the session..."
                />
              </CardBody>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader><h2 className="font-semibold text-white text-sm">👁️ Preview</h2></CardHeader>
              <CardBody className="space-y-3">
                <div className="w-full h-28 bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg flex items-center justify-center border border-pink-700/20">
                  <div className="text-center">
                    <div className="text-4xl">{CATEGORIES.find(c => c.value === editing.category)?.icon || '👗'}</div>
                    <div className="text-white text-xs mt-1 font-medium">{editing.name || 'Unnamed'}</div>
                    <div className="text-gray-400 text-xs">{editing.color}</div>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Category', value: CATEGORIES.find(c => c.value === editing.category)?.label },
                    { label: 'Material', value: editing.material },
                    { label: 'Fit', value: editing.fit },
                    { label: 'Layers', value: (editing.layers || []).join(', ') },
                    { label: 'Accessories', value: (editing.accessories || []).join(', ') },
                  ].map(item => item.value && (
                    <div key={item.label}>
                      <div className="text-gray-500">{item.label}</div>
                      <div className="text-gray-300">{item.value}</div>
                    </div>
                  ))}
                </div>

                {(editing.states || []).length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Progression Arc:</div>
                    <div className="flex flex-col gap-1">
                      {(editing.states || []).map((state, i) => (
                        <div key={state.id} className="flex items-center gap-1 text-xs">
                          <div className="w-4 h-4 rounded-full bg-pink-600/30 flex items-center justify-center text-pink-400 font-bold text-xs flex-shrink-0">{i + 1}</div>
                          <span className="text-gray-300">{state.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            <Button
              variant="outline" size="sm" className="w-full"
              onClick={() => setShowFlatPrompt(!showFlatPrompt)}
            >
              📷 Flat-View Prompt
            </Button>
            {showFlatPrompt && (
              <Card>
                <CardBody>
                  <p className="text-xs text-gray-400">{getFlatPrompt()}</p>
                  <Button
                    variant="ghost" size="xs" className="mt-2 w-full"
                    onClick={() => navigator.clipboard.writeText(getFlatPrompt())}
                  >
                    📋 Copy Prompt
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">👗 Clothing Library</h1>
          <p className="text-gray-400 text-sm">{clothing.length} clothing items</p>
        </div>
        <Button variant="gradient" onClick={handleNew}>+ New Clothing</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {clothing.map(c => (
          <Card key={c.id} hover onClick={() => { setEditing({ ...c }); setView('edit'); }}>
            <CardBody className="p-3">
              <div className="w-full h-20 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: '#1f2937' }}>
                <div className="text-3xl">{CATEGORIES.find(cat => cat.value === c.category)?.icon || '👗'}</div>
              </div>
              <div className="text-sm font-medium text-white truncate">{c.name}</div>
              <div className="text-xs text-gray-400">{c.category} · {c.color}</div>
              <div className="text-xs text-gray-500">{c.states.length} states</div>
            </CardBody>
            <CardFooter className="p-2 flex gap-1">
              <Button variant="ghost" size="xs" className="flex-1">✏️ Edit</Button>
              <Button variant="ghost" size="xs" className="text-red-400" onClick={e => { e.stopPropagation(); if (confirm('Delete?')) deleteClothing(c.id); }}>🗑️</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
