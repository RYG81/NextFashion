import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  timestamp: string;
  seed?: number;
}

const MODEL_INFO = {
  'flux-klein-9b': {
    name: 'FLUX.2 Klein 9B (Nunchaku)',
    note: 'Requires local Python setup with Nunchaku library. See guide below.',
    apiEndpoint: 'local',
    color: 'text-orange-400',
  },
  'fal-flux-dev': {
    name: 'FLUX.1 [dev] via FAL.ai',
    note: 'Requires FAL.ai API key in Providers',
    apiEndpoint: 'https://fal.run/fal-ai/flux/dev',
    color: 'text-blue-400',
  },
  'hf-flux-dev': {
    name: 'FLUX.1 [dev] via HuggingFace',
    note: 'Requires HuggingFace API key',
    apiEndpoint: 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
    color: 'text-yellow-400',
  },
  'replicate-flux': {
    name: 'FLUX.1 via Replicate',
    note: 'Requires Replicate API key',
    apiEndpoint: 'https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions',
    color: 'text-purple-400',
  },
  'dalle3': {
    name: 'DALL-E 3 via OpenAI',
    note: 'Requires OpenAI API key in Providers',
    apiEndpoint: 'https://api.openai.com/v1/images/generations',
    color: 'text-emerald-400',
  },
};

const SETUP_GUIDE = `# FLUX.2 Klein 9B Local Setup Guide

## Requirements
- Python 3.10+
- CUDA GPU (RTX 3090/4090 recommended)
- ~18GB VRAM or CPU offload mode

## Installation

\`\`\`bash
pip install torch torchvision
pip install diffusers accelerate transformers
pip install nunchaku  # from tonera's repo

# Or install from source:
pip install git+https://github.com/tonera/nunchaku.git
\`\`\`

## Running FLUX.2 Klein 9B

\`\`\`python
import torch
from diffusers import Flux2KleinPipeline
from nunchaku.models.transformers.transformer_flux2 import NunchakuFlux2Transformer2DModel
from nunchaku.utils import get_precision

REPO = "tonera/FLUX.2-klein-9B-Nunchaku"
NAME = "FLUX.2-klein-9B-Nunchaku"

transformer = NunchakuFlux2Transformer2DModel.from_pretrained(
    f"{REPO}/svdq-{get_precision()}_r32-{NAME}.safetensors",
    torch_dtype=torch.bfloat16,
)

pipe = Flux2KleinPipeline.from_pretrained(
    REPO, torch_dtype=torch.bfloat16, transformer=transformer
)
pipe.to("cuda")

image = pipe(
    prompt="YOUR PROMPT HERE",
    guidance_scale=1.0,
    num_inference_steps=4,
    generator=torch.Generator("cpu").manual_seed(42),
).images[0]

image.save("output.png")
\`\`\`

## Setting up a Local API Server

\`\`\`python
# Save as server.py and run: uvicorn server:app --port 8000
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch, base64
from io import BytesIO
from diffusers import Flux2KleinPipeline

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])

# Load model once at startup
pipe = None  # Initialize your pipeline here

class GenerateRequest(BaseModel):
    prompt: str
    seed: int = 42
    steps: int = 4
    guidance: float = 1.0

@app.post("/generate")
async def generate(req: GenerateRequest):
    gen = torch.Generator("cpu").manual_seed(req.seed)
    img = pipe(req.prompt, guidance_scale=req.guidance, 
               num_inference_steps=req.steps, generator=gen).images[0]
    buf = BytesIO()
    img.save(buf, format="PNG")
    return {"image": base64.b64encode(buf.getvalue()).decode()}
\`\`\`

## Connect from NextFashion
Set your local server URL to http://localhost:8000 in the Image Generation settings.
`;

