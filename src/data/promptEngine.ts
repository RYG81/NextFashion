// ============================================================
// NextFashion — Prompt Engine
// ============================================================

import type {
  PhotoProject, ModelProfile, ClothingItem, Location,
  LightingSetup, Phase, GeneratedPrompt, AIModel, PhaseId
} from '../types';
import { v4 as uuidv4 } from 'uuid';

// ─── Model-Specific Prompt Formatters ─────────────────────────────────────

export interface PromptFormat {
  positive: string;
  negative: string;
  parameters: string;
  fullPrompt: string;
}

function buildAnchorBlock(model: ModelProfile, lighting: LightingSetup, location: Location): string {
  return [
    `${model.facialFeatures}, ${model.ethnicity} woman`,
    `${model.hairDetails}`,
    `${model.bodyType}`,
    model.skinDetails,
    model.specialMarks ? `${model.specialMarks}` : '',
    `at ${location.name}`,
    `${lighting.description}, ${lighting.direction} lighting`,
    `${lighting.colorTemperature} color temperature`,
  ].filter(Boolean).join(', ');
}

function buildClothingBlock(clothing: ClothingItem, stateLabel?: string): string {
  const state = stateLabel
    ? clothing.states.find(s => s.label === stateLabel)
    : clothing.states[0];
  return [
    `wearing ${clothing.name}`,
    `${clothing.material}`,
    clothing.color,
    state ? state.description : clothing.details,
    clothing.accessories.length ? `with ${clothing.accessories.slice(0, 2).join(' and ')}` : '',
  ].filter(Boolean).join(', ');
}

function buildPhaseContext(phase: Phase, poseHint: string, cameraHint: string): string {
  const keyword = phase.keywords[Math.floor(Math.random() * phase.keywords.length)];
  return `${keyword} moment, ${poseHint}, ${cameraHint}`;
}

// FLUX / FLUX.1 / FLUX.2 Klein format
function formatFlux(basePrompt: string, negative: string): PromptFormat {
  const positive = `RAW photo, photorealistic, ultra-detailed, professional photography, ${basePrompt}, sharp focus, high resolution, 8K quality, skin texture visible, natural skin pores, subsurface scattering`;
  return {
    positive,
    negative,
    parameters: 'guidance_scale: 3.5, num_inference_steps: 28, width: 1024, height: 1024',
    fullPrompt: positive,
  };
}

// SDXL format
function formatSDXL(basePrompt: string, negative: string): PromptFormat {
  const positive = `masterpiece, best quality, ultra-detailed, photorealistic, ${basePrompt}, professional photography, sharp focus, 8k uhd, dslr, high quality, film grain, Fujifilm XT3`;
  const neg = `${negative}, (worst quality, low quality:1.4), (nsfw:0.8), ugly, morbid, extra fingers, mutated hands, poorly drawn hands, deformed, blurry, low resolution, text, watermark, signature`;
  return {
    positive,
    negative: neg,
    parameters: '--steps 25 --cfg 7.5 --sampler DPM++ 2M Karras',
    fullPrompt: positive,
  };
}

// Midjourney format
function formatMidjourney(basePrompt: string, negative: string): PromptFormat {
  const positive = `${basePrompt}, professional fashion photography, high-end magazine editorial, shot on Phase One camera, commercial quality, 4K --ar 2:3 --v 7 --style raw --stylize 150 --quality 2`;
  return {
    positive,
    negative: `--no ${negative}`,
    parameters: '--ar 2:3 --v 7 --style raw --stylize 150 --quality 2',
    fullPrompt: `${positive} --no ${negative}`,
  };
}

// ChatGPT / DALL-E 3 format (narrative paragraph style)
function formatChatGPT(basePrompt: string): PromptFormat {
  const positive = `Create a photorealistic professional fashion photograph depicting: ${basePrompt}. The image should look like it was taken by a professional photographer during an actual photoshoot session, with perfect lighting, sharp focus, and commercial quality suitable for a high-end fashion magazine. Style: documentary fashion photography with cinematic quality.`;
  return {
    positive,
    negative: 'No cartoons, no illustrations, no artwork',
    parameters: 'model: gpt-image-1, quality: high, size: 1024x1024',
    fullPrompt: positive,
  };
}

