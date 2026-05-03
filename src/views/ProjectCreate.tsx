import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FieldWithAuto } from '../components/ui/Input';
import { Select } from '../components/ui/Input';
import type { PhotoProject, Phase, AIModel, AnchorToken } from '../types';
import { distributePhases, generateProjectName, generateProjectDescription, getDefaultNegativePrompt } from '../data/promptEngine';
import { DEFAULT_PHASES } from '../data/seedData';

const AI_MODELS: { value: AIModel; label: string }[] = [
  { value: 'flux-dev', label: 'FLUX.1 [dev]' },
  { value: 'flux-schnell', label: 'FLUX.1 [schnell]' },
  { value: 'flux-klein-9b', label: 'FLUX.2 Klein 9B (Nunchaku)' },
  { value: 'sdxl', label: 'Stable Diffusion XL (SDXL)' },
  { value: 'sd35', label: 'SD 3.5 Medium' },
  { value: 'midjourney', label: 'Midjourney v7' },
  { value: 'dall-e-3', label: 'DALL-E 3' },
  { value: 'chatgpt-image', label: 'ChatGPT Image (gpt-image-1)' },
  { value: 'nano-banana', label: 'Nano Banana 2' },
  { value: 'ernie', label: 'ERNIE Bot' },
  { value: 'qwen-image', label: 'Qwen-Image' },
  { value: 'z-image', label: 'Z-Image' },
  { value: 'ollama-custom', label: 'Ollama (Local Custom)' },
];

const CONCEPTS_LIST = [
  'Boudoir Elegance', 'Urban Warrior', 'Tropical Reverie', 'Midnight Mystique',
  'Golden Hour Dreams', 'Bohemian Wanderer', 'Minimalist Grace', 'Cultural Tapestry',
  'Power & Feminity', 'Natural Essence', 'Noir Romance', 'Desert Mirage',
  'Forest Nymph', 'Metropolitan Chic', 'Artisan Soul', 'Ocean Whispers',
];

