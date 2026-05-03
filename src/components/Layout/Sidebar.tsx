import React from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import type { ActiveView } from '../../types';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: string;
  badge?: number;
  group?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬛', group: 'main' },
  { id: 'project-create', label: 'New Project', icon: '➕', group: 'main' },
  { id: 'photoset-creation', label: 'Prompt Studio', icon: '📝', group: 'main' },
  { id: 'image-generation', label: 'Image Gen', icon: '🎨', group: 'main' },
  { id: 'model-builder', label: 'Model Builder', icon: '👤', group: 'create' },
  { id: 'cloth-designer', label: 'Cloth Designer', icon: '👗', group: 'create' },
  { id: 'location-creator', label: 'Location Creator', icon: '📍', group: 'create' },
  { id: 'lighting-manager', label: 'Lighting Manager', icon: '💡', group: 'create' },
  { id: 'ai-provider', label: 'AI Providers', icon: '🤖', group: 'settings' },
  { id: 'library', label: 'Library', icon: '📚', group: 'settings' },
  { id: 'guide', label: 'Guide', icon: '📖', group: 'settings' },
];

const GROUPS: { id: string; label: string }[] = [
  { id: 'main', label: 'Workspace' },
  { id: 'create', label: 'Create & Design' },
  { id: 'settings', label: 'Tools & Settings' },
];

export function Sidebar() {
  const { activeView, setActiveView, projects } = useApp();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/30">
            NF
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">NextFashion</div>
            <div className="text-gray-500 text-xs">AI Prompt Studio</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {GROUPS.map(group => {
          const items = NAV_ITEMS.filter(i => i.group === group.id);
          return (
            <div key={group.id}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-1">{group.label}</p>
              <div className="space-y-0.5">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                      activeView === item.id
                        ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                    )}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.id === 'dashboard' && projects.length > 0 && (
                      <span className="text-xs bg-violet-600/30 text-violet-400 px-1.5 py-0.5 rounded-full">
                        {projects.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-center">
          <div className="text-xs text-gray-600">NextFashion v1.0</div>
          <div className="text-xs text-gray-700 mt-0.5">AI Photoshoot Studio</div>
        </div>
      </div>
    </aside>
  );
}
