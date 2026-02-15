import axios from 'axios';
import { getDecryptedApiKey } from './auth.js';

const FALLBACK_MEALS = [
  'Pizza', 'Salad', 'Burger', 'Sushi', 'Pasta', 
  'Tacos', 'Sandwich', 'Soup', 'Stir Fry', 'Curry'
];

const FALLBACK_TASKS = [
  'Exercise for 30 minutes', 'Read 10 pages', 'Meditate for 10 minutes',
  'Clean one room', 'Call a friend', 'Write in journal',
  'Learn something new', 'Plan tomorrow', 'Organize desk', 'Take a walk'
];

const FALLBACK_OUTFITS = [
  'Lightweight t-shirt with jeans',
  'Button-down shirt with chinos',
  'Cozy sweater with dark jeans',
  'Athleisure set with sneakers',
  'Oversized hoodie with joggers',
  'Casual dress with flats',
  'Linen shirt with shorts',
  'Crewneck with tailored trousers',
  'Layered jacket with denim',
  'Comfort-first basics with neutral tones'
];

export class MissingApiKeyError extends Error {
  constructor(message = 'Missing API key') {
    super(message);
    this.name = 'MissingApiKeyError';
  }
}

export class AIProviderError extends Error {
  constructor(message, provider, statusCode) {
    super(message);
    this.name = 'AIProviderError';
    this.provider = provider;
    this.statusCode = statusCode;
  }
}

function buildUserProfileContext(userData) {
  if (!userData) return '';

  const parts = [];

  // Profile
  if (userData.profile) {
    const p = userData.profile;
    if (p.age) parts.push(`Age: ${p.age}`);
    if (p.gender) parts.push(`Gender: ${p.gender}`);
    if (p.occupation) parts.push(`Occupation: ${p.occupation}`);
    if (p.livingSituation) parts.push(`Living: ${p.livingSituation}`);
  }

  // Health
  if (userData.health) {
    const h = userData.health;
    if (h.dietaryType) parts.push(`Diet: ${h.dietaryType}`);
    if (h.allergies?.length) parts.push(`Allergies: ${h.allergies.join(', ')}`);
    if (h.healthGoal) parts.push(`Health goal: ${h.healthGoal}`);
    if (h.activityLevel) parts.push(`Activity: ${h.activityLevel}`);
    if (h.eatingPattern) parts.push(`Eating pattern: ${h.eatingPattern}`);
  }

  // Work
  if (userData.work) {
    const w = userData.work;
    if (w.schedule) parts.push(`Schedule: ${w.schedule}`);
    if (w.stressLevel) parts.push(`Stress level: ${w.stressLevel}/5`);
    if (w.dailyScheduleType) parts.push(`Day type: ${w.dailyScheduleType}`);
  }

  // Food preferences
  if (userData.foodPreferences) {
    const f = userData.foodPreferences;
    if (f.cuisines?.length) parts.push(`Favorite cuisines: ${f.cuisines.join(', ')}`);
    if (f.spiceTolerance) parts.push(`Spice tolerance: ${f.spiceTolerance}/5`);
    if (f.budget) parts.push(`Food budget: ${f.budget}`);
    if (f.cookingHabits) parts.push(`Cooking: ${f.cookingHabits}`);
    if (f.eatingStyles?.length) parts.push(`Eating styles: ${f.eatingStyles.join(', ')}`);
  }

  // Clothing preferences
  if (userData.clothingPreferences) {
    const c = userData.clothingPreferences;
    if (c.fashionStyles?.length) parts.push(`Fashion styles: ${c.fashionStyles.join(', ')}`);
    if (c.weatherSensitivity) parts.push(`Weather sensitivity: ${c.weatherSensitivity}`);
    if (c.colorPreferences?.length) parts.push(`Color preferences: ${c.colorPreferences.join(', ')}`);
    if (c.comfortPriority) parts.push(`Comfort priority: ${c.comfortPriority}/5`);
    if (c.dressCode) parts.push(`Dress code: ${c.dressCode}`);
  }

  // Task style
  if (userData.taskStyle) {
    const t = userData.taskStyle;
    if (t.energyPeak) parts.push(`Energy peak: ${t.energyPeak}`);
    if (t.priorityMethod) parts.push(`Priority method: ${t.priorityMethod}`);
    if (t.workBlockDuration) parts.push(`Work blocks: ${t.workBlockDuration}`);
    if (t.procrastination) parts.push(`Procrastination tendency: ${t.procrastination}/5`);
    if (t.multitasking) parts.push(`Multitasking: ${t.multitasking}`);
  }

  // Decision style
  if (userData.decisionStyle) {
    const d = userData.decisionStyle;
    if (d.novelty) parts.push(`Novelty preference: ${d.novelty}/5`);
    if (d.budgetConsciousness) parts.push(`Budget: ${d.budgetConsciousness}`);
    if (d.timeAvailability) parts.push(`Time: ${d.timeAvailability}`);
  }

  return parts.length > 0 ? parts.join('\n') : '';
}

