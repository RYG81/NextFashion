import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { posesDB, cameraSpecsDB, lightingDB } from '../data/database';
import type { PoseVocab, CameraSpec } from '../types';

type LibraryTab = 'poses' | 'camera-angles' | 'shot-types' | 'lenses' | 'framing' | 'technical' | 'lighting' | 'expressions';

const TABS: { id: LibraryTab; label: string; icon: string }[] = [
  { id: 'poses', label: 'Poses', icon: '🧘' },
  { id: 'camera-angles', label: 'Camera Angles', icon: '📐' },
  { id: 'shot-types', label: 'Shot Types', icon: '📷' },
  { id: 'lenses', label: 'Lenses', icon: '🔭' },
  { id: 'framing', label: 'Framing', icon: '🖼️' },
  { id: 'technical', label: 'Technical', icon: '⚙️' },
  { id: 'lighting', label: 'Lighting', icon: '💡' },
  { id: 'expressions', label: 'Expressions', icon: '😊' },
];

const EXPRESSION_LIBRARY = [
  { name: 'Confident direct gaze', tags: ['confident', 'direct'], phase: 'arrival' },
  { name: 'Serene soft smile', tags: ['serene', 'gentle'], phase: 'arrival' },
  { name: 'Intense smoldering look', tags: ['intense', 'smoldering'], phase: 'peak' },
  { name: 'Playful mischievous smirk', tags: ['playful', 'mischievous'], phase: 'playful' },
  { name: 'Candid genuine laugh', tags: ['candid', 'joy'], phase: 'playful' },
  { name: 'Dreamy introspective gaze', tags: ['dreamy', 'introspective'], phase: 'winddown' },
  { name: 'Vulnerable tender look', tags: ['vulnerable', 'tender'], phase: 'intimate' },
  { name: 'Passionate expressive eyes', tags: ['passionate', 'expressive'], phase: 'peak' },
  { name: 'Cool emotionless stare', tags: ['editorial', 'cool'], phase: 'arrival' },
  { name: 'Warm welcoming expression', tags: ['warm', 'welcoming'], phase: 'arrival' },
  { name: 'Mysterious half-smile', tags: ['mysterious', 'subtle'], phase: 'build' },
  { name: 'Eyes closed peaceful', tags: ['peaceful', 'eyes-closed'], phase: 'intimate' },
  { name: 'Over-shoulder glance with lips parted', tags: ['over-shoulder', 'sensual'], phase: 'build' },
  { name: 'Head thrown back laughing', tags: ['joyful', 'head-back'], phase: 'playful' },
  { name: 'Biting lower lip', tags: ['playful', 'flirty'], phase: 'build' },
  { name: 'Gazing into distance thoughtfully', tags: ['thoughtful', 'distant'], phase: 'closing' },
  { name: 'Looking down with lashes lowered', tags: ['shy', 'coy', 'soft'], phase: 'intimate' },
  { name: 'Wide bright eyes full of wonder', tags: ['wonder', 'bright', 'open'], phase: 'playful' },
  { name: 'Parted lips, breath visible', tags: ['sensual', 'breath'], phase: 'peak' },
  { name: 'Knowing look, subtle confidence', tags: ['knowing', 'confident'], phase: 'closing' },
];

