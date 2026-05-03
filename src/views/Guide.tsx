import React, { useState } from 'react';
import { Card, CardBody } from '../components/ui/Card';

type GuideTab = 'user' | 'prompting' | 'consistency' | 'developer' | 'models';

const TABS: { id: GuideTab; label: string; icon: string }[] = [
  { id: 'user', label: 'User Guide', icon: '📖' },
  { id: 'prompting', label: 'Prompt Guide', icon: '✍️' },
  { id: 'consistency', label: 'Consistency System', icon: '🔗' },
  { id: 'models', label: 'AI Model Guide', icon: '🤖' },
  { id: 'developer', label: 'Developer Guide', icon: '💻' },
];

const USER_GUIDE = `# NextFashion — User Guide

## Overview
NextFashion is a professional AI Photoshoot Prompt Studio designed to generate hundreds of consistent prompts for AI image generation that look like they belong to a single photoshoot session.

## Quick Start
1. **Create a Project** — Start by creating a new project from the Dashboard
2. **Build Your Cast** — Use Model Builder to create detailed model profiles
3. **Design Outfits** — Use Cloth Designer to create clothing with phase progression
4. **Set the Scene** — Use Location Creator to design your shooting location
5. **Set Lighting** — Use Lighting Manager to configure your lighting setup
6. **Generate Prompts** — Open Prompt Studio and generate all prompts at once
7. **Export & Use** — Export prompts as TXT, CSV, or JSON

## The 7-Phase System
Every photoshoot in NextFashion follows a natural arc:

1. **🌅 Arrival (10%)** — First impressions, fully styled, confident entrance
2. **📈 Build (18%)** — Warming up, more relaxed, natural moments  
3. **⚡ Peak (20%)** — Most dynamic and expressive moments
4. **💫 Intimate (18%)** — Closer shots, emotional depth, softer energy
5. **✨ Playful (14%)** — Fun and lighthearted, movement and joy
6. **🌿 Wind Down (12%)** — Contemplative, exploratory, slower pace
7. **🌙 Closing (8%)** — Final moments, farewell energy

## Anchor System
Anchors are elements that remain IDENTICAL across all prompts:
- Model physical description (facial features, hair, skin, body)
- Location details
- Lighting setup
- Base clothing
- Style quality tokens

## Clothing Progression
Clothing changes naturally through the session:
- Phase 1: Fully styled, complete look
- Phase 2-3: Minor adjustments, more relaxed
- Phase 4-5: Outer layers removed, more intimate look
- Phase 6-7: Most relaxed state

## Tips for Best Results
- Be very specific in your model profile (skin texture, hair shine, facial details)
- Use the Location Creator to define sub-areas for pose variety
- Let the AI redistribute phases based on total count
- Always set your target AI model before generating — prompts are formatted differently per model
`;

