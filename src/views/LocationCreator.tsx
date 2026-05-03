import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FieldWithAuto } from '../components/ui/Input';
import type { Location, LocationCategory, LocationObject } from '../types';

type LocationType = 'interior' | 'exterior' | 'mixed';

const CATEGORIES: { value: LocationCategory; label: string; icon: string; type: LocationType }[] = [
  { value: 'bedroom', label: 'Bedroom', icon: '🛏️', type: 'interior' },
  { value: 'living-room', label: 'Living Room / Loft', icon: '🛋️', type: 'interior' },
  { value: 'bathroom', label: 'Bathroom / Bath', icon: '🛁', type: 'interior' },
  { value: 'kitchen', label: 'Kitchen', icon: '🍳', type: 'interior' },
  { value: 'studio', label: 'Photo Studio', icon: '📸', type: 'interior' },
  { value: 'art-studio', label: 'Art Studio / Workshop', icon: '🎨', type: 'interior' },
  { value: 'hotel', label: 'Hotel / Luxury Suite', icon: '🏨', type: 'interior' },
  { value: 'cafe', label: 'Cafe / Restaurant', icon: '☕', type: 'interior' },
  { value: 'warehouse', label: 'Warehouse / Industrial', icon: '🏭', type: 'interior' },
  { value: 'garden', label: 'Garden', icon: '🌸', type: 'exterior' },
  { value: 'beach', label: 'Beach / Ocean', icon: '🏖️', type: 'exterior' },
  { value: 'forest', label: 'Forest / Nature', icon: '🌲', type: 'exterior' },
  { value: 'urban', label: 'Urban / City Street', icon: '🏙️', type: 'exterior' },
  { value: 'rooftop', label: 'Rooftop / Terrace', icon: '🌆', type: 'exterior' },
  { value: 'pool', label: 'Pool / Water', icon: '🏊', type: 'exterior' },
  { value: 'custom', label: 'Custom Location', icon: '📍', type: 'mixed' },
];