// Nano Banana format
function formatNanoBanana(basePrompt: string, negative: string): PromptFormat {
  const positive = `photorealistic, cinematic, ${basePrompt}, professional fashion photography, editorial quality, high detail`;
  return {
    positive,
    negative,
    parameters: 'steps: 30, cfg: 6.5',
    fullPrompt: positive,
  };
}

// SD 3.5 format
function formatSD35(basePrompt: string, negative: string): PromptFormat {
  const positive = `Professional fashion photography, photorealistic image of ${basePrompt}, shot on full-frame DSLR, editorial quality, commercial grade, ultra-detailed`;
  return {
    positive,
    negative,
    parameters: '--cfg 7.0 --steps 30 --sampler euler_ancestral',
    fullPrompt: positive,
  };
}

export function formatPromptForModel(basePrompt: string, negative: string, model: AIModel): PromptFormat {
  switch (model) {
    case 'flux-dev':
    case 'flux-schnell':
    case 'flux-klein-9b':
      return formatFlux(basePrompt, negative);
    case 'sdxl':
      return formatSDXL(basePrompt, negative);
    case 'sd35':
      return formatSD35(basePrompt, negative);
    case 'midjourney':
      return formatMidjourney(basePrompt, negative);
    case 'chatgpt-image':
    case 'dall-e-3':
      return formatChatGPT(basePrompt);
    case 'nano-banana':
      return formatNanoBanana(basePrompt, negative);
    default:
      return formatFlux(basePrompt, negative);
  }
}

// ─── Phase Distribution Calculator ───────────────────────────────────────

export function distributePhases(totalCount: number, phases: Phase[]): Phase[] {
  const weights = [0.10, 0.18, 0.20, 0.18, 0.14, 0.12, 0.08]; // arrival → closing
  return phases.map((phase, i) => ({
    ...phase,
    count: Math.max(1, Math.round(totalCount * weights[i])),
  }));
}

// ─── Camera hint library ──────────────────────────────────────────────────

const CAMERA_HINTS = {
  arrival: [
    'full body shot, medium-wide angle, eye level, 35mm lens f/2.8',
    'medium shot, eye level, natural composition, 50mm f/1.8',
    'three-quarter body shot, slight low angle, rule of thirds',
  ],
  build: [
    'medium close-up, 50mm f/1.8, slight high angle, soft bokeh',
    'waist-up shot, eye level, centered composition',
    'medium shot, side angle, leading lines from environment',
  ],
  peak: [
    'close-up portrait, 85mm f/1.4, eye level, shallow depth of field',
    'medium shot, low angle, dramatic framing, 35mm f/2',
    'medium close-up, backlit, 85mm lens, rim light separation',
  ],
  intimate: [
    'extreme close-up detail, 85mm macro, eye level, ultra-shallow DOF',
    'close-up portrait, high angle, soft overhead light, 50mm',
    'medium close-up, frame-within-frame framing, natural bokeh',
  ],
  playful: [
    'medium wide shot, action framing, 35mm, slight motion blur',
    'full body dynamic shot, low angle, 24mm wide angle, energy',
    'medium shot, dutch angle for playfulness, 35mm',
  ],
  winddown: [
    'medium shot, soft light, warm tones, 50mm, contemplative',
    'medium wide, environmental context, window light, 35mm',
    'three-quarter with negative space, soft focus background',
  ],
  closing: [
    'long shot with location context, farewell composition, 24mm',
    'medium shot looking away or back glance, 50mm, soft',
    'silhouette at window or door, backlit, 35mm wide',
  ],
};

// ─── Main Prompt Generator ────────────────────────────────────────────────