export function ProjectCreate() {
  const { models, clothing, locations, lighting, saveProject, setActiveView, selectedProjectId, projects } = useApp();

  const existingProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  const [form, setForm] = useState<Partial<PhotoProject>>({
    name: '',
    description: '',
    concept: '',
    totalImageCount: 100,
    modelId: '',
    clothingId: '',
    locationId: '',
    lightingId: '',
    targetModel: 'flux-dev',
    status: 'draft',
    phases: DEFAULT_PHASES.map(p => ({ ...p })),
    anchorTokens: [],
    generatedPrompts: [],
    negativePrompt: '',
    tags: [],
  });

  const [saving, setSaving] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);

  useEffect(() => {
    if (existingProject) {
      setForm(existingProject);
    }
  }, [existingProject]);

  useEffect(() => {
    if (form.totalImageCount) {
      const distributed = distributePhases(form.totalImageCount, form.phases || DEFAULT_PHASES.map(p => ({ ...p })));
      setForm(f => ({ ...f, phases: distributed }));
    }
  }, [form.totalImageCount]);

  const handleAuto = () => {
    setAutoGenerating(true);
    setTimeout(() => {
      const randomModel = models[Math.floor(Math.random() * models.length)];
      const randomCloth = clothing[Math.floor(Math.random() * clothing.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomLighting = lighting[Math.floor(Math.random() * lighting.length)];
      const concept = CONCEPTS_LIST[Math.floor(Math.random() * CONCEPTS_LIST.length)];
      const name = generateProjectName();
      const count = [50, 75, 100, 120, 150, 200][Math.floor(Math.random() * 6)];

      const phases = distributePhases(count, DEFAULT_PHASES.map(p => ({ ...p })));

      const anchors: AnchorToken[] = [
        { id: uuidv4(), category: 'Model', key: 'model', value: randomModel?.name || '', locked: true },
        { id: uuidv4(), category: 'Location', key: 'location', value: randomLocation?.name || '', locked: true },
        { id: uuidv4(), category: 'Lighting', key: 'lighting', value: randomLighting?.name || '', locked: true },
        { id: uuidv4(), category: 'Clothing', key: 'outfit', value: randomCloth?.name || '', locked: true },
        { id: uuidv4(), category: 'Style', key: 'quality', value: 'photorealistic, ultra-detailed, professional photography', locked: true },
        { id: uuidv4(), category: 'Technical', key: 'consistency', value: 'same session, same day, same setting throughout', locked: true },
      ];

      setForm(f => ({
        ...f,
        name,
        concept,
        totalImageCount: count,
        modelId: randomModel?.id || '',
        clothingId: randomCloth?.id || '',
        locationId: randomLocation?.id || '',
        lightingId: randomLighting?.id || '',
        phases,
        anchorTokens: anchors,
        description: generateProjectDescription(concept, randomLocation?.name || 'studio', randomModel?.name || 'model'),
        negativePrompt: getDefaultNegativePrompt(f.targetModel as AIModel || 'flux-dev'),
      }));
      setAutoGenerating(false);
    }, 1500);
  };

  const handleSave = async () => {
    if (!form.name) return alert('Please provide a project name');
    setSaving(true);
    const project: PhotoProject = {
      id: existingProject?.id || uuidv4(),
      name: form.name || '',
      description: form.description || '',
      concept: form.concept || '',
      totalImageCount: form.totalImageCount || 100,
      modelId: form.modelId || '',
      clothingId: form.clothingId || '',
      locationId: form.locationId || '',
      lightingId: form.lightingId || '',
      anchorTokens: form.anchorTokens || [],
      phases: form.phases || DEFAULT_PHASES.map(p => ({ ...p })),
      targetModel: form.targetModel as AIModel || 'flux-dev',
      negativePrompt: form.negativePrompt || getDefaultNegativePrompt(form.targetModel as AIModel || 'flux-dev'),
      generatedPrompts: existingProject?.generatedPrompts || [],
      status: form.status as any || 'draft',
      tags: form.tags || [],
      createdAt: existingProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveProject(project);
    setSaving(false);
    setActiveView('dashboard');
  };

  const totalPhaseCount = (form.phases || []).reduce((acc, p) => acc + (p.count || 0), 0);
  const selectedModel = models.find(m => m.id === form.modelId);
  const selectedCloth = clothing.find(c => c.id === form.clothingId);
  const selectedLocation = locations.find(l => l.id === form.locationId);
  const selectedLighting = lighting.find(l => l.id === form.lightingId);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{existingProject ? 'Edit Project' : 'Create New Project'}</h1>
          <p className="text-gray-400 text-sm mt-1">Configure your AI photoshoot session</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setActiveView('dashboard')}>← Back</Button>
          <Button variant="gradient" loading={autoGenerating} onClick={handleAuto}>
            ⚡ Auto Generate All
          </Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>
            💾 Save Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Config */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader><h2 className="font-semibold text-white">📋 Project Info</h2></CardHeader>
            <CardBody className="space-y-4">
              <FieldWithAuto
                label="Project Name"
                value={form.name || ''}
                onChange={v => setForm(f => ({ ...f, name: v }))}
                onRandomize={() => setForm(f => ({ ...f, name: generateProjectName() }))}
                placeholder="e.g. Velvet Nocturne"
              />
              <FieldWithAuto
                label="Concept / Theme"
                value={form.concept || ''}
                onChange={v => setForm(f => ({ ...f, concept: v }))}
                onRandomize={() => setForm(f => ({ ...f, concept: CONCEPTS_LIST[Math.floor(Math.random() * CONCEPTS_LIST.length)] }))}
                placeholder="e.g. Boudoir Elegance, Urban Warrior..."
              />
              <FieldWithAuto
                label="Description"
                value={form.description || ''}
                onChange={v => setForm(f => ({ ...f, description: v }))}
                onRandomize={() => setForm(f => ({ ...f, description: generateProjectDescription(form.concept || 'fashion', selectedLocation?.name || 'studio', selectedModel?.name || 'model') }))}
                multiline
                rows={3}
                placeholder="Describe the vision for this photoshoot..."
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Total Image Count</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min={50} max={500} step={10}
                      value={form.totalImageCount || 100}
                      onChange={e => setForm(f => ({ ...f, totalImageCount: Number(e.target.value) }))}
                      className="flex-1 accent-violet-500"
                    />
                    <span className="text-white font-bold w-12 text-right">{form.totalImageCount}</span>
                  </div>
                </div>
                <Select
                  label="Status"
                  value={form.status || 'draft'}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                  options={[
                    { value: 'draft', label: '📝 Draft' },
                    { value: 'active', label: '⚡ Active' },
                    { value: 'complete', label: '✅ Complete' },
                  ]}
                />
              </div>
            </CardBody>
          </Card>

          {/* Model Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">👤 Model Profile</h2>
                <Button variant="ghost" size="xs" onClick={() => setActiveView('model-builder')}>+ Create New</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {models.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setForm(f => ({ ...f, modelId: m.id }))}
                    className={`p-2 rounded-lg border text-left transition-all ${form.modelId === m.id ? 'border-violet-500 bg-violet-500/20' : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'}`}
                  >
                    <div className="text-xs font-medium text-white truncate">{m.name}</div>
                    <div className="text-xs text-gray-400 truncate">{m.ethnicity}</div>
                    <div className="text-xs text-gray-500 truncate">{m.age}y</div>
                  </button>
                ))}
              </div>
              {selectedModel && (
                <div className="mt-3 p-3 bg-violet-900/20 rounded-lg border border-violet-700/30 text-xs text-gray-300">
                  <strong className="text-violet-400">Selected:</strong> {selectedModel.name} — {selectedModel.ethnicity}, {selectedModel.age}y<br />
                  {selectedModel.facialFeatures}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Clothing Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">👗 Clothing & Accessories</h2>
                <Button variant="ghost" size="xs" onClick={() => setActiveView('cloth-designer')}>+ Create New</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {clothing.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setForm(f => ({ ...f, clothingId: c.id }))}
                    className={`p-2 rounded-lg border text-left transition-all ${form.clothingId === c.id ? 'border-pink-500 bg-pink-500/20' : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'}`}
                  >
                    <div className="text-xs font-medium text-white truncate">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.category} · {c.color}</div>
                  </button>
                ))}
              </div>
              {selectedCloth && (
                <div className="mt-3 p-3 bg-pink-900/20 rounded-lg border border-pink-700/30 text-xs text-gray-300">
                  <strong className="text-pink-400">States:</strong> {selectedCloth.states.map(s => s.label).join(' → ')}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Location & Lighting */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white text-sm">📍 Location</h2>
                  <Button variant="ghost" size="xs" onClick={() => setActiveView('location-creator')}>+</Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {locations.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setForm(f => ({ ...f, locationId: l.id }))}
                      className={`w-full p-2 rounded-lg border text-left text-xs transition-all ${form.locationId === l.id ? 'border-emerald-500 bg-emerald-500/20' : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'}`}
                    >
                      <div className="font-medium text-white truncate">{l.name}</div>
                      <div className="text-gray-400">{l.type} · {l.category}</div>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white text-sm">💡 Lighting</h2>
                  <Button variant="ghost" size="xs" onClick={() => setActiveView('lighting-manager')}>+</Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {lighting.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setForm(f => ({ ...f, lightingId: l.id }))}
                      className={`w-full p-2 rounded-lg border text-left text-xs transition-all ${form.lightingId === l.id ? 'border-amber-500 bg-amber-500/20' : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'}`}
                    >
                      <div className="font-medium text-white truncate">{l.name}</div>
                      <div className="text-gray-400">{l.type}</div>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* AI Target Model */}
          <Card>
            <CardHeader><h2 className="font-semibold text-white">🤖 Target AI Image Model</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AI_MODELS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setForm(f => ({ ...f, targetModel: m.value, negativePrompt: getDefaultNegativePrompt(m.value) }))}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${form.targetModel === m.value ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-gray-700 hover:border-gray-600 bg-gray-900/30 text-gray-300'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-1">
                <label className="text-sm font-medium text-gray-300">Negative Prompt</label>
                <textarea
                  value={form.negativePrompt || ''}
                  onChange={e => setForm(f => ({ ...f, negativePrompt: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg text-gray-300 text-xs px-3 py-2 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right: Phase System & Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader><h2 className="font-semibold text-white">🎬 Phase System</h2></CardHeader>
            <CardBody className="space-y-3">
              <div className="text-xs text-gray-400 mb-2">
                Total: {totalPhaseCount}/{form.totalImageCount} images
              </div>
              {(form.phases || DEFAULT_PHASES).map((phase, idx) => (
                <div key={phase.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{phase.icon}</span>
                    <span className="text-xs text-gray-300 flex-1">{phase.name}</span>
                    <input
                      type="number" min={0} max={form.totalImageCount || 500}
                      value={phase.count}
                      onChange={e => {
                        const newPhases = [...(form.phases || DEFAULT_PHASES)];
                        newPhases[idx] = { ...newPhases[idx], count: Number(e.target.value) };
                        setForm(f => ({ ...f, phases: newPhases }));
                      }}
                      className="w-16 bg-gray-900 border border-gray-700 rounded text-white text-xs px-2 py-1 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${form.totalImageCount ? Math.min(100, (phase.count / form.totalImageCount) * 100) : 0}%`,
                        backgroundColor: phase.color
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{phase.description}</p>
                </div>
              ))}
              <Button
                variant="ghost" size="xs" className="w-full mt-2"
                onClick={() => {
                  const distributed = distributePhases(form.totalImageCount || 100, form.phases || DEFAULT_PHASES.map(p => ({ ...p })));
                  setForm(f => ({ ...f, phases: distributed }));
                }}
              >
                🔄 Auto Redistribute
              </Button>
            </CardBody>
          </Card>

          {/* Anchor Tokens */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white text-sm">⚓ Anchor Tokens</h2>
                <button
                  onClick={() => {
                    const anchors: AnchorToken[] = [
                      { id: uuidv4(), category: 'Model', key: 'model', value: selectedModel?.name || '', locked: true },
                      { id: uuidv4(), category: 'Location', key: 'location', value: selectedLocation?.name || '', locked: true },
                      { id: uuidv4(), category: 'Lighting', key: 'lighting', value: selectedLighting?.name || '', locked: true },
                      { id: uuidv4(), category: 'Clothing', key: 'outfit', value: selectedCloth?.name || '', locked: true },
                      { id: uuidv4(), category: 'Style', key: 'quality', value: 'photorealistic, ultra-detailed', locked: true },
                      { id: uuidv4(), category: 'Hair', key: 'hair', value: selectedModel?.hairDetails || '', locked: true },
                      { id: uuidv4(), category: 'Skin', key: 'skin', value: selectedModel?.skinDetails || '', locked: true },
                    ].filter(a => a.value);
                    setForm(f => ({ ...f, anchorTokens: anchors }));
                  }}
                  className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
                >🔄 Rebuild</button>
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              {(form.anchorTokens || []).map((token, i) => (
                <div key={token.id} className="flex items-center gap-2 text-xs">
                  <span className="text-yellow-400">⚓</span>
                  <span className="text-gray-400 w-20 flex-shrink-0">{token.category}</span>
                  <span className="text-gray-300 flex-1 truncate">{token.value}</span>
                  <button
                    onClick={() => {
                      const tokens = [...(form.anchorTokens || [])];
                      tokens.splice(i, 1);
                      setForm(f => ({ ...f, anchorTokens: tokens }));
                    }}
                    className="text-red-400 hover:text-red-300 flex-shrink-0"
                  >✕</button>
                </div>
              ))}
              {(form.anchorTokens || []).length === 0 && (
                <p className="text-xs text-gray-500">No anchors yet. Select model, location, lighting, and clothing first, then click Rebuild.</p>
              )}
            </CardBody>
          </Card>

          {/* Preview Summary */}
          <Card>
            <CardHeader><h2 className="font-semibold text-white text-sm">👁️ Session Preview</h2></CardHeader>
            <CardBody className="space-y-2 text-xs">
              {[
                { label: 'Model', value: selectedModel?.name, icon: '👤' },
                { label: 'Clothing', value: selectedCloth?.name, icon: '👗' },
                { label: 'Location', value: selectedLocation?.name, icon: '📍' },
                { label: 'Lighting', value: selectedLighting?.name, icon: '💡' },
                { label: 'AI Model', value: form.targetModel?.replace(/-/g, ' '), icon: '🤖' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="text-gray-400 w-16">{item.label}:</span>
                  <span className={item.value ? 'text-white' : 'text-gray-600 italic'}>{item.value || 'Not set'}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