const AI_PROMPT_TEMPLATES: Record<LibraryTab, string> = {
  poses: `Generate a list of 20 unique, detailed photography poses for fashion/boudoir photography. Each pose should be described in 10-15 words that clearly communicate body position, limb placement, and direction of gaze. Include variety: standing, sitting, lying, leaning poses. Format: one pose per line.`,
  'camera-angles': `Generate 15 camera angle descriptions for professional fashion photography. Include: angle name, description of how it looks, and when to use it for maximum impact. Format: Name: [angle] | Description: [desc] | Best for: [use case]`,
  'shot-types': `Generate 15 shot type descriptions for fashion photography. From extreme close-up to wide establishing shots. Include what body parts are visible, the emotional impact, and typical use cases. Format: Name: [shot] | Shows: [what's visible] | Impact: [emotion/effect]`,
  lenses: `Generate a list of 12 lens specifications for fashion photography. Include focal length, f-stop range, what it's best for, and how it renders the subject (compression, distortion, bokeh quality). Format: [lens] | Best for: [use] | Effect: [rendering]`,
  framing: `Generate 15 unique composition and framing techniques for fashion photography. Include rule-based and experimental compositions. Explain each technique and when it creates the most impact.`,
  technical: `Generate a list of 20 technical photography specifications relevant to AI prompt writing. Include: depth of field, exposure style, color grading terms, film simulation names, and quality descriptors. Format: Term: [term] | Description: [what it means in a prompt]`,
  lighting: `Generate 12 unique lighting setups for fashion and boudoir photography. Include: setup name, light direction, quality, color temperature, mood created, and modifiers used. Format: Name: [setup] | Direction: [dir] | Quality: [soft/hard] | Mood: [mood]`,
  expressions: `Generate 25 facial expression descriptions for AI image generation in fashion/boudoir context. Be specific about: eye expression, lip position, face tension, emotional state. Format: one expression per line, 8-12 words each.`,
};