export function generatePrompts(
  project: PhotoProject,
  model: ModelProfile,
  clothing: ClothingItem,
  location: Location,
  lighting: LightingSetup,
  poses: string[]
): GeneratedPrompt[] {
  const prompts: GeneratedPrompt[] = [];
  const anchorBlock = buildAnchorBlock(model, lighting, location);

  let poseIndex = 0;
  let promptIndex = 0;

  const negativePrompt = project.negativePrompt || getDefaultNegativePrompt(project.targetModel);

  for (const phase of project.phases) {
    const phaseId = phase.id as PhaseId;
    const cameraOptions = CAMERA_HINTS[phaseId] || CAMERA_HINTS.build;

    for (let i = 0; i < phase.count; i++) {
      const pose = poses[poseIndex % poses.length] || 'natural relaxed pose';
      const camera = cameraOptions[i % cameraOptions.length];
      const clothingState = clothing.states[Math.min(
        Math.floor((promptIndex / project.totalImageCount) * clothing.states.length),
        clothing.states.length - 1
      )];

      const phaseContext = buildPhaseContext(phase, pose, camera);
      const clothingBlock = buildClothingBlock(clothing, clothingState?.label);

      const locationArea = location.subAreas[i % location.subAreas.length];
      const locationContext = `${locationArea} of the ${location.name}, ${location.ambiance}`;

      const basePrompt = [
        anchorBlock,
        clothingBlock,
        phaseContext,
        `in the ${locationContext}`,
        `mood: ${lighting.mood}`,
        `expression: ${getExpressionForPhase(phaseId)}`,
      ].join(', ');

      const formatted = formatPromptForModel(basePrompt, negativePrompt, project.targetModel);

      prompts.push({
        id: uuidv4(),
        index: promptIndex + 1,
        phaseId,
        phaseName: phase.name,
        promptText: formatted.fullPrompt,
        negativePrompt: formatted.negative,
        pose,
        cameraAngle: camera,
        shotType: camera.split(',')[0],
        expression: getExpressionForPhase(phaseId),
        clothingState: clothingState?.label,
        locationArea,
        edited: false,
        generatedAt: new Date().toISOString(),
        seed: Math.floor(Math.random() * 999999999),
      });

      poseIndex++;
      promptIndex++;
    }
  }

  return prompts;
}

function getExpressionForPhase(phaseId: PhaseId): string {
  const expressions: Record<PhaseId, string[]> = {
    arrival: ['confident, composed, direct gaze', 'serene smile, welcoming', 'poised, professional look'],
    build: ['natural relaxed smile', 'candid, thoughtful expression', 'warm engaging look'],
    peak: ['intense, powerful gaze', 'passionate expression', 'peak confidence, magnetic look'],
    intimate: ['soft, vulnerable expression', 'gentle slight smile, dreamy eyes', 'tender, emotional depth'],
    playful: ['laughing, joyful', 'playful smirk, mischievous', 'candid laughter, bright eyes'],
    winddown: ['contemplative, peaceful', 'introspective, soft gaze', 'serene, quiet expression'],
    closing: ['bittersweet gentle smile', 'last glance, knowing look', 'farewell warmth in eyes'],
  };
  const opts = expressions[phaseId];
  return opts[Math.floor(Math.random() * opts.length)];
}

export function getDefaultNegativePrompt(model: AIModel): string {
  const common = 'deformed, ugly, bad anatomy, bad hands, missing fingers, extra fingers, mutated, blurry, low quality, watermark, text, signature, logo, duplicate, poorly drawn, distorted face, unnatural proportions';

  switch (model) {
    case 'sdxl':
    case 'sd35':
      return `(worst quality, low quality:1.4), ${common}, (nsfw nudity:1.2), extra limbs, cross-eyed, disfigured`;
    case 'midjourney':
      return `${common}, watermark, text, nsfw`;
    default:
      return common;
  }
}

// ─── Auto-generate project name ───────────────────────────────────────────
const CONCEPTS = ['Velvet', 'Golden', 'Midnight', 'Crimson', 'Azure', 'Ivory', 'Obsidian', 'Amber', 'Jade', 'Pearl'];
const THEMES = ['Reverie', 'Solstice', 'Mirage', 'Echoes', 'Nocturne', 'Serenade', 'Luminary', 'Zenith', 'Essence', 'Aura'];

export function generateProjectName(): string {
  const c = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
  const t = THEMES[Math.floor(Math.random() * THEMES.length)];
  return `${c} ${t}`;
}

export function generateProjectDescription(concept: string, location: string, model: string): string {
  return `A captivating photoshoot series exploring ${concept.toLowerCase()} themes, set against the evocative backdrop of ${location}. This collection features ${model} in a carefully choreographed visual journey through seven distinct phases, creating a cohesive narrative arc that feels like a single continuous session captured by a master photographer.`;
}
