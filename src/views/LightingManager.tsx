import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FieldWithAuto } from '../components/ui/Input';
import type { LightingSetup } from '../types';

type LightingType = LightingSetup['type'];

const TYPES: { value: LightingType; label: string; icon: string }[] = [
  { value: 'natural', label: 'Natural', icon: '☀️' },
  { value: 'studio', label: 'Studio', icon: '💡' },
  { value: 'mixed', label: 'Mixed', icon: '🌤️' },
  { value: 'dramatic', label: 'Dramatic', icon: '🎭' },
  { value: 'soft', label: 'Soft', icon: '🌸' },
  { value: 'golden-hour', label: 'Golden Hour', icon: '🌅' },
  { value: 'blue-hour', label: 'Blue Hour', icon: '🌆' },
  { value: 'neon', label: 'Neon / Urban', icon: '🌃' },
  { value: 'candlelight', label: 'Candlelight', icon: '🕯️' },
];

const DIRECTIONS = ['Front', 'Side (45°)', 'Side (90°)', 'Back', 'Rim', 'Top', 'Bottom', 'Three-point', 'Wrap-around'];
const QUALITIES = ['Hard (sharp shadows)', 'Soft (diffused)', 'Mixed contrast', 'Feathered', 'Dappled', 'Gradient', 'Specular'];
const COLOR_TEMPS = ['1800K (candle)', '2200K (tungsten)', '2700K (warm white)', '3200K (halogen)', '4500K (cool white)', '5500K (daylight)', '6500K (overcast)', '7500K (shade)', '9000K (blue sky)', 'Mixed warm/cool'];
const MOODS = ['Romantic', 'Dramatic', 'Fresh', 'Moody', 'Ethereal', 'Energetic', 'Intimate', 'Commercial', 'Editorial', 'Natural'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function blank(): Partial<LightingSetup> {
  return { name: '', type: 'natural', description: '', direction: '', quality: '', colorTemperature: '', mood: '', modifiers: [], tags: [] };
}

export function LightingManager() {
  const { lighting, saveLighting, deleteLighting } = useApp();
  const [editing, setEditing] = useState<Partial<LightingSetup> | null>(null);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [saving, setSaving] = useState(false);

  const up = (key: keyof LightingSetup, val: any) => setEditing(e => e ? { ...e, [key]: val } : e);

  const handleAutoGen = () => {
    const type = pick(TYPES);
    setEditing(e => ({
      ...e,
      type: type.value,
      name: `${pick(['Soft', 'Dramatic', 'Golden', 'Cool', 'Warm', 'Natural', 'Moody'])} ${type.label} Light`,
      description: pick([
        'Beautifully diffused light wrapping around the subject with minimal shadows',
        'Dramatic side light creating strong contrast and defining facial features',
        'Warm golden hour light bathing the scene in rich amber tones',
        'Soft studio light from large overhead source, perfectly even and flattering',
        'Mixed natural and artificial creating layered depth of light',
      ]),
      direction: pick(DIRECTIONS),
      quality: pick(QUALITIES),
      colorTemperature: pick(COLOR_TEMPS),
      mood: pick(MOODS),
      modifiers: pick([['Diffusion panel', 'Bounce card'], ['Large softbox', 'Fill reflector'], ['Gridded source', 'Kicker light'], ['Natural window', 'Reflector fill']]),
    }));
  };

  const handleSave = async () => {
    if (!editing?.name) return alert('Name required');
    setSaving(true);
    const item: LightingSetup = {
      id: (editing as LightingSetup).id || uuidv4(),
      name: editing.name || '',
      type: editing.type as LightingType || 'natural',
      description: editing.description || '',
      direction: editing.direction || '',
      quality: editing.quality || '',
      colorTemperature: editing.colorTemperature || '',
      mood: editing.mood || '',
      timeOfDay: editing.timeOfDay,
      modifiers: editing.modifiers || [],
      tags: editing.tags || [],
      createdAt: (editing as LightingSetup).createdAt || new Date().toISOString(),
    };
    await saveLighting(item);
    setSaving(false);
    setView('list');
  };

  if (view === 'edit' && editing) {
    const typeIcon = TYPES.find(t => t.value === editing.type)?.icon || '💡';

    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">💡 Lighting Manager</h1>
            <p className="text-gray-400 text-sm">Design photorealistic lighting setups</p>
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
              <CardHeader><h2 className="font-semibold text-white">Lighting Setup</h2></CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-3 gap-1">
                  {TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => up('type', t.value)}
                      className={`p-2 rounded-lg border text-xs transition-all ${editing.type === t.value ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-gray-700 hover:border-gray-600 text-gray-400'}`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
                <FieldWithAuto
                  label="Setup Name"
                  value={editing.name || ''}
                  onChange={v => up('name', v)}
                  onRandomize={() => up('name', `${pick(['Soft', 'Dramatic', 'Golden', 'Cool', 'Warm'])} ${TYPES.find(t => t.value === editing.type)?.label || 'Light'}`)}
                  placeholder="e.g. Golden Hour Magic"
                />
                <FieldWithAuto
                  label="Description"
                  value={editing.description || ''}
                  onChange={v => up('description', v)}
                  multiline rows={2}
                  placeholder="Describe the lighting setup..."
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Direction</label>
                    <select
                      value={editing.direction || ''}
                      onChange={e => up('direction', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2.5 text-sm"
                    >
                      <option value="">Select...</option>
                      {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Quality</label>
                    <select
                      value={editing.quality || ''}
                      onChange={e => up('quality', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2.5 text-sm"
                    >
                      <option value="">Select...</option>
                      {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Color Temperature</label>
                    <select
                      value={editing.colorTemperature || ''}
                      onChange={e => up('colorTemperature', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2.5 text-sm"
                    >
                      <option value="">Select...</option>
                      {COLOR_TEMPS.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Mood</label>
                    <select
                      value={editing.mood || ''}
                      onChange={e => up('mood', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2.5 text-sm"
                    >
                      <option value="">Select...</option>
                      {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Time of Day</label>
                  <input
                    value={editing.timeOfDay || ''}
                    onChange={e => up('timeOfDay', e.target.value)}
                    placeholder="e.g. Golden hour, Early morning, Night..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader><h2 className="font-semibold text-white text-sm">Preview</h2></CardHeader>
              <CardBody className="space-y-3">
                <div className="w-full h-28 rounded-lg flex items-center justify-center border border-amber-700/20 bg-gradient-to-br from-amber-900/20 to-orange-900/20">
                  <div className="text-center">
                    <div className="text-4xl">{typeIcon}</div>
                    <div className="text-white text-xs mt-1">{editing.name || 'Unnamed'}</div>
                    <div className="text-amber-400 text-xs">{editing.type}</div>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  {editing.direction && <div><span className="text-gray-500">Direction:</span> <span className="text-gray-300">{editing.direction}</span></div>}
                  {editing.quality && <div><span className="text-gray-500">Quality:</span> <span className="text-gray-300">{editing.quality}</span></div>}
                  {editing.colorTemperature && <div><span className="text-gray-500">Color Temp:</span> <span className="text-amber-300">{editing.colorTemperature}</span></div>}
                  {editing.mood && <div><span className="text-gray-500">Mood:</span> <span className="text-gray-300">{editing.mood}</span></div>}
                  {editing.description && <div className="mt-2 text-gray-400">{editing.description}</div>}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">💡 Lighting Library</h1>
          <p className="text-gray-400 text-sm">{lighting.length} lighting setups</p>
        </div>
        <Button variant="gradient" onClick={() => { setEditing(blank()); setView('edit'); }}>+ New Lighting</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {lighting.map(l => {
          const typeObj = TYPES.find(t => t.value === l.type);
          return (
            <Card key={l.id} hover onClick={() => { setEditing({ ...l }); setView('edit'); }}>
              <CardBody className="p-3">
                <div className="w-full h-16 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-700/10">
                  <span className="text-3xl">{typeObj?.icon || '💡'}</span>
                </div>
                <div className="text-sm font-medium text-white truncate">{l.name}</div>
                <div className="text-xs text-gray-400">{typeObj?.label} · {l.mood}</div>
                <div className="text-xs text-amber-400/70">{l.colorTemperature}</div>
              </CardBody>
              <CardFooter className="p-2 flex gap-1">
                <Button variant="ghost" size="xs" className="flex-1">✏️</Button>
                <Button variant="ghost" size="xs" className="text-red-400" onClick={e => { e.stopPropagation(); if (confirm('Delete?')) deleteLighting(l.id); }}>🗑️</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
