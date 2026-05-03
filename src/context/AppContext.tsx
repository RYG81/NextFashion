// ============================================================
// NextFashion — App Context / State Management
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  PhotoProject, ModelProfile, ClothingItem, Location,
  LightingSetup, AIProvider, ActiveView
} from '../types';
import {
  projectsDB, modelsDB, clothingDB, locationsDB, lightingDB, aiProvidersDB,
  posesDB, cameraSpecsDB
} from '../data/database';
import {
  SEED_MODELS, SEED_CLOTHING, SEED_LOCATIONS, SEED_LIGHTING,
  SEED_POSES, SEED_CAMERA_SPECS, DEFAULT_AI_PROVIDERS
} from '../data/seedData';
import { getSetting, setSetting } from '../data/database';

interface AppContextType {
  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  // Data
  projects: PhotoProject[];
  models: ModelProfile[];
  clothing: ClothingItem[];
  locations: Location[];
  lighting: LightingSetup[];
  aiProviders: AIProvider[];

  // CRUD
  refreshProjects: () => Promise<void>;
  refreshModels: () => Promise<void>;
  refreshClothing: () => Promise<void>;
  refreshLocations: () => Promise<void>;
  refreshLighting: () => Promise<void>;
  refreshAIProviders: () => Promise<void>;

  saveProject: (project: PhotoProject) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveModel: (model: ModelProfile) => Promise<void>;
  deleteModel: (id: string) => Promise<void>;
  saveClothing: (item: ClothingItem) => Promise<void>;
  deleteClothing: (id: string) => Promise<void>;
  saveLocation: (location: Location) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  saveLighting: (lighting: LightingSetup) => Promise<void>;
  deleteLighting: (id: string) => Promise<void>;
  saveAIProvider: (provider: AIProvider) => Promise<void>;
  deleteAIProvider: (id: string) => Promise<void>;

  isLoading: boolean;
  isSeeded: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<PhotoProject[]>([]);
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [clothing, setClothing] = useState<ClothingItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [lighting, setLighting] = useState<LightingSetup[]>([]);
  const [aiProviders, setAIProviders] = useState<AIProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeded, setIsSeeded] = useState(false);

  const seedIfNeeded = useCallback(async () => {
    const seeded = await getSetting('seeded_v1');
    if (!seeded) {
      // Seed all data
      for (const m of SEED_MODELS) await modelsDB.put(m);
      for (const c of SEED_CLOTHING) await clothingDB.put(c);
      for (const l of SEED_LOCATIONS) await locationsDB.put(l);
      for (const lt of SEED_LIGHTING) await lightingDB.put(lt);
      for (const p of SEED_POSES) await posesDB.put(p);
      for (const cs of SEED_CAMERA_SPECS) await cameraSpecsDB.put(cs);
      for (const ap of DEFAULT_AI_PROVIDERS) await aiProvidersDB.put(ap);
      await setSetting('seeded_v1', true);
    }
    setIsSeeded(true);
  }, []);

  const refreshProjects = useCallback(async () => {
    const data = await projectsDB.getAll();
    setProjects(data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, []);

  const refreshModels = useCallback(async () => {
    const data = await modelsDB.getAll();
    setModels(data);
  }, []);

  const refreshClothing = useCallback(async () => {
    const data = await clothingDB.getAll();
    setClothing(data);
  }, []);

  const refreshLocations = useCallback(async () => {
    const data = await locationsDB.getAll();
    setLocations(data);
  }, []);

  const refreshLighting = useCallback(async () => {
    const data = await lightingDB.getAll();
    setLighting(data);
  }, []);

  const refreshAIProviders = useCallback(async () => {
    const data = await aiProvidersDB.getAll();
    setAIProviders(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await seedIfNeeded();
      await Promise.all([
        refreshProjects(),
        refreshModels(),
        refreshClothing(),
        refreshLocations(),
        refreshLighting(),
        refreshAIProviders(),
      ]);
      setIsLoading(false);
    };
    init();
  }, []);

  const saveProject = useCallback(async (project: PhotoProject) => {
    await projectsDB.put(project);
    await refreshProjects();
  }, [refreshProjects]);

  const deleteProject = useCallback(async (id: string) => {
    await projectsDB.delete(id);
    await refreshProjects();
  }, [refreshProjects]);

  const saveModel = useCallback(async (model: ModelProfile) => {
    await modelsDB.put(model);
    await refreshModels();
  }, [refreshModels]);

  const deleteModel = useCallback(async (id: string) => {
    await modelsDB.delete(id);
    await refreshModels();
  }, [refreshModels]);

  const saveClothing = useCallback(async (item: ClothingItem) => {
    await clothingDB.put(item);
    await refreshClothing();
  }, [refreshClothing]);

  const deleteClothing = useCallback(async (id: string) => {
    await clothingDB.delete(id);
    await refreshClothing();
  }, [refreshClothing]);

  const saveLocation = useCallback(async (location: Location) => {
    await locationsDB.put(location);
    await refreshLocations();
  }, [refreshLocations]);

  const deleteLocation = useCallback(async (id: string) => {
    await locationsDB.delete(id);
    await refreshLocations();
  }, [refreshLocations]);

  const saveLighting = useCallback(async (lt: LightingSetup) => {
    await lightingDB.put(lt);
    await refreshLighting();
  }, [refreshLighting]);

  const deleteLighting = useCallback(async (id: string) => {
    await lightingDB.delete(id);
    await refreshLighting();
  }, [refreshLighting]);

  const saveAIProvider = useCallback(async (provider: AIProvider) => {
    await aiProvidersDB.put(provider);
    await refreshAIProviders();
  }, [refreshAIProviders]);

  const deleteAIProvider = useCallback(async (id: string) => {
    await aiProvidersDB.delete(id);
    await refreshAIProviders();
  }, [refreshAIProviders]);

  return (
    <AppContext.Provider value={{
      activeView, setActiveView,
      selectedProjectId, setSelectedProjectId,
      projects, models, clothing, locations, lighting, aiProviders,
      refreshProjects, refreshModels, refreshClothing, refreshLocations,
      refreshLighting, refreshAIProviders,
      saveProject, deleteProject,
      saveModel, deleteModel,
      saveClothing, deleteClothing,
      saveLocation, deleteLocation,
      saveLighting, deleteLighting,
      saveAIProvider, deleteAIProvider,
      isLoading, isSeeded,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
