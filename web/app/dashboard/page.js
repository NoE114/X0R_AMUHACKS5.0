'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DecisionCard } from '@/components/DecisionCard';
import { FeedbackForm } from '@/components/FeedbackForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Sparkles, History, Bot, Clock3, BarChart3, Star, Hash, Settings } from 'lucide-react';
import Link from 'next/link';

const PROVIDER_LABELS = {
  openrouter: 'GPT-3.5',
  groq: 'LLaMA 3',
  anthropic: 'Claude',
  fallback: 'Fallback'
};

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState('');
  const [decisionType, setDecisionType] = useState('meal');
  const [recommendation, setRecommendation] = useState(null);
  const [chosenOption, setChosenOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('name');
    
    if (!storedToken) {
      router.push('/signin');
      return;
    }
    
    setToken(storedToken);
    setUserName(storedName || 'User');
  }, [router]);

  const fetchHistory = useCallback(async () => {
    if (!token) return;
    setHistoryLoading(true);
    try {
      const response = await fetch('/api/decisions/history?limit=12', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setHistoryItems(result.data || []);
      }
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/user/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchHistory();
    fetchStats();
  }, [token, fetchHistory, fetchStats]);

  const getRecommendation = async () => {
    if (!token) return;
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setRecommendation(null);
    setChosenOption(null);

    try {
      const params = new URLSearchParams({ type: decisionType });
      const response = await fetch(`/api/decisions/recommend?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (!result.success) {
        if (result.code === 'MISSING_API_KEY') {
          setError('Connect your AI provider API key in Settings to get personalized recommendations.');
          return;
        }
        if (result.code === 'AI_PROVIDER_ERROR') {
          setError(result.error);
          return;
        }
        throw new Error(result.error || 'Failed to get recommendation');
      }

      setRecommendation(result.data);
      // Refresh history after new recommendation
      fetchHistory();
    } catch (err) {
      if (err.message.includes('Unauthorized')) {
        localStorage.clear();
        document.cookie = 'token=; path=/; max-age=0';
        router.push('/signin');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChoose = (option) => {
    setChosenOption(option);
  };

  const handleFeedback = async ({ rating }) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          decisionId: recommendation.decisionId,
          chosenOption,
          rating
        })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit feedback');
      }

      setRecommendation(null);
      setChosenOption(null);
      setSuccessMessage('Thanks for your feedback! Your preferences have been updated.');
      setTimeout(() => setSuccessMessage(''), 4000);

      // Refresh history and stats
      fetchHistory();
      fetchStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDecision = () => {
    setRecommendation(null);
    setChosenOption(null);
    setError('');
    setSuccessMessage('');
  };

  const formatDate = (value) => {
    if (!value) return 'Just now';
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8 animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col gap-3 items-center">
            <div className="h-14 w-14 rounded-2xl bg-muted/60" />
            <div className="h-7 w-56 rounded-lg bg-muted/60" />
            <div className="h-4 w-72 rounded bg-muted/40" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card/90 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded bg-muted/60" />
                  <div className="space-y-1.5">
                    <div className="h-6 w-10 rounded bg-muted/60" />
                    <div className="h-3 w-16 rounded bg-muted/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column skeleton */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="rounded-xl border border-border/60 bg-card/90 p-6 space-y-4">
              <div className="h-5 w-32 rounded bg-muted/60" />
              <div className="h-4 w-64 rounded bg-muted/40" />
              <div className="h-10 w-full rounded-lg bg-muted/50" />
              <div className="h-10 w-full rounded-lg bg-muted/50" />
            </div>
            <div className="rounded-xl border border-border/60 bg-card/90 p-6 space-y-3">
              <div className="h-5 w-36 rounded bg-muted/60" />
              <div className="h-16 rounded-xl bg-muted/40" />
              <div className="h-16 rounded-xl bg-muted/40" />
              <div className="h-16 rounded-xl bg-muted/40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Reduce decision fatigue with AI-powered suggestions.
          </p>
        </div>

        {/* Stats Bar */}
        {stats && (stats.totalDecisions > 0 || stats.totalFeedback > 0) && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-border/60 bg-card/90">
              <CardContent className="flex items-center gap-3 py-4">
                <Hash className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalDecisions}</p>
                  <p className="text-xs text-muted-foreground">Decisions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/90">
              <CardContent className="flex items-center gap-3 py-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalFeedback}</p>
                  <p className="text-xs text-muted-foreground">Feedback</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/90">
              <CardContent className="flex items-center gap-3 py-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.averageRating ? stats.averageRating.toFixed(1) : '-'}</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          {/* Left Column: AI Suggestions */}
          <section className="space-y-6">
            <Card className="border-border/60 bg-card/90">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">AI Suggestions</CardTitle>
                  <p className="text-sm text-muted-foreground">Pick a type and get a personalized recommendation.</p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">Live</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Success Message */}
                {successMessage && (
                  <div className="p-4 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium flex items-center justify-between gap-3">
                    <span>{successMessage}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={getRecommendation}
                      className="shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Get Another
                    </Button>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                    <p className="font-medium">{error}</p>
                    {error.includes('Settings') && (
                      <Link href="/settings" className="inline-flex items-center gap-1 mt-2 text-xs underline hover:no-underline">
                        <Settings className="h-3 w-3" />
                        Go to Settings
                      </Link>
                    )}
                  </div>
                )}

                {/* Decision Type Selector */}
                {!recommendation && !chosenOption && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Decision type</Label>
                      <Select value={decisionType} onValueChange={setDecisionType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meal">What should I eat?</SelectItem>
                          <SelectItem value="task">What should I do?</SelectItem>
                          <SelectItem value="clothing">What should I wear?</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={getRecommendation}
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      {loading ? 'Thinking...' : 'Get Recommendation'}
                    </Button>
                  </div>
                )}

                {/* Decision Card */}
                {recommendation && !chosenOption && (
                  <>
                    <DecisionCard
                      type={recommendation.type}
                      options={recommendation.options}
                      aiSuggestion={recommendation.aiSuggestion}
                      confidence={recommendation.confidence}
                      context={recommendation.context}
                      providerUsed={recommendation.providerUsed}
                      onChoose={handleChoose}
                      loading={loading}
                    />
                    <Button variant="ghost" size="sm" onClick={handleNewDecision} className="w-full">
                      Try a different type
                    </Button>
                  </>
                )}

                {/* Feedback Form */}
                {chosenOption && (
                  <FeedbackForm
                    chosenOption={chosenOption}
                    onSubmit={handleFeedback}
                    loading={loading}
                  />
                )}
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>
                <Badge variant="outline">Tip</Badge>
                {' '}The more feedback you give, the better our recommendations become.
              </p>
            </div>
          </section>

          {/* Right Column: History */}
          <section className="space-y-4">
            <Card className="border-border/60 bg-card/90">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Decision History</CardTitle>
                    <p className="text-sm text-muted-foreground">Review past AI suggestions.</p>
                  </div>
                  <History className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {historyLoading && (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-16 rounded-xl bg-muted/60" />
                    <div className="h-16 rounded-xl bg-muted/60" />
                    <div className="h-16 rounded-xl bg-muted/60" />
                  </div>
                )}

                {!historyLoading && historyItems.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                    No history yet. Ask for a suggestion to get started.
                  </div>
                )}

                {!historyLoading && historyItems.length > 0 && (
                  <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
                    {historyItems.map((item) => (
                      <div
                        key={item.decisionId}
                        className="rounded-2xl border border-border/60 bg-background/70 p-4 transition hover:border-primary/40"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                            {item.type}
                          </span>
                          <Badge variant="secondary" className="bg-muted/60 text-muted-foreground">
                            {PROVIDER_LABELS[item.providerUsed] || 'AI'}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {item.chosenOption || item.aiSuggestion || item.options?.[0] || 'Suggestion'}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatDate(item.createdAt)}
                          </span>
                          <span className="flex items-center gap-2">
                            {item.rating && `Rating ${item.rating}/5`}
                            {item.rating && <span className="text-muted-foreground/60">•</span>}
                            {`${Math.round((item.confidence || 0) * 100)}% confidence`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
