import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { GeneratedPrompt, PhaseId } from '../types';
import { generatePrompts } from '../data/promptEngine';
import { posesDB } from '../data/database';

const PHASE_COLORS: Record<PhaseId, string> = {
  arrival: '#6366f1', build: '#8b5cf6', peak: '#ec4899',
  intimate: '#f43f5e', playful: '#f59e0b', winddown: '#10b981', closing: '#3b82f6',
};

export function PhotosetCreation() {
  const { projects, models, clothing, locations, lighting, saveProject, selectedProjectId, setActiveView } = useApp();
  const project = projects.find(p => p.id === selectedProjectId) || projects[0];

  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [generating, setGenerating] = useState(false);
  const [filterPhase, setFilterPhase] = useState<PhaseId | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showNegPrompt, setShowNegPrompt] = useState(false);

  useEffect(() => {
    if (project?.generatedPrompts) {
      setPrompts(project.generatedPrompts);
    }
  }, [project]);

  const handleGenerate = async () => {
    if (!project) return alert('Please select or create a project first');
    const model = models.find(m => m.id === project.modelId);
    const cloth = clothing.find(c => c.id === project.clothingId);
    const location = locations.find(l => l.id === project.locationId);
    const light = lighting.find(l => l.id === project.lightingId);

    if (!model || !cloth || !location || !light) {
      return alert('Project is missing model, clothing, location, or lighting. Please complete project setup first.');
    }

    setGenerating(true);
    try {
      const allPoses = await posesDB.getAll();
      const poseTexts = allPoses.map(p => p.pose);
      const generated = generatePrompts(project, model, cloth, location, light, poseTexts);
      setPrompts(generated);
      const updated = { ...project, generatedPrompts: generated, status: 'active' as const, updatedAt: new Date().toISOString() };
      await saveProject(updated);
    } catch (e) {
      console.error(e);
      alert('Generation failed. Check project config.');
    }
    setGenerating(false);
  };

  const handleEditSave = async (id: string) => {
    const updated = prompts.map(p => p.id === id ? { ...p, promptText: editText, edited: true } : p);
    setPrompts(updated);
    setEditingId(null);
    if (project) {
      await saveProject({ ...project, generatedPrompts: updated, updatedAt: new Date().toISOString() });
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleExport = (format: 'csv' | 'json' | 'txt') => {
    let content = '';
    let filename = `prompts-${new Date().toISOString().split('T')[0]}`;

    if (format === 'json') {
      content = JSON.stringify(prompts, null, 2);
      filename += '.json';
    } else if (format === 'csv') {
      const headers = 'Index,Phase,Prompt,Negative Prompt,Pose,Camera,Expression,Clothing State,Location Area\n';
      const rows = prompts.map(p =>
        `${p.index},"${p.phaseName}","${p.promptText.replace(/"/g, '""')}","${(p.negativePrompt || '').replace(/"/g, '""')}","${p.pose || ''}","${p.cameraAngle || ''}","${p.expression || ''}","${p.clothingState || ''}","${p.locationArea || ''}"`
      ).join('\n');
      content = headers + rows;
      filename += '.csv';
    } else {
      content = prompts.map(p => p.promptText).join('\n\n');
      filename += '.txt';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    return prompts.filter(p => {
      const matchPhase = filterPhase === 'all' || p.phaseId === filterPhase;
      const matchSearch = !searchTerm || p.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pose?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchPhase && matchSearch;
    });
  }, [prompts, filterPhase, searchTerm]);

  const phaseGroups = useMemo(() => {
    const groups: Record<string, GeneratedPrompt[]> = {};
    filtered.forEach(p => {
      if (!groups[p.phaseId]) groups[p.phaseId] = [];
      groups[p.phaseId].push(p);
    });
    return groups;
  }, [filtered]);

  const phases = project?.phases || [];

  if (!project) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-white mb-2">No Project Selected</h2>
          <p className="text-gray-400 mb-4">Create or select a project to start building your prompt sequence</p>
          <Button variant="gradient" onClick={() => setActiveView('project-create')}>Create Project</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">📝 Prompt Studio</h1>
          <p className="text-gray-400 text-sm mt-1">{project.name} · {project.totalImageCount} images · {prompts.length} prompts generated</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {prompts.length > 0 && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowNegPrompt(!showNegPrompt)}>
                🚫 Negative Prompt
              </Button>
              <div className="flex gap-1">
                <Button variant="secondary" size="sm" onClick={() => handleExport('txt')}>📄 TXT</Button>
                <Button variant="secondary" size="sm" onClick={() => handleExport('csv')}>📊 CSV</Button>
                <Button variant="secondary" size="sm" onClick={() => handleExport('json')}>🔧 JSON</Button>
              </div>
            </>
          )}
          <Button
            variant="gradient" size="sm"
            loading={generating}
            onClick={handleGenerate}
          >
            {prompts.length > 0 ? '🔄 Regenerate All' : '⚡ Generate Prompts'}
          </Button>
        </div>
      </div>

      {/* Negative Prompt Panel */}
      {showNegPrompt && project.negativePrompt && (
        <Card>
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-red-400">🚫 Negative Prompt</h3>
              <Button variant="ghost" size="xs" onClick={() => handleCopyPrompt(project.negativePrompt)}>📋 Copy</Button>
            </div>
            <p className="text-xs text-gray-400 font-mono">{project.negativePrompt}</p>
          </CardBody>
        </Card>
      )}

      {/* Phase overview bar */}
      {phases.length > 0 && (
        <Card>
          <CardBody className="py-2">
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setFilterPhase('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterPhase === 'all' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                All ({prompts.length})
              </button>
              {phases.map(phase => (
                <button
                  key={phase.id}
                  onClick={() => setFilterPhase(phase.id as PhaseId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterPhase === phase.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  style={filterPhase === phase.id ? { backgroundColor: phase.color } : {}}
                >
                  {phase.icon} {phase.name} ({prompts.filter(p => p.phaseId === phase.id).length})
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Search */}
      <div className="flex gap-3">
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search prompts by keyword, pose, expression..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
        />
        {searchTerm && <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>✕ Clear</Button>}
      </div>

      {/* Empty State */}
      {prompts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate Prompts</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Generate {project.totalImageCount} carefully crafted prompts across 7 phases for your photoshoot "{project.name}"
          </p>
          <Button variant="gradient" size="lg" loading={generating} onClick={handleGenerate}>
            ⚡ Generate {project.totalImageCount} Prompts
          </Button>
        </div>
      )}

      {/* Prompts List */}
      {filtered.length > 0 && (
        <div className="space-y-6">
          {filterPhase === 'all' ? (
            Object.entries(phaseGroups).map(([phaseId, phasePrompts]) => (
              <PhaseSection
                key={phaseId}
                phaseId={phaseId as PhaseId}
                phasePrompts={phasePrompts}
                phases={phases}
                editingId={editingId}
                editText={editText}
                setEditingId={setEditingId}
                setEditText={setEditText}
                onEditSave={handleEditSave}
                onCopy={handleCopyPrompt}
                onSendToImageGen={(prompt) => {
                  // Store prompt for image gen
                  sessionStorage.setItem('imageGenPrompt', prompt);
                  setActiveView('image-generation');
                }}
              />
            ))
          ) : (
            <PhaseSection
              phaseId={filterPhase}
              phasePrompts={filtered}
              phases={phases}
              editingId={editingId}
              editText={editText}
              setEditingId={setEditingId}
              setEditText={setEditText}
              onEditSave={handleEditSave}
              onCopy={handleCopyPrompt}
              onSendToImageGen={(prompt) => {
                sessionStorage.setItem('imageGenPrompt', prompt);
                setActiveView('image-generation');
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function PhaseSection({ phaseId, phasePrompts, phases, editingId, editText, setEditingId, setEditText, onEditSave, onCopy, onSendToImageGen }: {
  phaseId: PhaseId;
  phasePrompts: GeneratedPrompt[];
  phases: any[];
  editingId: string | null;
  editText: string;
  setEditingId: (id: string | null) => void;
  setEditText: (t: string) => void;
  onEditSave: (id: string) => void;
  onCopy: (t: string) => void;
  onSendToImageGen: (t: string) => void;
}) {
  const phase = phases.find(p => p.id === phaseId);
  const color = PHASE_COLORS[phaseId] || '#6366f1';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <div className="text-xl">{phase?.icon || '📸'}</div>
        <h3 className="font-semibold text-white">{phase?.name || phaseId}</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-current to-transparent opacity-20" style={{ color }} />
        <span className="text-xs text-gray-400">{phasePrompts.length} prompts</span>
      </div>
      <p className="text-xs text-gray-500 px-1 mb-2">{phase?.description}</p>

      <div className="space-y-2">
        {phasePrompts.map(prompt => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            color={color}
            editingId={editingId}
            editText={editText}
            setEditingId={setEditingId}
            setEditText={setEditText}
            onEditSave={onEditSave}
            onCopy={onCopy}
            onSendToImageGen={onSendToImageGen}
          />
        ))}
      </div>
    </div>
  );
}

function PromptCard({ prompt, color, editingId, editText, setEditingId, setEditText, onEditSave, onCopy, onSendToImageGen }: {
  prompt: GeneratedPrompt;
  color: string;
  editingId: string | null;
  editText: string;
  setEditingId: (id: string | null) => void;
  setEditText: (t: string) => void;
  onEditSave: (id: string) => void;
  onCopy: (t: string) => void;
  onSendToImageGen: (t: string) => void;
}) {
  const isEditing = editingId === prompt.id;

  return (
    <Card className="group">
      <CardBody className="p-3">
        <div className="flex items-start gap-3">
          {/* Number badge */}
          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: color + '33', border: `1px solid ${color}50` }}
          >
            <span style={{ color }}>{prompt.index}</span>
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            {/* Metadata tags */}
            <div className="flex flex-wrap gap-1">
              {prompt.pose && <span className="text-xs bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded">🧘 {prompt.pose.slice(0, 40)}...</span>}
              {prompt.shotType && <span className="text-xs bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded">📷 {prompt.shotType}</span>}
              {prompt.expression && <span className="text-xs bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded">😊 {prompt.expression.slice(0, 30)}</span>}
              {prompt.clothingState && <span className="text-xs bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded">👗 {prompt.clothingState}</span>}
              {prompt.locationArea && <span className="text-xs bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded">📍 {prompt.locationArea}</span>}
              {prompt.edited && <span className="text-xs bg-amber-900/30 text-amber-400 px-1.5 py-0.5 rounded border border-amber-700/30">✏️ edited</span>}
              {prompt.seed && <span className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded font-mono">seed: {prompt.seed}</span>}
            </div>

            {/* Prompt text */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-900 border border-violet-500 rounded-lg text-gray-200 text-xs px-3 py-2 focus:outline-none resize-y font-mono"
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="xs" onClick={() => onEditSave(prompt.id)}>💾 Save</Button>
                  <Button variant="ghost" size="xs" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-300 leading-relaxed font-mono">{prompt.promptText}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost" size="xs"
              onClick={() => { setEditingId(prompt.id); setEditText(prompt.promptText); }}
              title="Edit"
            >✏️</Button>
            <Button variant="ghost" size="xs" onClick={() => onCopy(prompt.promptText)} title="Copy">📋</Button>
            <Button variant="ghost" size="xs" onClick={() => onSendToImageGen(prompt.promptText)} title="Send to Image Gen">🎨</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