export function ImageGeneration() {
  const { projects, aiProviders } = useApp();
  const [selectedModel, setSelectedModel] = useState<keyof typeof MODEL_INFO>('fal-flux-dev');
  const [prompt, setPrompt] = useState('');
  const [negPrompt, setNegPrompt] = useState('');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(28);
  const [guidance, setGuidance] = useState(3.5);
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 999999));
  const [localUrl, setLocalUrl] = useState('http://localhost:8000');
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [error, setError] = useState('');

  // Load prompt from session storage (set by prompt studio)
  useEffect(() => {
    const savedPrompt = sessionStorage.getItem('imageGenPrompt');
    if (savedPrompt) {
      setPrompt(savedPrompt);
      sessionStorage.removeItem('imageGenPrompt');
    }
  }, []);

  const getApiKey = (type: string): string => {
    const provider = aiProviders.find(p => p.type === type && p.apiKey);
    return provider?.apiKey || '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError('');

    try {
      let imageUrl = '';

      if (selectedModel === 'flux-klein-9b') {
        // Local server
        const res = await fetch(`${localUrl}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, seed, steps, guidance }),
        });
        if (!res.ok) throw new Error(`Local server error: ${res.status}`);
        const data = await res.json();
        imageUrl = `data:image/png;base64,${data.image}`;

      } else if (selectedModel === 'fal-flux-dev') {
        const apiKey = getApiKey('fal');
        if (!apiKey) throw new Error('FAL.ai API key not configured. Go to AI Providers to add it.');
        const res = await fetch('https://fal.run/fal-ai/flux/dev', {
          method: 'POST',
          headers: { 'Authorization': `Key ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            image_size: { width, height },
            num_inference_steps: steps,
            guidance_scale: guidance,
            seed,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || `FAL error: ${res.status}`);
        }
        const data = await res.json();
        imageUrl = data.images?.[0]?.url || data.image?.url || '';

      } else if (selectedModel === 'hf-flux-dev') {
        const apiKey = getApiKey('huggingface');
        if (!apiKey) throw new Error('HuggingFace API key not configured. Go to AI Providers to add it.');
        const res = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs: prompt, parameters: { width, height, num_inference_steps: steps } }),
        });
        if (!res.ok) throw new Error(`HuggingFace error: ${res.status}`);
        const blob = await res.blob();
        imageUrl = URL.createObjectURL(blob);

      } else if (selectedModel === 'replicate-flux') {
        const apiKey = getApiKey('replicate');
        if (!apiKey) throw new Error('Replicate API key not configured. Go to AI Providers to add it.');
        const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: { prompt, width, height, num_inference_steps: steps, guidance: guidance, seed } }),
        });
        if (!res.ok) throw new Error(`Replicate error: ${res.status}`);
        const pred = await res.json();
        // Poll for result
        let result = pred;
        while (result.status !== 'succeeded' && result.status !== 'failed') {
          await new Promise(r => setTimeout(r, 2000));
          const poll = await fetch(pred.urls.get, { headers: { 'Authorization': `Bearer ${apiKey}` } });
          result = await poll.json();
        }
        if (result.status === 'failed') throw new Error('Replicate generation failed');
        imageUrl = result.output?.[0] || '';

      } else if (selectedModel === 'dalle3') {
        const apiKey = getApiKey('openai');
        if (!apiKey) throw new Error('OpenAI API key not configured. Go to AI Providers to add it.');
        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024', quality: 'hd' }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || `OpenAI error: ${res.status}`);
        }
        const data = await res.json();
        imageUrl = data.data?.[0]?.url || '';
      }

      if (imageUrl) {
        const newImage: GeneratedImage = {
          id: crypto.randomUUID(),
          prompt,
          imageUrl,
          model: MODEL_INFO[selectedModel].name,
          timestamp: new Date().toISOString(),
          seed,
        };
        setGeneratedImages(prev => [newImage, ...prev]);
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setGenerating(false);
  };

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement('a');
    a.href = img.imageUrl;
    a.download = `nextfashion-${img.id.slice(0, 8)}.png`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">🎨 Image Generation</h1>
          <p className="text-gray-400 text-sm">Generate images from your photoshoot prompts</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowSetup(!showSetup)}>
          📖 Setup Guide
        </Button>
      </div>

      {showSetup && (
        <Card>
          <CardBody>
            <pre className="text-xs text-gray-400 whitespace-pre-wrap overflow-auto max-h-96 font-mono">{SETUP_GUIDE}</pre>
            <Button variant="ghost" size="xs" className="mt-2" onClick={() => navigator.clipboard.writeText(SETUP_GUIDE)}>📋 Copy Guide</Button>
          </CardBody>
        </Card>
      )}

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700/30 rounded-lg text-red-300 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader><h2 className="font-semibold text-white text-sm">🤖 Model Selection</h2></CardHeader>
            <CardBody className="space-y-2">
              {(Object.entries(MODEL_INFO) as [keyof typeof MODEL_INFO, typeof MODEL_INFO[keyof typeof MODEL_INFO]][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setSelectedModel(key)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all ${selectedModel === key ? 'border-violet-500 bg-violet-500/20' : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'}`}
                >
                  <div className={`text-xs font-medium ${selectedModel === key ? 'text-violet-300' : 'text-gray-300'}`}>{info.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{info.note}</div>
                </button>
              ))}

              {selectedModel === 'flux-klein-9b' && (
                <div className="mt-2 space-y-1">
                  <label className="text-xs font-medium text-gray-300">Local Server URL</label>
                  <input
                    value={localUrl}
                    onChange={e => setLocalUrl(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2 text-xs font-mono"
                    placeholder="http://localhost:8000"
                  />
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="font-semibold text-white text-sm">⚙️ Parameters</h2></CardHeader>
            <CardBody className="space-y-3">
              {[
                { label: 'Width', value: width, set: setWidth, min: 512, max: 1440, step: 64 },
                { label: 'Height', value: height, set: setHeight, min: 512, max: 1440, step: 64 },
                { label: 'Steps', value: steps, set: setSteps, min: 1, max: 50, step: 1 },
                { label: 'Guidance', value: guidance, set: setGuidance, min: 0.1, max: 10, step: 0.1 },
              ].map(param => (
                <div key={param.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">{param.label}</span>
                    <span className="text-violet-400 font-mono">{param.value}</span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value}
                    onChange={e => param.set(Number(e.target.value) as any)}
                    className="w-full accent-violet-500"
                  />
                </div>
              ))}

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Seed</span>
                  <button
                    onClick={() => setSeed(Math.floor(Math.random() * 999999999))}
                    className="text-violet-400 hover:text-violet-300"
                  >🎲 Random</button>
                </div>
                <input
                  type="number"
                  value={seed}
                  onChange={e => setSeed(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg text-white px-3 py-2 text-sm font-mono"
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Prompt & Output */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardBody className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={5}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 resize-y"
                  placeholder="Enter your photoshoot prompt or load one from Prompt Studio..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Negative Prompt <span className="text-gray-500">(optional)</span></label>
                <textarea
                  value={negPrompt}
                  onChange={e => setNegPrompt(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-300 px-3 py-2.5 text-xs focus:outline-none focus:border-violet-500 resize-y"
                  placeholder="Things to exclude from the image..."
                />
              </div>

              {/* Load from project */}
              {projects.length > 0 && (
                <div className="text-xs text-gray-500">
                  💡 Tip: Click "🎨 Send to Image Gen" on any prompt in the Prompt Studio to load it here automatically.
                </div>
              )}

              <Button
                variant="gradient"
                className="w-full"
                loading={generating}
                onClick={handleGenerate}
                disabled={!prompt.trim()}
              >
                {generating ? 'Generating...' : '🎨 Generate Image'}
              </Button>
            </CardBody>
          </Card>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Generated Images ({generatedImages.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedImages.map(img => (
                  <Card key={img.id}>
                    <CardBody className="p-3 space-y-2">
                      <img
                        src={img.imageUrl}
                        alt={img.prompt.slice(0, 50)}
                        className="w-full aspect-square object-cover rounded-lg bg-gray-900"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <p className="text-xs text-gray-400 line-clamp-2">{img.prompt}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {img.model} · seed {img.seed}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="xs" onClick={() => navigator.clipboard.writeText(img.prompt)}>📋</Button>
                          <Button variant="ghost" size="xs" onClick={() => handleDownload(img)}>⬇️</Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