function getPrompt(type, context, userPreferences, userData, recentSuggestions = []) {
  const prefsString = Object.entries(userPreferences || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([opt, score]) => `${opt} (${(score * 100).toFixed(0)}%)`)
    .join(', ') || 'None yet';

  const recentString = recentSuggestions.length
    ? `Avoid repeating any of these recent suggestions:
- ${recentSuggestions.join('\n- ')}
`
    : '';

  const profileContext = buildUserProfileContext(userData);
  const profileSection = profileContext
    ? `\nUser profile:\n${profileContext}\n`
    : '';

  if (type === 'meal') {
    return `You are a helpful meal recommendation assistant. 

Context:
- Weather: ${context.weather || 'neutral'}
- Time: ${context.time || 'current'}
${profileSection}
User's past favorites: ${prefsString}
${recentString}

Suggest ONE meal option that:
1. Fits the weather and time of day
2. Respects dietary restrictions and allergies
3. Matches cuisine preferences and budget
4. Is specific and actionable (not just "pasta" but "Creamy garlic pasta with spinach")
5. Feels fresh compared to recent suggestions

Respond with ONLY the meal name/description, nothing else. Keep it under 10 words.`;
  } else if (type === 'task') {
    return `You are a helpful productivity assistant.

Context:
- Time: ${context.time || 'current'}
- Weather: ${context.weather || 'neutral'}
${profileSection}
User's past favorites: ${prefsString}
${recentString}

Suggest ONE daily task that:
1. Matches current energy level and time of day
2. Fits the user's work style and schedule
3. Takes 10-30 minutes
4. Is specific and actionable
5. Is not a repeat of recent suggestions

Respond with ONLY the task description, nothing else. Keep it under 12 words.`;
  } else if (type === 'clothing') {
    return `You are a helpful outfit recommendation assistant.

Context:
- Weather: ${context.weather || 'neutral'}
- Time: ${context.time || 'current'}
${profileSection}
User's past favorites: ${prefsString}
${recentString}

Suggest ONE outfit idea that:
1. Fits the weather conditions
2. Matches the user's style, dress code, and color preferences
3. Is specific and wearable
4. Prioritizes comfort based on user preference
5. Is different from recent outfits

Respond with ONLY the outfit description, nothing else. Keep it under 12 words.`;
  }
}

function parseAIError(error, provider) {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    throw new AIProviderError(
      `${provider} took too long to respond. Please try again.`,
      provider,
      408
    );
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 401 || status === 403) {
    throw new AIProviderError(
      `Invalid API key for ${provider}. Please update it in Settings.`,
      provider,
      status
    );
  }

  if (status === 429) {
    throw new AIProviderError(
      `${provider} rate limit exceeded. Please wait a moment and try again.`,
      provider,
      429
    );
  }

  if (status === 402) {
    throw new AIProviderError(
      `${provider} account has insufficient credits. Please top up your account.`,
      provider,
      402
    );
  }

  if (status >= 500) {
    throw new AIProviderError(
      `${provider} is currently experiencing issues. Please try again later.`,
      provider,
      status
    );
  }

  const msg = data?.error?.message || data?.error || error.message || 'Unknown error';
  throw new AIProviderError(
    `${provider} error: ${msg}`,
    provider,
    status || 500
  );
}

export async function getAISuggestion(userId, type, context, userPreferences, preferredProvider = 'openrouter', userData = null, recentSuggestions = []) {
  const provider = preferredProvider || 'openrouter';
  const apiKey = await getDecryptedApiKey(userId, provider);

  if (!apiKey) {
    throw new MissingApiKeyError('Connect your AI provider API key in Settings to get personalized recommendations.');
  }

  const prompt = getPrompt(type, context, userPreferences, userData, recentSuggestions);
  let suggestion = null;

  if (provider === 'openrouter') {
    suggestion = await getOpenRouterSuggestion(apiKey, prompt);
  } else if (provider === 'groq') {
    suggestion = await getGroqSuggestion(apiKey, prompt);
  } else if (provider === 'anthropic') {
    suggestion = await getAnthropicSuggestion(apiKey, prompt);
  } else {
    throw new AIProviderError(`Unknown provider: ${provider}`, provider, 400);
  }

  if (!suggestion) {
    throw new AIProviderError(
      `${provider} returned an empty response. Please try again.`,
      provider,
      500
    );
  }

  return { suggestion, provider };
}

export function getFallbackOptions(type) {
  if (type === 'meal') return FALLBACK_MEALS;
  if (type === 'task') return FALLBACK_TASKS;
  if (type === 'clothing') return FALLBACK_OUTFITS;
  return [];
}

async function getOpenRouterSuggestion(apiKey, prompt) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 80
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Swiftion'
        },
        timeout: 15000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (content) {
      return content.trim().replace(/^["']|["']$/g, '').trim();
    }
    return null;
  } catch (error) {
    parseAIError(error, 'OpenRouter');
  }
}

async function getGroqSuggestion(apiKey, prompt) {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 80
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (content) {
      return content.trim().replace(/^["']|["']$/g, '').trim();
    }
    return null;
  } catch (error) {
    parseAIError(error, 'Groq');
  }
}

async function getAnthropicSuggestion(apiKey, prompt) {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 80,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: 15000
      }
    );

    const text = response.data?.content?.[0]?.text;
    if (text) {
      return text.trim().replace(/^["']|["']$/g, '').trim();
    }
    return null;
  } catch (error) {
    parseAIError(error, 'Anthropic');
  }
}
