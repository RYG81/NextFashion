import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FieldWithAuto } from '../components/ui/Input';
import type { ModelProfile } from '../types';
import { SEED_MODELS } from '../data/seedData';

const ETHNICITIES = ['Northern European', 'Southern European', 'Latin American', 'East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'African', 'African American', 'Mixed Heritage', 'Pacific Islander', 'Native American', 'Scandinavian', 'Eastern European', 'Caribbean'];
const BODY_TYPES = ['Petite slender', 'Petite curvy', 'Average slim', 'Average curvy', 'Athletic lean', 'Athletic muscular', 'Tall slender', 'Tall curvy', 'Full figured', 'Plus size', 'Model proportions'];
const HAIR_STYLES = ['Straight', 'Wavy', 'Curly', 'Coily', 'Braided', 'Updo', 'Pixie cut', 'Bob', 'Lob', 'Long', 'Medium'];
const SKIN_TONES = ['Porcelain', 'Fair', 'Light', 'Light-medium', 'Medium', 'Warm medium', 'Olive', 'Golden', 'Caramel', 'Deep caramel', 'Brown', 'Deep brown', 'Ebony'];

const RANDOM_NAMES = ['Aria', 'Mila', 'Zara', 'Luna', 'Sofia', 'Nadia', 'Emma', 'Leila', 'Mei', 'Priya', 'Vera', 'Elena', 'Camille', 'Jasmine', 'Amara', 'Chiara', 'Bianca', 'Maya', 'Layla', 'Ingrid'];
const RANDOM_SURNAMES = ['Voss', 'Reyes', 'Nakamura', 'Okonkwo', 'Sharma', 'Dubois', 'Marchetti', 'Amir', 'Lindqvist', 'Yamamoto', 'Sokolova', 'Park', 'Laurent', 'Chen', 'Vasquez', 'Bloom'];

function randomName() {
  return `${RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]} ${RANDOM_SURNAMES[Math.floor(Math.random() * RANDOM_SURNAMES.length)]}`;
}
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const SYSTEM_PROMPT = `You are an AI model profile generator for fashion photography. Generate detailed, fictional model profiles for AI image generation. Each profile should include:
- Unique name (first and last)
- Age (18-35)
- Ethnicity (be specific and diverse)
- Facial features (detailed: eye shape, nose, lips, face shape, cheekbones)
- Personal traits (personality, presence, energy)
- Hair details (color, length, texture, style)
- Body type (height, proportions, build)
- Skin details (tone, texture, undertones) - for photorealism
- Special marks (optional: birthmarks, freckles, subtle tattoos)
- Favorite clothing styles
- Favorite accessories
- Favorite locations

Generate profiles that are diverse, unique, and suitable for professional fashion photography. Never use real people's names or details.`;

function blankModel(): Partial<ModelProfile> {
  return {
    name: '', age: 22, ethnicity: '', facialFeatures: '', traits: '',
    hairDetails: '', bodyType: '', specialMarks: '', skinDetails: '',
    favoriteClothing: '', favoriteAccessories: '', favoriteLocation: '',
    tags: [],
  };
}

export function ModelBuilder() {
  const { models, saveModel, deleteModel, setActiveView } = useApp();
  const [editing, setEditing] = useState<Partial<ModelProfile> | null>(null);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [saving, setSaving] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = models.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.ethnicity.toLowerCase().includes(search.toLowerCase())
  );

  const handleNew = () => {
    setEditing(blankModel());
    setView('edit');
  };

  const handleEdit = (m: ModelProfile) => {
    setEditing({ ...m });
    setView('edit');
  };

  const handleAutoGenerate = () => {
    const template = SEED_MODELS[Math.floor(Math.random() * SEED_MODELS.length)];
    setEditing({
      ...template,
      id: editing?.id,
      name: randomName(),
      age: 18 + Math.floor(Math.random() * 18),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSave = async () => {
    if (!editing?.name) return alert('Name required');
    setSaving(true);
    const model: ModelProfile = {
      id: (editing as ModelProfile).id || uuidv4(),
      name: editing.name || '',
      age: editing.age || 22,
      ethnicity: editing.ethnicity || '',
      facialFeatures: editing.facialFeatures || '',
      traits: editing.traits || '',
      hairDetails: editing.hairDetails || '',
      bodyType: editing.bodyType || '',
      specialMarks: editing.specialMarks || '',
      skinDetails: editing.skinDetails || '',
      favoriteClothing: editing.favoriteClothing || '',
      favoriteAccessories: editing.favoriteAccessories || '',
      favoriteLocation: editing.favoriteLocation || '',
      tags: editing.tags || [],
      createdAt: (editing as ModelProfile).createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveModel(model);
    setSaving(false);
    setView('list');
  };

  const up = (key: keyof ModelProfile, val: string | number) => {
    setEditing(e => e ? { ...e, [key]: val } : e);
  };

  if (view === 'edit' && editing) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">👤 Model Profile Builder</h1>
            <p className="text-gray-400 text-sm">Design a unique fictional model character</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setView('list'); setEditing(null); }}>← Back</Button>
            <Button variant="secondary" onClick={handleAutoGenerate}>⚡ Auto Generate</Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>💾 Save Profile</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader><h2 className="font-semibold text-white">Basic Identity</h2></CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldWithAuto
                    label="Model Name"
                    value={editing.name || ''}
                    onChange={v => up('name', v)}
                    onRandomize={() => up('name', randomName())}
                    placeholder="e.g. Aria Voss"
                  />
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Age (18–35)</label>
                    <input
                      type="number" min={18} max={35}
                      value={editing.age || 22}
                      onChange={e => up('age', Number(e.target.value))}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
                <FieldWithAuto
                  label="Ethnicity"
                  value={editing.ethnicity || ''}
                  onChange={v => up('ethnicity', v)}
                  onRandomize={() => up('ethnicity', pick(ETHNICITIES))}
                  placeholder="e.g. Northern European, South Asian..."
                />
                <FieldWithAuto
                  label="Personal Traits"
                  value={editing.traits || ''}
                  onChange={v => up('traits', v)}
                  onRandomize={() => up('traits', pick(['Confident and commanding', 'Playful and energetic', 'Mysterious and alluring', 'Warm and approachable', 'Bold and fierce', 'Serene and elegant']))}
                  placeholder="e.g. Confident, enigmatic, effortlessly elegant"
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h2 className="font-semibold text-white">Physical Features</h2></CardHeader>
              <CardBody className="space-y-4">
                <FieldWithAuto
                  label="Facial Features"
                  value={editing.facialFeatures || ''}
                  onChange={v => up('facialFeatures', v)}
                  onRandomize={() => up('facialFeatures', pick(['High cheekbones, almond-shaped eyes, straight nose, full lips, defined jawline', 'Wide bright eyes, broad nose, generous lips, oval face, pronounced cheekbones', 'Double-lid almond eyes, refined nose, small lips, high cheekbones, V-shaped face', 'Kohl-lined almond eyes, aquiline nose, lush lips, strong cheekbones, oval face']))}
                  multiline rows={2}
                  placeholder="Describe eye shape, nose, lips, face shape..."
                />
                <FieldWithAuto
                  label="Hair Details"
                  value={editing.hairDetails || ''}
                  onChange={v => up('hairDetails', v)}
                  onRandomize={() => up('hairDetails', pick(['Platinum blonde, waist-length silky straight', 'Dark chocolate brown, shoulder-length loose curls', 'Jet black, hip-length, bone-straight, mirror shine', 'Natural 4C coils in crown afro', 'Rich auburn, voluminous long waves']))}
                  multiline rows={2}
                  placeholder="Color, length, texture, typical style..."
                />
                <FieldWithAuto
                  label="Body Type & Features"
                  value={editing.bodyType || ''}
                  onChange={v => up('bodyType', v)}
                  onRandomize={() => up('bodyType', pick([`Tall slender 5'9", long legs, petite bust`, `Petite 5'4" curvy hourglass, full bust, defined waist`, `Athletic lean 5'6", long torso, subtle curves`, `Statuesque 5'10", athletic curves, commanding proportions`]))}
                  placeholder="Height, proportions, build..."
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h2 className="font-semibold text-white">Skin & Marks (Photorealism)</h2></CardHeader>
              <CardBody className="space-y-4">
                <FieldWithAuto
                  label="Skin Details"
                  value={editing.skinDetails || ''}
                  onChange={v => up('skinDetails', v)}
                  onRandomize={() => up('skinDetails', pick(['Porcelain white, translucent, visible pores, luminous glow', 'Warm golden-olive, sun-kissed, even tone with natural blush', 'Deep ebony, blue-black undertones, luminous with inner glow', 'Fair with warm undertone, visible pores, healthy natural blush']))}
                  multiline rows={2}
                  placeholder="Tone, texture, undertones, finish..."
                />
                <FieldWithAuto
                  label="Special Marks (Optional)"
                  value={editing.specialMarks || ''}
                  onChange={v => up('specialMarks', v)}
                  onRandomize={() => up('specialMarks', pick(['Small constellation of freckles across nose bridge', 'Dimples on both cheeks, small mole above upper lip', 'Tiny mole at right collarbone', 'Light scatter of freckles across nose and shoulders', '']))}
                  placeholder="Freckles, moles, tattoos, scars..."
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h2 className="font-semibold text-white">Style Preferences (AI Hints)</h2></CardHeader>
              <CardBody className="space-y-4">
                <FieldWithAuto
                  label="Favorite Clothing"
                  value={editing.favoriteClothing || ''}
                  onChange={v => up('favoriteClothing', v)}
                  onRandomize={() => up('favoriteClothing', pick(['Minimalist luxury — silk slips, tailored trousers', 'Colorful sundresses, crop tops, denim shorts', 'Japanese fashion fusion — kimono elements, structured blazers', 'Afrocentric prints, editorial fashion']))}
                  placeholder="Style preferences..."
                />
                <FieldWithAuto
                  label="Favorite Accessories"
                  value={editing.favoriteAccessories || ''}
                  onChange={v => up('favoriteAccessories', v)}
                  onRandomize={() => up('favoriteAccessories', pick(['Delicate gold chains, stud earrings', 'Hoop earrings, layered bracelets', 'Pearl drops, hair sticks, minimalist rings', 'Gold cuffs, statement tribal jewelry']))}
                  placeholder="Accessories, jewelry..."
                />
                <FieldWithAuto
                  label="Favorite Location"
                  value={editing.favoriteLocation || ''}
                  onChange={v => up('favoriteLocation', v)}
                  onRandomize={() => up('favoriteLocation', pick(['Modern Scandinavian interiors, forest clearings', 'Tropical beaches, vibrant cafes', 'Cherry blossom gardens, zen interiors, rooftops', 'Savanna landscapes, modern art galleries']))}
                  placeholder="Preferred shooting locations..."
                />
              </CardBody>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader><h2 className="font-semibold text-white">👁️ Profile Preview</h2></CardHeader>
              <CardBody className="space-y-3">
                <div className="w-full h-32 bg-gradient-to-br from-violet-900/40 to-pink-900/40 rounded-lg flex items-center justify-center border border-violet-700/30">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👤</div>
                    <div className="text-white font-semibold text-sm">{editing.name || 'Unnamed Model'}</div>
                    <div className="text-gray-400 text-xs">{editing.ethnicity || 'Ethnicity not set'} · {editing.age}y</div>
                  </div>
                </div>

                {[
                  { label: 'Face', value: editing.facialFeatures },
                  { label: 'Hair', value: editing.hairDetails },
                  { label: 'Body', value: editing.bodyType },
                  { label: 'Skin', value: editing.skinDetails },
                  { label: 'Marks', value: editing.specialMarks },
                  { label: 'Clothing', value: editing.favoriteClothing },
                  { label: 'Location', value: editing.favoriteLocation },
                ].map(item => item.value && (
                  <div key={item.label}>
                    <div className="text-xs text-gray-500 font-medium">{item.label}</div>
                    <div className="text-xs text-gray-300 mt-0.5">{item.value}</div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Button
              variant="outline" size="sm" className="w-full"
              onClick={() => setShowPrompt(!showPrompt)}
            >
              ℹ️ System Prompt for AI
            </Button>
            {showPrompt && (
              <Card>
                <CardBody>
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap">{SYSTEM_PROMPT}</pre>
                  <Button
                    variant="ghost" size="xs" className="mt-2 w-full"
                    onClick={() => navigator.clipboard.writeText(SYSTEM_PROMPT)}
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
          <h1 className="text-2xl font-bold text-white">👤 Model Library</h1>
          <p className="text-gray-400 text-sm">{models.length} model profiles available</p>
        </div>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search models..."
            className="bg-gray-800 border border-gray-700 rounded-lg text-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-violet-500 w-48"
          />
          <Button variant="gradient" onClick={handleNew}>+ New Model</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map(m => (
          <Card key={m.id} hover className="cursor-pointer" onClick={() => handleEdit(m)}>
            <CardBody className="p-3">
              <div className="w-full h-20 bg-gradient-to-br from-violet-900/30 to-pink-900/30 rounded-lg flex items-center justify-center mb-2 border border-violet-700/20">
                <div className="text-2xl">👤</div>
              </div>
              <div className="text-sm font-medium text-white truncate">{m.name}</div>
              <div className="text-xs text-gray-400 truncate">{m.ethnicity}</div>
              <div className="text-xs text-gray-500">{m.age} years</div>
            </CardBody>
            <CardFooter className="p-2 flex gap-1">
              <Button variant="ghost" size="xs" className="flex-1" onClick={e => { e.stopPropagation(); handleEdit(m); }}>✏️ Edit</Button>
              <Button variant="ghost" size="xs" className="text-red-400" onClick={e => { e.stopPropagation(); if (confirm('Delete this model?')) deleteModel(m.id); }}>🗑️</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
