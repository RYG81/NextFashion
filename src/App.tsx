import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './views/Dashboard';
import { ProjectCreate } from './views/ProjectCreate';
import { ModelBuilder } from './views/ModelBuilder';
import { ClothDesigner } from './views/ClothDesigner';
import { LocationCreator } from './views/LocationCreator';
import { LightingManager } from './views/LightingManager';
import { AIProvider } from './views/AIProvider';
import { PhotosetCreation } from './views/PhotosetCreation';
import { ImageGeneration } from './views/ImageGeneration';
import { Library } from './views/Library';
import { Guide } from './views/Guide';

function AppContent() {
  const { activeView, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-violet-500/30 animate-pulse">
            NF
          </div>
          <div className="text-white font-semibold mb-1">NextFashion</div>
          <div className="text-gray-400 text-sm">Loading your studio...</div>
          <div className="mt-4 flex gap-1 justify-center">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'project-create': return <ProjectCreate />;
      case 'model-builder': return <ModelBuilder />;
      case 'cloth-designer': return <ClothDesigner />;
      case 'location-creator': return <LocationCreator />;
      case 'lighting-manager': return <LightingManager />;
      case 'ai-provider': return <AIProvider />;
      case 'photoset-creation': return <PhotosetCreation />;
      case 'image-generation': return <ImageGeneration />;
      case 'library': return <Library />;
      case 'guide': return <Guide />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