const PROMPTING_GUIDE = `# AI Prompt Engineering for Consistent Photoshoots

## The Core Principle
Consistency comes from REPEATING the same anchor block in every single prompt while varying only the specific elements (pose, camera angle, expression, clothing state, location area).

## Anatomy of a Consistent Prompt

### 1. Anchor Block (NEVER changes)
\`\`\`
[detailed facial features], [ethnicity] woman, [hair details], 
[body type], [skin details], [special marks if any],
at [location name], [lighting description]
\`\`\`

### 2. Clothing Block (Changes per phase state)
\`\`\`
wearing [clothing name], [material], [color], 
[current state description], [accessories]
\`\`\`

### 3. Phase Context Block (Changes per image)
\`\`\`
[phase keyword], [pose description], [camera spec]
\`\`\`

### 4. Location Context Block
\`\`\`
in the [sub-area] of the [location], [ambiance]
\`\`\`

### 5. Quality Block (NEVER changes)
\`\`\`
photorealistic, ultra-detailed, professional photography, 
sharp focus, 8K quality, skin texture visible
\`\`\`

## Model-Specific Formatting

### FLUX.1 / FLUX.2 Klein
- Use natural language, no weight syntax needed
- Full sentence format works best
- Add: "RAW photo, photorealistic" at start
- No official negative prompt parameter — use guidance_scale (3-4) instead
- Optimal: guidance_scale 3.5, steps 28, 1024x1024

### Stable Diffusion XL (SDXL)
- Use (keyword:weight) syntax for emphasis
- Positive + Negative prompts required
- Add quality boosters: masterpiece, best quality, 8k uhd, RAW photo
- Negative: (worst quality, low quality:1.4), deformed, ugly, extra limbs
- Optimal: CFG 7-7.5, steps 25-30, DPM++ 2M Karras sampler

### Midjourney v7
- Narrative, description-style prompts work best
- Parameters at end: --ar 2:3 --v 7 --style raw --stylize 150
- Use --oref for character consistency across generations
- Use --sref for style consistency

### ChatGPT / DALL-E 3 / gpt-image-1
- Write as instructions: "Create a photorealistic image of..."
- Paragraph format, describe everything as a directive
- Avoid extremely explicit descriptions
- Great for consistent style when used with system prompts

### Nano Banana 2
- Similar to Leonardo's style
- Works well with character reference images
- Good bokeh and realistic skin rendering

## Key Consistency Techniques

### 1. Character Bible Method
Create an ultra-detailed character description first, then paste it identically into every prompt.

### 2. Seed Locking
For models that support it (SDXL, Midjourney), lock the seed number. Same seed = same "DNA" for image generation.

### 3. Style Reference Images
For Midjourney, use --sref with a reference image URL to maintain consistent visual style.

### 4. Detailed Skin Descriptors
For photorealism and consistency, include:
- Skin texture (pores, translucency)
- Undertones (warm/cool)
- Natural marks (freckles, moles)
- Hair texture and shine

## Common Mistakes
❌ Changing model description between prompts — anchor block must be IDENTICAL
❌ Vague location descriptions — specify exact sub-area
❌ Missing lighting continuity — always include same lighting description
❌ Random poses — follow phase logic for natural arc
`;

const CONSISTENCY_GUIDE = `# The NextFashion Consistency System

## Why Consistency Is Hard
AI image generators are fundamentally random. Each generation starts fresh. Without special techniques, generating "the same person in different poses" produces different-looking people each time.

## NextFashion's Solution: Anchor Token Architecture

### What Are Anchor Tokens?
Anchor tokens are descriptive strings that are REPEATED VERBATIM in every single prompt. The AI learns to associate these descriptions with the same visual result when they appear together consistently.

## The 5-Layer Consistency Model

### Layer 1: Physical Identity Anchors
These describe WHO the subject is. Must appear in every prompt:
- Exact facial feature description (copy-paste identical)
- Hair description with texture and color
- Skin description with tone and texture
- Body type and proportions
- Any unique marks (freckles, moles, etc.)

### Layer 2: Environmental Anchors
These establish WHERE — must be identical:
- Location name and type
- Architectural/environmental details
- Time of day references
- Weather/atmosphere

### Layer 3: Lighting Anchors
These establish the light quality — must be identical:
- Light source and direction
- Quality (soft/hard)
- Color temperature
- Mood descriptor

### Layer 4: Style Anchors
These establish the visual quality:
- Photography style (photorealistic, film photography, etc.)
- Quality terms (8K, ultra-detailed)
- Color grading description

### Layer 5: Variable Elements (What Changes)
ONLY these should change between prompts:
- Pose description
- Camera angle and shot type
- Expression
- Clothing state
- Sub-area of location
- Phase-specific keywords

## The 360° Reference System
Before generating a full set, create these reference images first:
1. Full-body front shot (neutral pose, full outfit)
2. Full-body back shot
3. 3/4 angle shot
4. Close-up face shot

Use these as reference/cref images in supporting tools to maintain visual consistency.

## Phase Arc Design
The 7 phases create a natural emotional and visual arc:

\`\`\`
Arrival → Build → Peak → Intimate → Playful → Wind Down → Closing
  10%      18%     20%     18%       14%        12%         8%
\`\`\`

Clothing states should mirror this arc:
\`\`\`
Fully Styled → Adjusted → Peak Look → Intimate → Casual → Relaxed → Final
\`\`\`

## Recommended Workflow
1. Build model profile with maximum detail
2. Design location with all sub-areas mapped
3. Design clothing with all states for all phases
4. Configure lighting once and lock it
5. Generate all prompts at once
6. Review distribution per phase
7. Manually edit any prompts that need adjustment
8. Export for your AI tool of choice
`;

