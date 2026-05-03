import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { PhotoProject } from '../types';

export function Dashboard() {
  const { projects, setActiveView, setSelectedProjectId, deleteProject, saveProject } = useApp();
  const importRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = JSON.stringify(projects, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nextfashion-projects-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const imported = JSON.parse(text) as PhotoProject[];
      for (const p of imported) {
        await saveProject(p);
      }
      alert(`✅ Imported ${imported.length} projects`);
    } catch {
      alert('❌ Invalid file format');
    }
    e.target.value = '';
  };

  const statusColors = {
    draft: 'bg-gray-700 text-gray-300',
    active: 'bg-violet-700/50 text-violet-300',
    complete: 'bg-emerald-700/50 text-emerald-300',
  };

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    complete: projects.filter(p => p.status === 'complete').length,
    totalPrompts: projects.reduce((acc, p) => acc + (p.generatedPrompts?.length || 0), 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your AI photoshoot projects and prompt collections</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={importRef} className="hidden" accept=".json" onChange={handleImport} />
          <Button variant="ghost" size="sm" onClick={() => importRef.current?.click()}>
            📥 Import
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport} disabled={projects.length === 0}>
            📤 Export All
          </Button>
          <Button variant="gradient" size="sm" onClick={() => setActiveView('project-create')}>
            ➕ New Project
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: stats.total, icon: '📁', color: 'violet' },
          { label: 'Active', value: stats.active, icon: '⚡', color: 'blue' },
          { label: 'Complete', value: stats.complete, icon: '✅', color: 'green' },
          { label: 'Prompts Generated', value: stats.totalPrompts, icon: '📝', color: 'pink' },
        ].map(stat => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first AI photoshoot project to get started</p>
          <Button variant="gradient" onClick={() => setActiveView('project-create')}>
            ➕ Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => {
                setSelectedProjectId(project.id);
                setActiveView('photoset-creation');
              }}
              onDelete={() => {
                if (confirm(`Delete "${project.name}"?`)) deleteProject(project.id);
              }}
              onEdit={() => {
                setSelectedProjectId(project.id);
                setActiveView('project-create');
              }}
              statusColors={statusColors}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onOpen, onDelete, onEdit, statusColors }: {
  project: PhotoProject;
  onOpen: () => void;
  onDelete: () => void;
  onEdit: () => void;
  statusColors: Record<string, string>;
}) {
  const promptCount = project.generatedPrompts?.length || 0;
  const status = project.status || 'draft';

  return (
    <Card hover glow className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{project.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{project.concept}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </CardHeader>
      <CardBody className="flex-1 space-y-3">
        <p className="text-xs text-gray-400 line-clamp-2">{project.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-gray-500">Images</div>
            <div className="text-white font-semibold">{project.totalImageCount}</div>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-gray-500">Prompts</div>
            <div className="text-white font-semibold">{promptCount}</div>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-gray-500">Phases</div>
            <div className="text-white font-semibold">{project.phases?.length || 7}</div>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-gray-500">AI Model</div>
            <div className="text-white font-semibold truncate">{project.targetModel?.replace(/-/g, ' ') || '—'}</div>
          </div>
        </div>

        {/* Phase mini bar */}
        {project.phases && project.phases.length > 0 && (
          <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden">
            {project.phases.map(phase => (
              <div
                key={phase.id}
                className="flex-1 rounded-full"
                style={{ backgroundColor: phase.color }}
                title={`${phase.name}: ${phase.count} images`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>🎯 {project.targetModel || 'No model'}</span>
          <span>•</span>
          <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardBody>
      <CardFooter className="flex gap-2">
        <Button variant="primary" size="xs" className="flex-1" onClick={onOpen}>
          📝 Open Studio
        </Button>
        <Button variant="ghost" size="xs" onClick={onEdit}>✏️</Button>
        <Button variant="ghost" size="xs" onClick={onDelete} className="text-red-400 hover:text-red-300">🗑️</Button>
      </CardFooter>
    </Card>
  );
}
