// ============================================================
// NextFashion — Core Type Definitions
// ============================================================

export type PhaseId = 'arrival' | 'build' | 'peak' | 'intimate' | 'playful' | 'winddown' | 'closing';

export interface Phase {
  id: PhaseId;
  name: string;
  description: string;
  color: string;
  icon: string;
  count: number;
  keywords: string[];
}

export interface ModelProfile {
  id: string;
  name: string;
  age: number;
  ethnicity: string;
  facialFeatures: string;
  traits: string;
  hairDetails: string;
  bodyType: string;
  specialMarks: string;
  skinDetails: string;
  favoriteClothing: string;
  favoriteAccessories: string;
  favoriteLocation: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  style: string;
  color: string;
  material: string;
  fit: string;
  details: string;
  accessories: string[];
  layers: string[];
  states: ClothingState[];
  progressionNotes: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export type ClothingCategory =
  | 'lingerie' | 'swimwear' | 'casual' | 'formal' | 'traditional-indian'
  | 'streetwear' | 'sportswear' | 'evening' | 'resort' | 'layered' | 'custom';

export interface ClothingState {
  id: string;
  label: string;
  description: string;
  phase?: PhaseId;
}

export interface Location {
  id: string;
  name: string;
  type: 'interior' | 'exterior' | 'mixed';
  category: LocationCategory;
  description: string;
  ambiance: string;
  lightingNotes: string;
  objects: LocationObject[];
  subAreas: string[];
  mood: string;
  timeOfDay: string[];
  season: string[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export type LocationCategory =
  | 'bedroom' | 'living-room' | 'bathroom' | 'kitchen' | 'studio'
  | 'garden' | 'beach' | 'forest' | 'urban' | 'rooftop' | 'pool'
  | 'hotel' | 'cafe' | 'art-studio' | 'warehouse' | 'custom';

export interface LocationObject {
  id: string;
  name: string;
  poseOptions: string[];
}

export interface LightingSetup {
  id: string;
  name: string;
  type: 'natural' | 'studio' | 'mixed' | 'dramatic' | 'soft' | 'golden-hour' | 'blue-hour' | 'neon' | 'candlelight';
  description: string;
  direction: string;
  quality: string;
  colorTemperature: string;
  mood: string;
  timeOfDay?: string;
  modifiers?: string[];
  tags: string[];
  createdAt: string;
}

export interface AnchorToken {
  id: string;
  category: string;
  key: string;
  value: string;
  locked: boolean;
  description?: string;
}

export interface PhotoProject {
  id: string;
  name: string;
  description: string;
  concept: string;
  totalImageCount: number;
  modelId: string;
  clothingId: string;
  locationId: string;
  lightingId: string;
  anchorTokens: AnchorToken[];
  phases: Phase[];
  targetModel: AIModel;
  negativePrompt: string;
  generatedPrompts: GeneratedPrompt[];
  status: 'draft' | 'active' | 'complete';
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface GeneratedPrompt {
  id: string;
  index: number;
  phaseId: PhaseId;
  phaseName: string;
  promptText: string;
  negativePrompt?: string;
  pose?: string;
  cameraAngle?: string;
  shotType?: string;
  expression?: string;
  clothingState?: string;
  locationArea?: string;
  notes?: string;
  seed?: number;
  edited: boolean;
  generatedAt: string;
}

export type AIModel =
  | 'sdxl' | 'sd35' | 'flux-dev' | 'flux-schnell' | 'flux-klein-9b'
  | 'midjourney' | 'dall-e-3' | 'chatgpt-image' | 'nano-banana'
  | 'ernie' | 'qwen-image' | 'z-image' | 'ollama-custom';

export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'replicate' | 'huggingface' | 'fal' | 'ollama' | 'stability' | 'custom';
  apiKey?: string;
  baseUrl?: string;
  models: string[];
  selectedModel?: string;
  isActive: boolean;
  ollamaPort?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryItem {
  id: string;
  category: string;
  name: string;
  value: string;
  tags: string[];
  createdAt: string;
}

export interface PoseVocab {
  id: string;
  pose: string;
  category: PoseCategory;
  tags: string[];
  phaseHint?: PhaseId;
}

export type PoseCategory =
  | 'standing' | 'sitting' | 'lying' | 'leaning' | 'walking'
  | 'dancing' | 'stretching' | 'reaching' | 'action' | 'resting' | 'intimate' | 'playful';

export interface CameraSpec {
  id: string;
  type: 'angle' | 'shot' | 'framing' | 'lens' | 'technical';
  name: string;
  description: string;
  tags: string[];
}

export interface ViewConfig {
  dashboard: boolean;
  projectCreate: boolean;
  projectDetail: string | null;
  modelBuilder: boolean;
  modelEdit: string | null;
  clothDesigner: boolean;
  clothEdit: string | null;
  locationCreator: boolean;
  locationEdit: string | null;
  lightingManager: boolean;
  photosetCreation: string | null;
  aiProvider: boolean;
  library: boolean;
  guide: boolean;
  imageGeneration: boolean;
}

export type ActiveView =
  | 'dashboard'
  | 'project-create'
  | 'project-detail'
  | 'model-builder'
  | 'cloth-designer'
  | 'location-creator'
  | 'lighting-manager'
  | 'anchor-manager'
  | 'photoset-creation'
  | 'ai-provider'
  | 'library'
  | 'guide'
  | 'image-generation';