const MODELS_GUIDE = `# AI Image Model Guide for Fashion Photography

## Model Comparison Matrix

| Model | Consistency | Skin Quality | Prompt Following | Speed | Cost |
|-------|------------|--------------|-----------------|-------|------|
| FLUX.1 [dev] | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Medium | Medium |
| FLUX.2 Klein 9B | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Fast | Local |
| SDXL | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Fast | Low |
| SD 3.5 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Medium | Medium |
| Midjourney v7 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Medium | Subscription |
| DALL-E 3 / GPT Image | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Medium | High |
| Nano Banana 2 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Fast | Low |

## FLUX.2 Klein 9B — Best for Consistent Fashion Sets
**Strengths:** Incredible photorealism, best skin rendering, superior prompt adherence
**Best For:** Full photoshoot sets (50-500 images)
**Unique Feature:** Edit-in-place with reference images maintains perfect consistency
**Prompt Style:** Natural language, descriptive paragraphs
**API:** Nunchaku local inference or FAL.ai hosted
**Steps:** 4 (distilled model)
**Guidance:** 1.0

## FLUX.1 [dev] — Professional Choice
**Strengths:** Exceptional photorealism, handles long complex prompts
**Best For:** Commercial fashion photography
**Prompt Style:** Natural language, detailed descriptions
**API:** FAL.ai, Replicate, HuggingFace
**Steps:** 28-32
**Guidance:** 3.5

## Midjourney v7 — Artistic Consistency
**Strengths:** Most aesthetically beautiful output, Omni Reference for character consistency
**Best For:** High-end editorial fashion
**Special Feature:** --oref for character reference, --sref for style
**Prompt Style:** Descriptive + parameters at end
**Parameters:** --ar 2:3 --v 7 --oref [ref_url] --style raw

## SDXL — Versatile Workhorse
**Strengths:** Community fine-tunes, LoRA support, excellent control with ControlNet
**Best For:** High-volume generation with character LoRA training
**Prompt Style:** Weighted keywords, separate positive/negative
**Key Technique:** Train a LoRA on your model profile for perfect consistency
**Steps:** 25-30, CFG 7-7.5

## ChatGPT Image (gpt-image-1)
**Strengths:** Perfect prompt following, excellent for complex scenes
**Best For:** Complex multi-element shots
**Prompt Style:** Instructional paragraph
**Note:** Limited consistency across generations without reference image

## Practical Workflow Recommendations

### For 50-100 Image Sets
Use FLUX.1 [dev] with detailed anchor blocks. Generate in batches with same seed patterns.

### For 100-300 Image Sets  
Use SDXL with a custom character LoRA for true face consistency. NextFashion generates prompts that work perfectly with LoRA workflows.

### For 300-500 Image Sets
Use FLUX.2 Klein 9B locally for the highest quality and consistency at scale.

### For Maximum Quality
Start with Midjourney to establish your character reference images, then use those as --oref images for all 500 prompts.
`;