const PRESET_OBJECTS: Record<LocationCategory, Partial<LocationObject>[]> = {
  bedroom: [
    { name: 'Bed', poseOptions: ['lying on', 'sitting on edge', 'kneeling on', 'leaning against headboard'] },
    { name: 'Window', poseOptions: ['standing at', 'sitting on sill', 'leaning against frame'] },
    { name: 'Vanity', poseOptions: ['sitting at', 'standing before mirror', 'applying makeup'] },
    { name: 'Armchair', poseOptions: ['curled in', 'sitting sideways', 'draping over arm'] },
    { name: 'Dressing table', poseOptions: ['sitting at', 'leaning on', 'standing beside'] },
  ],
  'living-room': [
    { name: 'Sofa', poseOptions: ['lying on', 'sitting on back', 'curled in corner'] },
    { name: 'Coffee table', poseOptions: ['sitting on', 'leaning over', 'kneeling beside'] },
    { name: 'Bookshelf', poseOptions: ['browsing', 'leaning against', 'reaching up'] },
    { name: 'Window wall', poseOptions: ['standing at', 'silhouette', 'looking out'] },
    { name: 'Fireplace', poseOptions: ['sitting beside', 'kneeling before', 'standing at mantel'] },
  ],
  bathroom: [
    { name: 'Bathtub', poseOptions: ['sitting on edge', 'leaning over', 'stepping in'] },
    { name: 'Mirror', poseOptions: ['looking into', 'hands on frame', 'back to camera reflection'] },
    { name: 'Sink', poseOptions: ['leaning on counter', 'looking in mirror above', 'washing hands'] },
    { name: 'Shower', poseOptions: ['stepping out', 'near door', 'through glass'] },
  ],
  kitchen: [
    { name: 'Counter top', poseOptions: ['sitting on', 'leaning against', 'working at'] },
    { name: 'Island', poseOptions: ['sitting at bar stool', 'leaning over', 'standing behind'] },
    { name: 'Window above sink', poseOptions: ['looking out', 'hands on sill', 'dreaming'] },
  ],
  studio: [
    { name: 'White backdrop', poseOptions: ['various poses', 'walking toward camera'] },
    { name: 'Stool', poseOptions: ['sitting', 'perched on edge', 'one leg up'] },
    { name: 'Reflector', poseOptions: ['near', 'interacting with light'] },
  ],
  garden: [
    { name: 'Stone bench', poseOptions: ['sitting on', 'standing beside', 'leaning against'] },
    { name: 'Flower bed', poseOptions: ['kneeling in', 'standing among flowers', 'touching petals'] },
    { name: 'Fountain', poseOptions: ['standing near', 'hand in water', 'sitting on edge'] },
    { name: 'Gazebo', poseOptions: ['standing in', 'leaning on post', 'seated inside'] },
  ],
  beach: [
    { name: 'Shoreline', poseOptions: ['standing in surf', 'walking along', 'waves at feet'] },
    { name: 'Rock formation', poseOptions: ['sitting on', 'climbing', 'leaning against'] },
    { name: 'Beach towel', poseOptions: ['lying on', 'sitting cross-legged', 'kneeling'] },
    { name: 'Boat', poseOptions: ['sitting on bow', 'leaning on side', 'looking over edge'] },
  ],
  forest: [
    { name: 'Tree trunk', poseOptions: ['leaning against', 'sitting at base', 'arms around'] },
    { name: 'Fallen log', poseOptions: ['sitting on', 'lying on', 'stepping over'] },
    { name: 'Stream', poseOptions: ['sitting at bank', 'wading', 'stepping on stones'] },
    { name: 'Moss-covered rock', poseOptions: ['sitting on', 'standing on', 'kneeling beside'] },
  ],
  urban: [
    { name: 'Wall/Mural', poseOptions: ['leaning against', 'hands on wall', 'looking to side'] },
    { name: 'Steps/Stairs', poseOptions: ['sitting on', 'standing on step', 'walking up'] },
    { name: 'Bench', poseOptions: ['sitting', 'lying along', 'kneeling on seat'] },
    { name: 'Lamppost', poseOptions: ['leaning against', 'holding', 'walking past'] },
  ],
  rooftop: [
    { name: 'Railing', poseOptions: ['leaning over', 'back to railing', 'hands on top'] },
    { name: 'Urban skyline backdrop', poseOptions: ['standing before', 'back to camera looking out'] },
    { name: 'Poolside area', poseOptions: ['sitting at edge', 'lying beside', 'dangling feet in'] },
  ],
  pool: [
    { name: 'Pool edge', poseOptions: ['sitting with feet in water', 'lying along edge', 'dangling legs'] },
    { name: 'Diving board', poseOptions: ['standing on end', 'sitting on', 'walking along'] },
    { name: 'Pool steps', poseOptions: ['sitting on in water', 'emerging from pool'] },
  ],
  'art-studio': [
    { name: 'Easel', poseOptions: ['painting', 'standing beside', 'looking at canvas'] },
    { name: 'Wooden floor', poseOptions: ['sitting cross-legged', 'lying on', 'kneeling'] },
    { name: 'Large windows', poseOptions: ['bathed in light', 'silhouette', 'looking out'] },
  ],
  hotel: [
    { name: 'Luxury bed', poseOptions: ['lying on', 'sitting on edge', 'kneeling on'] },
    { name: 'Floor-to-ceiling window', poseOptions: ['city view silhouette', 'hands on glass', 'seated before'] },
    { name: 'Velvet chaise', poseOptions: ['reclining', 'sitting at end', 'draped over'] },
  ],
  cafe: [
    { name: 'Table', poseOptions: ['sitting at', 'leaning on', 'hands wrapped around cup'] },
    { name: 'Window seat', poseOptions: ['looking out', 'curled up reading', 'contemplating'] },
    { name: 'Bar stool', poseOptions: ['perched on', 'one leg up', 'swiveling'] },
  ],
  warehouse: [
    { name: 'Brick wall', poseOptions: ['leaning against', 'hands on', 'looking to side'] },
    { name: 'Industrial door', poseOptions: ['standing in doorway', 'leaning on frame', 'pushing open'] },
    { name: 'Concrete floor', poseOptions: ['sitting on', 'lying on', 'kneeling on'] },
  ],
  custom: [
    { name: 'Primary feature', poseOptions: ['standing near', 'interacting with', 'beside'] },
    { name: 'Seating area', poseOptions: ['sitting', 'leaning', 'resting'] },
  ],
};

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function blankLocation(): Partial<Location> {
  return {
    name: '', type: 'interior', category: 'bedroom', description: '',
    ambiance: '', lightingNotes: '', objects: [], subAreas: [], mood: '',
    timeOfDay: [], season: [], tags: [],
  };
}

