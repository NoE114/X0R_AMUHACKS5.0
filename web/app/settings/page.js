'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Settings as SettingsIcon, Camera, Trash2 } from 'lucide-react';

const PROVIDERS = {
  openrouter: {
    label: 'OpenRouter',
    description: 'Balanced throughput and cost with multi-model access.'
  },
  groq: {
    label: 'Groq',
    description: 'Low-latency inference optimized for fast decisions.'
  },
  anthropic: {
    label: 'Anthropic Claude',
    description: 'Safety-first assistant with conversational tone control.'
  }
};

export default function SettingsPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [preferredProvider, setPreferredProvider] = useState('openrouter');
  const [activeProvider, setActiveProvider] = useState('openrouter');
  const [providerLoading, setProviderLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [profileStatus, setProfileStatus] = useState('idle');
  const [profileMessage, setProfileMessage] = useState('');
  const [providerStatus, setProviderStatus] = useState('idle');
  const [providerMessage, setProviderMessage] = useState('');
  const [name, setName] = useState('');
  const [profilePhotoData, setProfilePhotoData] = useState('');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!storedToken) {
      router.replace('/signin');
      return;
    }
    setToken(storedToken);
    fetchProvider(storedToken, undefined, false, true);
  }, [router]);

  const handleProviderSelect = (providerKey) => {
    setPreferredProvider(providerKey);
    if (token) {
      fetchProvider(token, providerKey);
    }
  };

  const fetchProvider = async (authToken, provider, reveal = false, initial = false) => {
    setProviderLoading(true);
    try {
      const query = new URLSearchParams();
      if (provider) query.set('provider', provider);
      if (reveal) query.set('reveal', 'true');
      const response = await fetch(`/api/auth/provider-settings?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Could not load provider');
      if (initial && result.data.preferredProvider) {
        setPreferredProvider(result.data.preferredProvider);
      }
      if (result.data.requestedProvider) {
        setActiveProvider(result.data.requestedProvider);
      }
      setName(result.data.name || '');
      const photoData = result.data.profilePhoto || '';
      setProfilePhotoPreview(photoData);
      setProfilePhotoData(photoData);
      setHasSavedKey(result.data.hasApiKey);
      if (reveal && result.data.apiKey) {
        setApiKey(result.data.apiKey);
      } else {
        if (!initial) {
          setApiKey('');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProviderLoading(false);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setProfilePhotoPreview('');
      setProfilePhotoData('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Profile photo must be 5 MB or smaller');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const value = reader.result?.toString() ?? '';
      setProfilePhotoPreview(value);
      setProfilePhotoData(value);
      setPhotoError('');
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoRemove = () => {
    setProfilePhotoPreview('');
    setProfilePhotoData('');
    setPhotoError('');
  };

  const patchProviderSettings = async (payload) => {
    if (!token) throw new Error('Missing auth token');
    const response = await fetch('/api/auth/provider-settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Could not save settings');
    }
    return result.data;
  };

  const handleProfileSave = async () => {
    if (!token) return;
    setProfileStatus('loading');
    setProfileMessage('');
    const trimmedName = name.trim();
    try {
      const result = await patchProviderSettings({
        provider: preferredProvider,
        name: trimmedName || undefined,
        profilePhoto: profilePhotoData || undefined
      });
      const photo = result.profilePhoto || '';
      if (photo) {
        setProfilePhotoPreview(photo);
        setProfilePhotoData(photo);
      }
      setName(result.name || trimmedName);
      setProfileStatus('success');
      setProfileMessage('Profile saved');
      if (typeof window !== 'undefined') {
        const storedName = result.name || trimmedName;
        localStorage.setItem('name', storedName);
        if (photo) {
          localStorage.setItem('profilePhoto', photo);
        } else {
          localStorage.removeItem('profilePhoto');
        }
        window.dispatchEvent(new Event('auth-change'));
      }
      setTimeout(() => setProfileStatus('idle'), 1500);
    } catch (error) {
      console.error(error);
      setProfileStatus('error');
      setProfileMessage('Profile save failed');
    }
  };

  const handleProviderSave = async () => {
    if (!token) return;
    setProviderStatus('loading');
    setProviderMessage('');
    const trimmedKey = apiKey.trim();
    const payload = { provider: preferredProvider };
    if (trimmedKey) {
      payload.apiKey = trimmedKey;
    }
    try {
      await patchProviderSettings(payload);
      setProviderStatus('success');
      setProviderMessage(`Saved ${PROVIDERS[preferredProvider].label}`);
      setShowKey(false);
      setApiKey('');
      await fetchProvider(token, preferredProvider);
      setTimeout(() => setProviderStatus('idle'), 1500);
    } catch (error) {
      console.error(error);
      setProviderStatus('error');
      setProviderMessage('Provider save failed');
    }
  };

  const toggleShowKey = async () => {
    if (!token) return;
    const nextShowKey = !showKey;
    if (nextShowKey && hasSavedKey && !apiKey) {
      setProviderLoading(true);
      try {
        await fetchProvider(token, preferredProvider, true);
      } finally {
        setProviderLoading(false);
      }
    }
    setShowKey(nextShowKey);
  };

  const initials = (name || 'You')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="flex-1 bg-background/80">
      <section className="relative overflow-hidden pt-16 pb-10">
        <div className="container mx-auto px-4 overflow-x-hidden">
          <div className="mb-12 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar>
                {profilePhotoPreview ? (
                  <AvatarImage src={profilePhotoPreview} alt={name || 'User avatar'} />
                ) : (
                  <AvatarFallback>{initials}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Account</p>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Keep your preferences in sync with your routine.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-foreground"
            >
              <SettingsIcon className="h-4 w-4" />
              Dashboard
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 items-stretch">
            <Card className="h-full w-full flex flex-col">
              <CardContent className="flex flex-col gap-6 flex-1 min-w-0">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="settings-name">Full name</Label>
                    <Input
                      id="settings-name"
                      placeholder="Your name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between text-sm font-semibold text-foreground">
                      <span>Profile photo</span>
                      {photoError && <span className="text-xs text-destructive">{photoError}</span>}
                    </Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label
                        htmlFor="photo-upload"
                        className="flex items-center gap-2 rounded-2xl border border-dashed border-border/70 bg-background/70 px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary"
                      >
                        <Camera className="h-5 w-5" />
                        <span>Upload photo</span>
                      </label>
                      {profilePhotoPreview && (
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border/60">
                          <img src={profilePhotoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={handlePhotoRemove}
                            className="absolute right-1 top-1 rounded-full bg-card/80 p-1 text-muted-foreground"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="sr-only"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Button
                    onClick={handleProfileSave}
                    className="shrink-0 rounded-2xl border-none px-6 from-primary to-secondary/80 text-sm font-semibold"
                    disabled={profileStatus === 'loading'}
                  >
                    {profileStatus === 'loading' ? 'Saving…' : 'Save profile'}
                  </Button>
                  <p className="w-full sm:flex-1 truncate text-xs text-muted-foreground">
                    {profileMessage || 'Name and photo power your avatar.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full w-full flex flex-col bg-card/80 border border-border/60">
              <CardContent className="flex flex-col gap-6 flex-1 min-w-0">
                <div className="flex-1 space-y-6">
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {Object.entries(PROVIDERS).map(([key, provider]) => {
                      const isSelected = preferredProvider === key;
                      const isActive = activeProvider === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleProviderSelect(key)}
                          className={`flex flex-col gap-1 rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? 'border-primary/80 bg-primary/10 shadow-lg shadow-primary/30'
                              : 'border-border/40 bg-background/60 hover:border-primary/70'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted-foreground">
                            <span>Provider</span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">{provider.label}</h3>
                          <p className="text-xs text-muted-foreground">{provider.description}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                      <span>API Key</span>
                      <span className="text-xs text-muted-foreground">Encrypted + per provider</span>
                    </div>
                    <div className="relative">
                      <Input
                        id="settings-api-key"
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                        className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm pr-12"
                        disabled={providerLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleShowKey}
                        aria-label={showKey ? 'Hide API key' : 'Show API key'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/70"
                        disabled={providerLoading}
                      >
                        {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Button
                    onClick={handleProviderSave}
                    className="shrink-0 rounded-2xl border-none px-6 from-primary to-secondary/80 text-sm font-semibold"
                    disabled={providerStatus === 'loading'}
                  >
                    {providerStatus === 'loading' ? 'Saving…' : 'Save provider key'}
                  </Button>
                  <p className="w-full sm:flex-1 truncate text-xs text-muted-foreground">
                    {providerMessage || 'Keys are encrypted and never shared.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </section>
    </main>
  );
}
