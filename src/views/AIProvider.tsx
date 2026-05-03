import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { AIProvider } from '../types';

const PROVIDER_ICONS: Record<string, string> = {
  openai: '🤖', anthropic: '🧠', replicate: '🔄', huggingface: '🤗',
  fal: '⚡', ollama: '🦙', stability: '🎨', custom: '⚙️',
};

const PROVIDER_DOCS: Record<string, string> = {
  openai: 'https://platform.openai.com/api-keys',
  anthropic: 'https://console.anthropic.com',
  replicate: 'https://replicate.com/account/api-tokens',
  huggingface: 'https://huggingface.co/settings/tokens',
  fal: 'https://fal.ai/dashboard/keys',
  stability: 'https://platform.stability.ai/account/keys',
  ollama: 'http://localhost:11434',
  custom: '',
};

export function AIProvider() {
  const { aiProviders, saveAIProvider, deleteAIProvider } = useApp();
  const [editing, setEditing] = useState<AIProvider | null>(null);
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [ollamaLoading, setOllamaLoading] = useState(false);
  const [ollamaError, setOllamaError] = useState('');
  const [testResult, setTestResult] = useState<string>('');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing?.type === 'ollama') {
      fetchOllamaModels();
    }
  }, [editing?.type, editing?.baseUrl]);

  const fetchOllamaModels = async () => {
    if (!editing) return;
    const port = editing.ollamaPort || 11434;
    const baseUrl = editing.baseUrl || `http://localhost:${port}`;
    setOllamaLoading(true);
    setOllamaError('');
    try {
      const response = await fetch(`${baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const models = (data.models || []).map((m: any) => m.name);
      setOllamaModels(models);
      setEditing(e => e ? { ...e, models } : e);
    } catch (err) {
      setOllamaError(`Cannot connect to Ollama at ${baseUrl}. Make sure Ollama is running locally with OLLAMA_ORIGINS=* environment variable set.`);
    }
    setOllamaLoading(false);
  };

  const testConnection = async () => {
    if (!editing) return;
    setTestResult('Testing...');
    try {
      if (editing.type === 'ollama') {
        const res = await fetch(`${editing.baseUrl || 'http://localhost:11434'}/api/tags`);
        if (res.ok) {
          const data = await res.json();
          setTestResult(`✅ Connected! Found ${data.models?.length || 0} models.`);
        } else {
          setTestResult(`❌ Failed: HTTP ${res.status}`);
        }
      } else if (editing.type === 'openai' && editing.apiKey) {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${editing.apiKey}` }
        });
        setTestResult(res.ok ? '✅ OpenAI connection successful!' : `❌ Failed: HTTP ${res.status}`);
      } else {
        setTestResult('ℹ️ Connection test not available for this provider. Please verify your API key manually.');
      }
    } catch (err) {
      setTestResult(`❌ Connection failed: ${(err as Error).message}`);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await saveAIProvider({ ...editing, updatedAt: new Date().toISOString() });
    setSaving(false);
    setEditing(null);
    setTestResult('');
  };

  const up = (key: keyof AIProvider, val: any) => setEditing(e => e ? { ...e, [key]: val } : e);

  if (editing) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {PROVIDER_ICONS[editing.type]} {editing.name}
            </h1>
            <p className="text-gray-400 text-sm">Configure AI provider connection</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setEditing(null); setTestResult(''); }}>← Back</Button>
            <Button variant="secondary" onClick={testConnection}>🔌 Test Connection</Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>💾 Save</Button>
          </div>
        </div>

        {testResult && (
          <div className={`p-3 rounded-lg text-sm ${testResult.startsWith('✅') ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/30' : testResult.startsWith('❌') ? 'bg-red-900/30 text-red-300 border border-red-700/30' : 'bg-blue-900/30 text-blue-300 border border-blue-700/30'}`}>
            {testResult}
          </div>
        )}

        <div className="space-y-4">
          <Card>
            <CardHeader><h2 className="font-semibold text-white">Connection Settings</h2></CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Provider Name</label>
                  <input
                    value={editing.name}
                    onChange={e => up('name', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Active</label>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => up('isActive', !editing.isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editing.isActive ? 'bg-violet-600' : 'bg-gray-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editing.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm text-gray-300">{editing.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    {editing.type === 'ollama' ? 'Ollama Server URL' : 'API Base URL'}
                  </label>
                  {PROVIDER_DOCS[editing.type] && (
                    <a href={PROVIDER_DOCS[editing.type]} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 hover:text-violet-300">
                      Get API Key →
                    </a>
                  )}
                </div>
                <input
                  value={editing.baseUrl || ''}
                  onChange={e => up('baseUrl', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 font-mono"
                  placeholder={editing.type === 'ollama' ? 'http://localhost:11434' : 'https://api.example.com/v1'}
                />
              </div>

              {editing.type !== 'ollama' && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">API Key</label>
                  <div className="relative flex items-center">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={editing.apiKey || ''}
                      onChange={e => up('apiKey', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg text-white px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-violet-500 font-mono"
                      placeholder="sk-..."
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 text-gray-400 hover:text-white"
                    >
                      {showKey ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              )}

              {editing.type === 'ollama' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Port</label>
                    <input
                      type="number"
                      value={editing.ollamaPort || 11434}
                      onChange={e => { up('ollamaPort', Number(e.target.value)); up('baseUrl', `http://localhost:${e.target.value}`); }}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-700/30">
                    <h4 className="text-amber-400 text-xs font-semibold mb-1">⚠️ CORS Setup Required</h4>
                    <p className="text-xs text-gray-400">Start Ollama with: <code className="text-amber-300 font-mono">OLLAMA_ORIGINS=* ollama serve</code></p>
                    <p className="text-xs text-gray-500 mt-1">This allows the webapp to communicate with your local Ollama server.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" loading={ollamaLoading} onClick={fetchOllamaModels}>
                      🔄 Refresh Model List
                    </Button>
                    {ollamaModels.length > 0 && (
                      <span className="text-xs text-emerald-400">{ollamaModels.length} models found</span>
                    )}
                  </div>

                  {ollamaError && (
                    <p className="text-xs text-red-400 bg-red-900/20 p-2 rounded">{ollamaError}</p>
                  )}

                  {ollamaModels.length > 0 && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-300">Available Models</label>
                      <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                        {ollamaModels.map(m => (
                          <button
                            key={m}
                            onClick={() => up('selectedModel', m)}
                            className={`text-xs p-2 rounded border text-left transition-all ${editing.selectedModel === m ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-gray-700 hover:border-gray-600 text-gray-400'}`}
                          >
                            🦙 {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {editing.type !== 'ollama' && editing.models.length > 0 && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Available Models</label>
                  <div className="grid grid-cols-2 gap-1">
                    {editing.models.map(m => (
                      <button
                        key={m}
                        onClick={() => up('selectedModel', m)}
                        className={`text-xs p-2 rounded border text-left transition-all ${editing.selectedModel === m ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-gray-700 hover:border-gray-600 text-gray-400'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Integration Notes</h3>
              <div className="text-xs text-gray-500 space-y-1">
                {editing.type === 'openai' && <>
                  <p>• Supports GPT-4o, DALL-E 3, and gpt-image-1 (ChatGPT Image)</p>
                  <p>• For image generation, use DALL-E 3 or gpt-image-1</p>
                  <p>• Text generation for auto-prompts uses GPT-4o</p>
                </>}
                {editing.type === 'anthropic' && <>
                  <p>• Claude models are excellent for creative prompt generation</p>
                  <p>• Claude Opus/Sonnet for high-quality prompt generation</p>
                </>}
                {editing.type === 'replicate' && <>
                  <p>• Supports FLUX.1 dev, schnell, SDXL and more</p>
                  <p>• Pay-per-use model, great for testing</p>
                </>}
                {editing.type === 'fal' && <>
                  <p>• Fast inference, supports FLUX.1 dev and pro</p>
                  <p>• Competitive pricing for high volume generation</p>
                </>}
                {editing.type === 'ollama' && <>
                  <p>• Local inference - your data stays on your machine</p>
                  <p>• Best for text models to generate prompts with AI</p>
                  <p>• Set OLLAMA_ORIGINS=* before starting Ollama</p>
                  <p>• Install models via: <code className="text-amber-300">ollama pull llama3.2</code></p>
                </>}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🤖 AI Providers</h1>
        <p className="text-gray-400 text-sm mt-1">Configure API connections for AI text and image generation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiProviders.map(provider => (
          <Card key={provider.id} hover onClick={() => { setEditing({ ...provider }); setOllamaModels(provider.models || []); }}>
            <CardBody className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{PROVIDER_ICONS[provider.type] || '⚙️'}</div>
                  <div>
                    <div className="font-medium text-white">{provider.name}</div>
                    <div className="text-xs text-gray-400 font-mono truncate max-w-32">{provider.baseUrl}</div>
                  </div>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded-full ${provider.isActive ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30' : 'bg-gray-700 text-gray-400'}`}>
                  {provider.isActive ? '● Active' : '○ Inactive'}
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-xs text-gray-500">
                  {provider.apiKey ? '🔑 API Key configured' : provider.type === 'ollama' ? '🦙 Local server' : '⚠️ No API key'}
                </div>
                {provider.selectedModel && (
                  <div className="text-xs text-violet-400">📌 {provider.selectedModel}</div>
                )}
                <div className="text-xs text-gray-500">{provider.models.length} available models</div>
              </div>
            </CardBody>
          </Card>
        ))}

        {/* Add custom provider */}
        <Card hover onClick={() => setEditing({
          id: crypto.randomUUID(),
          name: 'Custom Provider',
          type: 'custom',
          apiKey: '',
          baseUrl: '',
          models: [],
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })}>
          <CardBody className="p-4 flex items-center gap-3">
            <div className="text-2xl text-gray-600">⊕</div>
            <div>
              <div className="font-medium text-gray-400">Add Custom Provider</div>
              <div className="text-xs text-gray-600">Configure any OpenAI-compatible API</div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