const get360Prompt = (loc: Partial<Location>) =>
  `Generate a photorealistic 360-degree equirectangular panoramic image of: ${loc.name || 'location'}. ${loc.description || ''} Ambiance: ${loc.ambiance || ''}. Lighting: ${loc.lightingNotes || ''}. Mood: ${loc.mood || ''}. Make it ultra-detailed, architectural photography quality, suitable as a VR background reference image. 8K resolution, HDR lighting, no people in frame.`;

export function LocationCreator() {
  const { locations, saveLocation, deleteLocation } = useApp();
  const [editing, setEditing] = useState<Partial<Location> | null>(null);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [saving, setSaving] = useState(false);
  const [show360, setShow360] = useState(false);
  const [newArea, setNewArea] = useState('');

  const handleNew = () => {
    setEditing(blankLocation());
    setView('edit');
  };

  const up = (key: keyof Location, val: any) => setEditing(e => e ? { ...e, [key]: val } : e);

  const handleAutoGen = () => {
    const cat = pick(CATEGORIES);
    const presetObjs = (PRESET_OBJECTS[cat.value] || []).map(o => ({ ...o, id: uuidv4() } as LocationObject));
    setEditing(e => ({
      ...e,
      category: cat.value,
      type: cat.type,
      name: `${pick(['Luxurious', 'Minimalist', 'Rustic', 'Modern', 'Classic', 'Vibrant', 'Serene'])} ${cat.label}`,
      description: `A beautifully designed ${cat.label.toLowerCase()} space with carefully curated details, perfect proportions and an evocative atmosphere`,
      ambiance: pick(['Warm and intimate', 'Cool and modern', 'Natural and organic', 'Dramatic and moody', 'Light and airy', 'Rich and textured']),
      lightingNotes: pick(['Soft diffused natural light from large windows', 'Warm artificial lighting with candle accents', 'Dramatic side lighting creating deep shadows', 'Even golden hour light flooding the space']),
      mood: pick(['Romantic and intimate', 'Bold and editorial', 'Fresh and natural', 'Moody and mysterious', 'Bright and joyful']),
      objects: presetObjs,
      subAreas: ['Main area', 'Near window', 'Corner seating', 'Central space', 'Entrance area'],
      timeOfDay: ['Morning', 'Afternoon', 'Evening'],
      season: ['All seasons'],
    }));
  };

  const loadPresetObjects = (category: LocationCategory) => {
    const presets = (PRESET_OBJECTS[category] || []).map(o => ({
      id: uuidv4(),
      name: o.name || '',
      poseOptions: o.poseOptions || [],
    }));
    up('objects', presets);
  };

  const handleSave = async () => {
    if (!editing?.name) return alert('Name required');
    setSaving(true);
    const loc: Location = {
      id: (editing as Location).id || uuidv4(),
      name: editing.name || '',
      type: editing.type as LocationType || 'interior',
      category: editing.category as LocationCategory || 'custom',
      description: editing.description || '',
      ambiance: editing.ambiance || '',
      lightingNotes: editing.lightingNotes || '',
      objects: editing.objects || [],
      subAreas: editing.subAreas || [],
      mood: editing.mood || '',
      timeOfDay: editing.timeOfDay || [],
      season: editing.season || [],
      tags: editing.tags || [],
      createdAt: (editing as Location).createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveLocation(loc);
    setSaving(false);
    setView('list');
  };

  if (view === 'edit' && editing) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">📍 Location Creator</h1>
            <p className="text-gray-400 text-sm">Design photoshoot locations with precision</p>
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
              <CardHeader><h2 className="font-semibold text-white">Location Identity</h2></CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-3 gap-1">
                  {['interior', 'exterior', 'mixed'].map(t => (
                    <button
                      key={t}
                      onClick={() => up('type', t)}
                      className={`py-2 rounded-lg border text-xs text-center transition-all capitalize ${editing.type === t ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}
                    >
                      {t === 'interior' ? '🏠' : t === 'exterior' ? '🌿' : '⭕'} {t}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => { up('category', cat.value); up('type', cat.type); loadPresetObjects(cat.value); }}
                      className={`p-2 rounded-lg border text-xs text-left transition-all ${editing.category === cat.value ? 'border-emerald-500 bg-emerald-500/20' : 'border-gray-700 hover:border-gray-600 text-gray-400'}`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
                <FieldWithAuto
                  label="Location Name"
                  value={editing.name || ''}
                  onChange={v => up('name', v)}
                  onRandomize={() => up('name', `${pick(['Luxury', 'Rustic', 'Modern', 'Classic', 'Vibrant', 'Serene', 'Dramatic'])} ${CATEGORIES.find(c => c.value === editing.category)?.label || 'Location'}`)}
                  placeholder="e.g. Parisian Apartment Suite"
                />
                <FieldWithAuto
                  label="Description"
                  value={editing.description || ''}
                  onChange={v => up('description', v)}
                  multiline rows={3}
                  placeholder="Detailed description of the location..."
                />
                <div className="grid grid-cols-2 gap-4">
                  <FieldWithAuto
                    label="Ambiance"
                    value={editing.ambiance || ''}
                    onChange={v => up('ambiance', v)}
                    onRandomize={() => up('ambiance', pick(['Warm and intimate', 'Cool and modern', 'Natural and organic', 'Dramatic and moody', 'Light and airy']))}
                    placeholder="Overall feeling/atmosphere..."
                  />
                  <FieldWithAuto
                    label="Mood"
                    value={editing.mood || ''}
                    onChange={v => up('mood', v)}
                    onRandomize={() => up('mood', pick(['Romantic', 'Editorial', 'Fresh natural', 'Moody mysterious', 'Bright joyful', 'Luxurious']))}
                    placeholder="Emotional mood..."
                  />
                </div>
                <FieldWithAuto
                  label="Lighting Notes"
                  value={editing.lightingNotes || ''}
                  onChange={v => up('lightingNotes', v)}
                  multiline rows={2}
                  placeholder="Natural and artificial light qualities..."
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white">Location Objects & Pose Points</h2>
                  <button
                    onClick={() => loadPresetObjects(editing.category as LocationCategory)}
                    className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
                  >🔄 Load Presets</button>
                </div>
              </CardHeader>
              <CardBody className="space-y-3">
                {(editing.objects || []).map((obj, i) => (
                  <div key={obj.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        value={obj.name}
                        onChange={e => {
                          const newObjs = [...(editing.objects || [])];
                          newObjs[i] = { ...newObjs[i], name: e.target.value };
                          up('objects', newObjs);
                        }}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                        placeholder="Object name"
                      />
                      <button onClick={() => up('objects', (editing.objects || []).filter((_, j) => j !== i))} className="text-red-400 text-xs">✕</button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {obj.poseOptions.map((pose, pi) => (
                        <span key={pi} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{pose}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <Button
                  variant="secondary" size="xs"
                  onClick={() => up('objects', [...(editing.objects || []), { id: uuidv4(), name: 'New Object', poseOptions: ['standing near', 'sitting on', 'leaning against'] }])}
                >
                  + Add Object
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h2 className="font-semibold text-white">Sub-Areas & Time</h2></CardHeader>
              <CardBody className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Sub-Areas</label>
                  <div className="flex gap-2">
                    <input
                      value={newArea}
                      onChange={e => setNewArea(e.target.value)}
                      placeholder="e.g. Bed area, Window bay..."
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2 text-sm"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newArea.trim()) {
                          up('subAreas', [...(editing.subAreas || []), newArea.trim()]);
                          setNewArea('');
                        }
                      }}
                    />
                    <Button variant="secondary" size="sm" onClick={() => { if (newArea.trim()) { up('subAreas', [...(editing.subAreas || []), newArea.trim()]); setNewArea(''); } }}>+</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(editing.subAreas || []).map((area, i) => (
                      <span key={i} className="text-xs bg-emerald-900/30 text-emerald-300 px-2 py-1 rounded border border-emerald-700/30 flex items-center gap-1">
                        {area}
                        <button onClick={() => up('subAreas', (editing.subAreas || []).filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400">✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader><h2 className="font-semibold text-white text-sm">👁️ Location Preview</h2></CardHeader>
              <CardBody className="space-y-3">
                <div className="w-full h-24 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-lg flex items-center justify-center border border-emerald-700/20">
                  <div className="text-center">
                    <div className="text-4xl">{CATEGORIES.find(c => c.value === editing.category)?.icon || '📍'}</div>
                    <div className="text-white text-xs mt-1">{editing.name || 'Unnamed'}</div>
                    <div className="text-gray-400 text-xs">{editing.type}</div>
                  </div>
                </div>
                {editing.description && <p className="text-xs text-gray-400">{editing.description}</p>}
                <div className="space-y-1 text-xs">
                  {editing.ambiance && <div><span className="text-gray-500">Ambiance:</span> <span className="text-gray-300">{editing.ambiance}</span></div>}
                  {editing.mood && <div><span className="text-gray-500">Mood:</span> <span className="text-gray-300">{editing.mood}</span></div>}
                  {editing.lightingNotes && <div><span className="text-gray-500">Light:</span> <span className="text-gray-300">{editing.lightingNotes}</span></div>}
                  {(editing.objects || []).length > 0 && (
                    <div><span className="text-gray-500">Objects:</span> <span className="text-gray-300">{(editing.objects || []).map(o => o.name).join(', ')}</span></div>
                  )}
                </div>
              </CardBody>
            </Card>

            <Button
              variant="outline" size="sm" className="w-full"
              onClick={() => setShow360(!show360)}
            >
              🌐 360° Image Prompt
            </Button>
            {show360 && (
              <Card>
                <CardBody>
                  <p className="text-xs text-gray-400">{get360Prompt(editing)}</p>
                  <Button variant="ghost" size="xs" className="mt-2 w-full" onClick={() => navigator.clipboard.writeText(get360Prompt(editing))}>📋 Copy</Button>
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
          <h1 className="text-2xl font-bold text-white">📍 Location Library</h1>
          <p className="text-gray-400 text-sm">{locations.length} locations available</p>
        </div>
        <Button variant="gradient" onClick={handleNew}>+ New Location</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {locations.map(loc => (
          <Card key={loc.id} hover onClick={() => { setEditing({ ...loc }); setView('edit'); }}>
            <CardBody className="p-3">
              <div className="w-full h-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-lg flex items-center justify-center mb-2 border border-emerald-700/10">
                <div className="text-3xl">{CATEGORIES.find(c => c.value === loc.category)?.icon || '📍'}</div>
              </div>
              <div className="text-sm font-medium text-white truncate">{loc.name}</div>
              <div className="text-xs text-gray-400">{loc.type} · {loc.category}</div>
              <div className="text-xs text-gray-500">{loc.objects.length} objects</div>
            </CardBody>
            <CardFooter className="p-2 flex gap-1">
              <Button variant="ghost" size="xs" className="flex-1">✏️ Edit</Button>
              <Button variant="ghost" size="xs" className="text-red-400" onClick={e => { e.stopPropagation(); if (confirm('Delete?')) deleteLocation(loc.id); }}>🗑️</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