const DEVELOPER_GUIDE = `# NextFashion — Developer Guide

## Architecture Overview
NextFashion is built as a single-page application using:
- **React 19** — UI framework with hooks
- **TypeScript** — Full type safety throughout
- **Tailwind CSS v4** — Utility-first styling
- **IndexedDB (via idb)** — Local database for all data persistence
- **Vite** — Build tool and dev server

## Project Structure
\`\`\`
src/
├── types/index.ts          # All TypeScript interfaces
├── data/
│   ├── database.ts         # IndexedDB layer (idb)
│   ├── seedData.ts         # 50+ predefined models, clothing, locations
│   └── promptEngine.ts     # Core prompt generation logic
├── context/AppContext.tsx   # Global state management
├── components/
│   ├── ui/                 # Shared UI components
│   └── Layout/             # Sidebar, Layout components
└── views/                  # Main application screens
    ├── Dashboard.tsx
    ├── ProjectCreate.tsx
    ├── ModelBuilder.tsx
    ├── ClothDesigner.tsx
    ├── LocationCreator.tsx
    ├── AIProvider.tsx
    ├── PhotosetCreation.tsx
    ├── ImageGeneration.tsx
    ├── Library.tsx
    └── Guide.tsx
\`\`\`

## Database Schema (IndexedDB)

### Stores
- **projects** — PhotoProject objects with embedded prompts
- **models** — ModelProfile library
- **clothing** — ClothingItem library with states
- **locations** — Location objects with sub-areas and objects
- **lighting** — LightingSetup configurations
- **aiProviders** — API provider configurations (keys encrypted conceptually)
- **poses** — PoseVocab library (1000+ entries possible)
- **cameraSpecs** — Camera angle, shot type, lens, framing library
- **settings** — Key-value settings store

## Prompt Engine (promptEngine.ts)

### Core Functions

\`\`\`typescript
// Generate all prompts for a project
generatePrompts(project, model, clothing, location, lighting, poses): GeneratedPrompt[]

// Format prompt for specific AI model
formatPromptForModel(basePrompt, negative, model: AIModel): PromptFormat

// Distribute phase counts proportionally
distributePhases(totalCount, phases): Phase[]
\`\`\`

### Model Formatters
Each AI model has a dedicated formatter that applies:
- Prefix quality tokens (model-specific)
- Syntax adjustments (weights, parameters)
- Model-specific negative prompts
- Parameter hints

## Adding New Features

### Add a New AI Model
1. Add model to \`AIModel\` type in types/index.ts
2. Add format function in promptEngine.ts
3. Add to switch in \`formatPromptForModel\`
4. Add to AI_MODELS array in ProjectCreate.tsx

### Add New Library Category
1. Add type to LibraryItem in types/index.ts
2. Add IndexedDB store in database.ts
3. Add seed data in seedData.ts
4. Add UI tab in Library.tsx

### Extending the Prompt Engine
The prompt engine uses a pipeline:
1. Build anchor block (model + location + lighting)
2. Build clothing block (current state)
3. Build phase context (keywords + pose + camera)
4. Combine and format for target model
5. Add quality suffix

## Ollama Integration

\`\`\`javascript
// Fetch local models
const response = await fetch('http://localhost:11434/api/tags');
const { models } = await response.json();

// Generate with Ollama
const res = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3.2',
    messages: [{ role: 'user', content: 'Your prompt here' }],
    stream: false,
  }),
});

// Setup for CORS (user must run this in terminal)
// OLLAMA_ORIGINS=* ollama serve
\`\`\`

## Export Format Specifications

### JSON Export
Full project object including all prompts with metadata.

### CSV Export
\`Index,Phase,Prompt,Negative Prompt,Pose,Camera,Expression,Clothing State,Location Area\`

### TXT Export
One prompt per line, separated by blank line, positive prompts only.

## Performance Considerations
- IndexedDB operations are async — always await
- Large projects (500 prompts) may take 2-3 seconds to generate
- Use React.useMemo for filtered prompt lists
- Lazy-load large library views
`;

export function Guide() {
  const [activeTab, setActiveTab] = useState<GuideTab>('user');

  const CONTENT: Record<GuideTab, string> = {
    user: USER_GUIDE,
    prompting: PROMPTING_GUIDE,
    consistency: CONSISTENCY_GUIDE,
    models: MODELS_GUIDE,
    developer: DEVELOPER_GUIDE,
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">📖 Guide</h1>
        <p className="text-gray-400 text-sm mt-1">Complete documentation for NextFashion AI Prompt Studio</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardBody>
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono overflow-auto">
              {CONTENT[activeTab]}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(CONTENT[activeTab])}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