export function Library() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('poses');
  const [poses, setPoses] = useState<PoseVocab[]>([]);
  const [cameraSpecs, setCameraSpecs] = useState<CameraSpec[]>([]);
  const [search, setSearch] = useState('');
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  useEffect(() => {
    posesDB.getAll().then(setPoses);
    cameraSpecsDB.getAll().then(setCameraSpecs);
  }, []);

  const getTabData = () => {
    switch (activeTab) {
      case 'poses': return poses;
      case 'camera-angles': return cameraSpecs.filter(c => c.type === 'angle');
      case 'shot-types': return cameraSpecs.filter(c => c.type === 'shot');
      case 'lenses': return cameraSpecs.filter(c => c.type === 'lens');
      case 'framing': return cameraSpecs.filter(c => c.type === 'framing');
      case 'technical': return cameraSpecs.filter(c => c.type === 'technical');
      case 'expressions': return EXPRESSION_LIBRARY;
      case 'lighting': return [];
      default: return [];
    }
  };

  const filtered = getTabData().filter((item: any) => {
    const text = item.pose || item.name || item.description || '';
    return !search || text.toLowerCase().includes(search.toLowerCase());
  });

  const handleBulkAdd = async () => {
    const lines = bulkInput.split('\n').filter(l => l.trim());
    if (activeTab === 'poses') {
      for (const line of lines) {
        const pose: PoseVocab = {
          id: uuidv4(),
          pose: line.trim(),
          category: 'standing',
          tags: [],
        };
        await posesDB.put(pose);
      }
      setPoses(await posesDB.getAll());
    } else {
      const type = activeTab === 'camera-angles' ? 'angle' : activeTab === 'shot-types' ? 'shot' : activeTab === 'lenses' ? 'lens' : activeTab === 'framing' ? 'framing' : 'technical';
      for (const line of lines) {
        const spec: CameraSpec = {
          id: uuidv4(),
          type: type as any,
          name: line.split('|')[0]?.trim() || line.trim(),
          description: line.split('|')[1]?.trim() || '',
          tags: [],
        };
        await cameraSpecsDB.put(spec);
      }
      setCameraSpecs(await cameraSpecsDB.getAll());
    }
    setBulkInput('');
    setShowBulk(false);
  };

  const data = getTabData();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">📚 Vocabulary Library</h1>
          <p className="text-gray-400 text-sm mt-1">Reference database for prompt building</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowAIPrompt(!showAIPrompt)}>
            🤖 AI Prompt
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowBulk(!showBulk)}>
            📥 Bulk Add
          </Button>
        </div>
      </div>

      {/* AI Prompt Panel */}
      {showAIPrompt && (
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-violet-400 mb-2">🤖 AI Generation Prompt for {TABS.find(t => t.id === activeTab)?.label}</h3>
            <pre className="text-xs text-gray-400 whitespace-pre-wrap bg-gray-900/50 p-3 rounded-lg">{AI_PROMPT_TEMPLATES[activeTab]}</pre>
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" size="xs" onClick={() => navigator.clipboard.writeText(AI_PROMPT_TEMPLATES[activeTab])}>📋 Copy Prompt</Button>
              <span className="text-xs text-gray-500 self-center">Use with any AI to generate data, then bulk add below</span>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Bulk Add */}
      {showBulk && (
        <Card>
          <CardBody className="space-y-3">
            <h3 className="text-sm font-medium text-white">📥 Bulk Add to {TABS.find(t => t.id === activeTab)?.label}</h3>
            <p className="text-xs text-gray-400">Paste AI-generated data. One entry per line. For camera specs: Name | Description format.</p>
            <textarea
              value={bulkInput}
              onChange={e => setBulkInput(e.target.value)}
              rows={8}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-300 text-xs px-3 py-2 focus:outline-none focus:border-violet-500 resize-y font-mono"
              placeholder="Paste your bulk data here, one item per line..."
            />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleBulkAdd} disabled={!bulkInput.trim()}>
                Import {bulkInput.split('\n').filter(l => l.trim()).length} Items
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setBulkInput(''); setShowBulk(false); }}>Cancel</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${TABS.find(t => t.id === activeTab)?.label}...`}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
        />
        <span className="text-xs text-gray-500">{filtered.length} / {data.length} items</span>
      </div>

      {/* Content Grid */}
      {activeTab === 'poses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(filtered as PoseVocab[]).map(pose => (
            <Card key={pose.id} className="group">
              <CardBody className="p-3 flex items-start gap-3">
                <div className="text-lg flex-shrink-0">🧘</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">{pose.pose}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">{pose.category}</span>
                    {pose.phaseHint && <span className="text-xs bg-violet-900/30 text-violet-400 px-1.5 py-0.5 rounded">{pose.phaseHint}</span>}
                    {pose.tags.map(tag => <span key={tag} className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>)}
                  </div>
                </div>
                <Button
                  variant="ghost" size="xs" className="opacity-0 group-hover:opacity-100"
                  onClick={() => navigator.clipboard.writeText(pose.pose)}
                >📋</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {(activeTab !== 'poses' && activeTab !== 'expressions' && activeTab !== 'lighting') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(filtered as CameraSpec[]).map(spec => (
            <Card key={spec.id} className="group">
              <CardBody className="p-3 flex items-start gap-3">
                <div className="text-lg">{TABS.find(t => t.id === activeTab)?.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{spec.name}</div>
                  <p className="text-xs text-gray-400 mt-0.5">{spec.description}</p>
                  <div className="flex gap-1 mt-1">
                    {spec.tags.map(tag => <span key={tag} className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>)}
                  </div>
                </div>
                <Button
                  variant="ghost" size="xs" className="opacity-0 group-hover:opacity-100"
                  onClick={() => navigator.clipboard.writeText(`${spec.name}: ${spec.description}`)}
                >📋</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'expressions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {EXPRESSION_LIBRARY.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase())).map((expr, i) => (
            <Card key={i} className="group">
              <CardBody className="p-3 flex items-center gap-3">
                <span className="text-xl">😊</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{expr.name}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className="text-xs bg-violet-900/30 text-violet-400 px-1.5 py-0.5 rounded">{expr.phase}</span>
                    {expr.tags.map(tag => <span key={tag} className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>)}
                  </div>
                </div>
                <Button
                  variant="ghost" size="xs" className="opacity-0 group-hover:opacity-100"
                  onClick={() => navigator.clipboard.writeText(expr.name)}
                >📋</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
