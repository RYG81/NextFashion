// ============================================================
// NextFashion — IndexedDB Database Layer
// ============================================================

import { openDB, IDBPDatabase } from 'idb';
import type {
  ModelProfile, ClothingItem, Location, LightingSetup,
  PhotoProject, AIProvider, LibraryItem, PoseVocab, CameraSpec
} from '../types';

const DB_NAME = 'NextFashionDB';
const DB_VERSION = 1;

let db: IDBPDatabase | null = null;

export async function getDB(): Promise<IDBPDatabase> {
  if (db) return db;
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Projects
      if (!database.objectStoreNames.contains('projects')) {
        const ps = database.createObjectStore('projects', { keyPath: 'id' });
        ps.createIndex('name', 'name');
        ps.createIndex('status', 'status');
        ps.createIndex('createdAt', 'createdAt');
      }
      // Models
      if (!database.objectStoreNames.contains('models')) {
        const ms = database.createObjectStore('models', { keyPath: 'id' });
        ms.createIndex('name', 'name');
        ms.createIndex('ethnicity', 'ethnicity');
      }
      // Clothing
      if (!database.objectStoreNames.contains('clothing')) {
        const cs = database.createObjectStore('clothing', { keyPath: 'id' });
        cs.createIndex('name', 'name');
        cs.createIndex('category', 'category');
      }
      // Locations
      if (!database.objectStoreNames.contains('locations')) {
        const ls = database.createObjectStore('locations', { keyPath: 'id' });
        ls.createIndex('name', 'name');
        ls.createIndex('type', 'type');
        ls.createIndex('category', 'category');
      }
      // Lighting
      if (!database.objectStoreNames.contains('lighting')) {
        const lts = database.createObjectStore('lighting', { keyPath: 'id' });
        lts.createIndex('name', 'name');
        lts.createIndex('type', 'type');
      }
      // AI Providers
      if (!database.objectStoreNames.contains('aiProviders')) {
        database.createObjectStore('aiProviders', { keyPath: 'id' });
      }
      // Library
      if (!database.objectStoreNames.contains('library')) {
        const lib = database.createObjectStore('library', { keyPath: 'id' });
        lib.createIndex('category', 'category');
      }
      // Poses
      if (!database.objectStoreNames.contains('poses')) {
        const pv = database.createObjectStore('poses', { keyPath: 'id' });
        pv.createIndex('category', 'category');
        pv.createIndex('phaseHint', 'phaseHint');
      }
      // Camera Specs
      if (!database.objectStoreNames.contains('cameraSpecs')) {
        const cam = database.createObjectStore('cameraSpecs', { keyPath: 'id' });
        cam.createIndex('type', 'type');
      }
      // Settings
      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
  return db;
}

// Generic CRUD helpers
export async function dbGetAll<T>(store: string): Promise<T[]> {
  const d = await getDB();
  return d.getAll(store) as Promise<T[]>;
}

export async function dbGet<T>(store: string, id: string): Promise<T | undefined> {
  const d = await getDB();
  return d.get(store, id) as Promise<T | undefined>;
}

export async function dbPut<T>(store: string, item: T): Promise<void> {
  const d = await getDB();
  await d.put(store, item);
}

export async function dbDelete(store: string, id: string): Promise<void> {
  const d = await getDB();
  await d.delete(store, id);
}

export async function dbClear(store: string): Promise<void> {
  const d = await getDB();
  await d.clear(store);
}

// Typed helpers
export const projectsDB = {
  getAll: () => dbGetAll<PhotoProject>('projects'),
  get: (id: string) => dbGet<PhotoProject>('projects', id),
  put: (item: PhotoProject) => dbPut('projects', item),
  delete: (id: string) => dbDelete('projects', id),
};

export const modelsDB = {
  getAll: () => dbGetAll<ModelProfile>('models'),
  get: (id: string) => dbGet<ModelProfile>('models', id),
  put: (item: ModelProfile) => dbPut('models', item),
  delete: (id: string) => dbDelete('models', id),
};

export const clothingDB = {
  getAll: () => dbGetAll<ClothingItem>('clothing'),
  get: (id: string) => dbGet<ClothingItem>('clothing', id),
  put: (item: ClothingItem) => dbPut('clothing', item),
  delete: (id: string) => dbDelete('clothing', id),
};

export const locationsDB = {
  getAll: () => dbGetAll<Location>('locations'),
  get: (id: string) => dbGet<Location>('locations', id),
  put: (item: Location) => dbPut('locations', item),
  delete: (id: string) => dbDelete('locations', id),
};

export const lightingDB = {
  getAll: () => dbGetAll<LightingSetup>('lighting'),
  get: (id: string) => dbGet<LightingSetup>('lighting', id),
  put: (item: LightingSetup) => dbPut('lighting', item),
  delete: (id: string) => dbDelete('lighting', id),
};

export const aiProvidersDB = {
  getAll: () => dbGetAll<AIProvider>('aiProviders'),
  get: (id: string) => dbGet<AIProvider>('aiProviders', id),
  put: (item: AIProvider) => dbPut('aiProviders', item),
  delete: (id: string) => dbDelete('aiProviders', id),
};

export const libraryDB = {
  getAll: () => dbGetAll<LibraryItem>('library'),
  get: (id: string) => dbGet<LibraryItem>('library', id),
  put: (item: LibraryItem) => dbPut('library', item),
  delete: (id: string) => dbDelete('library', id),
  getByCategory: async (category: string): Promise<LibraryItem[]> => {
    const d = await getDB();
    return d.getAllFromIndex('library', 'category', category) as Promise<LibraryItem[]>;
  },
};

export const posesDB = {
  getAll: () => dbGetAll<PoseVocab>('poses'),
  get: (id: string) => dbGet<PoseVocab>('poses', id),
  put: (item: PoseVocab) => dbPut('poses', item),
  delete: (id: string) => dbDelete('poses', id),
  getByCategory: async (category: string): Promise<PoseVocab[]> => {
    const d = await getDB();
    return d.getAllFromIndex('poses', 'category', category) as Promise<PoseVocab[]>;
  },
};

export const cameraSpecsDB = {
  getAll: () => dbGetAll<CameraSpec>('cameraSpecs'),
  get: (id: string) => dbGet<CameraSpec>('cameraSpecs', id),
  put: (item: CameraSpec) => dbPut('cameraSpecs', item),
  delete: (id: string) => dbDelete('cameraSpecs', id),
};

export async function getSetting(key: string): Promise<any> {
  const d = await getDB();
  const row = await d.get('settings', key);
  return row?.value;
}

export async function setSetting(key: string, value: any): Promise<void> {
  const d = await getDB();
  await d.put('settings', { key, value });
}
