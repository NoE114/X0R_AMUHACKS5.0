'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ShieldCheck, Sparkles, Camera } from 'lucide-react';

const PROVIDERS = [
  {
    value: 'openrouter',
    label: 'OpenRouter',
    description: 'Fast multi-model access with reliable throughput and usage insights.'
  },
  {
    value: 'groq',
    label: 'Groq',
    description: 'Ultra-low latency inference tailored for complex reasoning flows.'
  },
  {
    value: 'anthropic',
    label: 'Anthropic Claude',
    description: 'Safety-first assistant that keeps conversations grounded and helpful.'
  }
];

const SECTION_TITLES = [
  'Basic Profile (30 sec)',
  'Health & Dietary (45 sec)',
  'Work & Schedule (40 sec)',
  'Food Preferences (60 sec)',
  'Clothing Preferences (45 sec)',
  'Task Management Style (40 sec)',
  'Decision-Making Style (30 sec)'
];

const fieldLabelClass = 'text-xs uppercase tracking-[0.4em] text-muted-foreground font-semibold';
const fieldControlClass = 'w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition focus:border-primary focus:ring-0';
const selectTriggerClass = 'w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition focus:border-primary focus:ring-0';
const sectionCardClass = 'space-y-6 rounded-[24px] border border-border/20 bg-transparent p-6 shadow-[0_20px_35px_rgba(15,23,42,0.1)]';
const pillBaseClass = 'inline-flex items-center justify-center rounded-full border px-3 py-2 min-h-[40px] text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60';
const getPillClass = (active) =>
  `${pillBaseClass} ${active ? 'border-primary bg-primary text-white shadow-lg' : 'border-border/60 bg-background/80 text-foreground hover:border-foreground/70'}`;

const getOptionValue = (option) => (typeof option === 'string' ? option : option.value);
const getOptionLabel = (option) => (typeof option === 'string' ? option : option.label ?? option.value);

const allergiesOptions = [
  'None',
  'Lactose intolerant',
  'Gluten-free',
  'Nut allergy',
  'Shellfish allergy',
  'Other'
];

const cuisineOptions = [
  'Indian (North)',
  'Indian (South)',
  'Chinese',
  'Italian',
  'Mexican',
  'Thai',
  'Japanese',
  'Mediterranean',
  'American/Fast food',
  'Middle Eastern',
  'Korean',
  'Continental',
  'Other'
];

const eatingStyles = [
  'Quick meals (under 15 min)',
  'Sit-down dining',
  'Street food',
  'Fine dining (occasional)',
  'Meal prep/batch cooking',
  'Home-cooked food'
];

const fashionStyles = [
  'Casual (jeans, t-shirts)',
  'Smart casual',
  'Formal/business',
  'Sporty/athleisure',
  'Trendy/fashionable',
  'Minimalist',
  'Traditional/ethnic',
  'Comfortable above all'
];

const colorOptions = [
  'Neutrals (black, white, grey, beige)',
  'Blues',
  'Earth tones (brown, green, olive)',
  'Bold colors (red, yellow, orange)',
  'Pastels',
  'All-black everything',
  'No preference'
];

const dietaryTypes = ['Non-vegetarian', 'Vegetarian', 'Vegan', 'Pescatarian', 'Flexitarian'];
const healthGoals = [
  'Weight loss',
  'Muscle gain/fitness',
  'Maintain current weight',
  'Heart health',
  'Diabetes management',
  'No specific goal'
];
const activityLevels = [
  { label: 'Sedentary', value: 'Sedentary (desk job, minimal exercise)' },
  { label: 'Lightly active', value: 'Lightly active (light exercise 1-3 days/week)' },
  { label: 'Moderately active', value: 'Moderately active (exercise 3-5 days/week)' },
  { label: 'Very active', value: 'Very active (intense exercise 6-7 days/week)' }
];
const eatingPatterns = [
  { label: '3 regular meals', value: '3 regular meals' },
  { label: '5-6 small meals', value: '5-6 small meals (frequent snacker)' },
  { label: '2 meals + snacks', value: '2 meals + snacks' },
  { label: 'Intermittent fasting', value: 'Intermittent fasting' },
  { label: 'Irregular/varies', value: 'Irregular/varies' }
];

const workScheduleOptions = [
  { label: '9 AM - 5 PM', value: '9 AM - 5 PM (standard)' },
  { label: '10 AM - 6 PM', value: '10 AM - 6 PM' },
  { label: 'Flexible hours', value: 'Flexible hours' },
  { label: 'Night shift', value: 'Night shift' },
  { label: 'Freelance/variable', value: 'Freelance/variable' },
  { label: 'Student schedule', value: 'Student schedule' },
  { label: 'Unemployed/Retired', value: 'Unemployed/Retired' }
];
const workLocationOptions = [
  { label: 'Home (WFH)', value: 'Home (WFH/online classes)' },
  { label: 'Office/Campus', value: 'Office/Campus' },
  { label: 'Hybrid (3-4 days)', value: 'Hybrid (3-4 days office)' },
  { label: 'Hybrid (1-2 days)', value: 'Hybrid (1-2 days office)' }
];
const commuteOptions = [
  { label: 'No commute (WFH)', value: 'No commute (WFH)' },
  { label: '0-15 minutes', value: '0-15 minutes' },
  { label: '15-30 minutes', value: '15-30 minutes' },
  { label: '30-60 minutes', value: '30-60 minutes' },
  { label: '60+ minutes', value: '60+ minutes' }
];
const lunchBreakOptions = [
  { label: '30 minutes', value: '30 minutes' },
  { label: '45 minutes', value: '45 minutes' },
  { label: '1 hour', value: '1 hour' },
  { label: '1+ hours', value: 'More than 1 hour' },
  { label: 'Flexible/no fixed', value: 'Flexible/no fixed time' }
];
const dailyScheduleOptions = [
  'Meetings/classes heavy',
  'Deep focus work',
  'Mix of both',
  'Mostly customer-facing',
  'Physical/hands-on work'
];

const budgetOptions = [
  { label: '₹50-100', value: '₹50-100 (very budget)' },
  { label: '₹100-200', value: '₹100-200 (budget-conscious)' },
  { label: '₹200-300', value: '₹200-300 (moderate)' },
  { label: '₹300-500', value: '₹300-500 (comfortable)' },
  { label: '₹500+', value: '₹500+ (flexible)' }
];
const cookingHabitOptions = [
  { label: 'Never cook', value: 'Never cook (always eat out/order)' },
  { label: 'Rarely cook', value: 'Rarely cook (1-2 times/week)' },
  { label: 'Sometimes cook', value: 'Sometimes cook (3-4 times/week)' },
  { label: 'Often cook', value: 'Often cook (5-6 times/week)' },
  { label: 'Always cook', value: 'Always cook at home' }
];

const weatherSensitivityOptions = [
  { label: 'Very sensitive', value: 'Very sensitive (layer up/down frequently)' },
  { label: 'Moderately sensitive', value: 'Moderately sensitive' },
  { label: 'Not very sensitive', value: 'Not very sensitive (same clothes most temps)' }
];
const dressCodeOptions = [
  { label: 'Very formal', value: 'Very formal (suit/tie, formal attire)' },
  { label: 'Business casual', value: 'Business casual' },
  { label: 'Smart casual', value: 'Smart casual' },
  { label: 'Casual', value: 'Casual (anything goes)' },
  { label: 'Uniform required', value: 'Uniform required' },
  { label: 'Not applicable', value: 'Not applicable' }
];

const energyPeakOptions = [
  { label: 'Morning (5-11 AM)', value: 'Morning person (5 AM - 11 AM)' },
  { label: 'Midday (11-3 PM)', value: 'Midday peak (11 AM - 3 PM)' },
  { label: 'Afternoon (3-7 PM)', value: 'Afternoon (3 PM - 7 PM)' },
  { label: 'Night (7-midnight)', value: 'Night owl (7 PM - midnight)' },
  { label: 'Late night', value: 'Late night (after midnight)' }
];
const priorityOptions = [
  { label: 'Urgency first', value: 'Urgency first (closest deadline)' },
  { label: 'Importance first', value: 'Importance first (highest impact)' },
  { label: 'Easiest first', value: 'Easiest first (quick wins)' },
  { label: 'Hardest first', value: 'Hardest first (eat the frog)' },
  { label: 'Mix it up', value: 'Mix it up based on mood' }
];
const workBlockOptions = [
  { label: 'Short bursts (15-25)', value: 'Short bursts (15-25 min, Pomodoro style)' },
  { label: 'Medium blocks (45-60)', value: 'Medium blocks (45-60 min)' },
  { label: 'Long blocks (2+ hrs)', value: 'Long blocks (2+ hours deep work)' },
  { label: 'Varies by task', value: 'Varies by task' }
];
const multitaskingOptions = [
  { label: 'Prefer multitasking', value: 'Prefer multitasking' },
  { label: 'Prefer single-tasking', value: 'Prefer single-tasking (one thing at a time)' },
  { label: 'Depends on task', value: 'Depends on task type' }
];

const budgetConsciousnessOptions = [
  { label: 'Very strict', value: 'Very strict (track every rupee)' },
  { label: 'Moderately careful', value: 'Moderately careful' },
  { label: 'Flexible', value: 'Flexible (don\'t stress about small amounts)' },
  { label: 'Not concerned', value: 'Not concerned about budget' }
];
const timeAvailabilityOptions = ['Always rushed', 'Usually have some time', 'Generally relaxed schedule', 'Varies day to day'];
const decisionConfidenceOptions = [
  { label: 'Very decisive', value: 'Very decisive (make decisions quickly)' },
  { label: 'Moderately decisive', value: 'Moderately decisive' },
  { label: 'Often second-guess', value: 'Often second-guess myself' },
  { label: 'Very indecisive', value: 'Very indecisive (struggle with choices)' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [providerSection, setProviderSection] = useState({
    provider: 'openrouter',
    apiKey: '',
    profilePhoto: ''
  });
  const [form, setForm] = useState({
    profile: {
      age: 25,
      gender: 'Male',
      occupation: 'Software Engineer',
      occupationOther: '',
      location: '',
      livingSituation: 'Live alone'
    },
    health: {
      dietaryType: 'Non-vegetarian',
      allergies: ['None'],
      allergyOther: '',
      healthGoal: 'Maintain current weight',
      activityLevel: 'Moderately active (exercise 3-5 days/week)',
      eatingPattern: '3 regular meals'
    },
    work: {
      schedule: '9 AM - 5 PM (standard)',
      location: 'Office/Campus',
      commuteTime: '0-15 minutes',
      lunchBreak: '45 minutes',
      stressLevel: 3,
      dailyScheduleType: 'Mix of both'
    },
    foodPreferences: {
      cuisines: ['Indian (North)'],
      cuisineOther: '',
      spiceTolerance: 3,
      budget: '₹200-300 (moderate)',
      mealTimings: {
        breakfast: '07:30',
        lunch: '13:00',
        dinner: '20:00'
      },
      cookingHabits: 'Sometimes cook (3-4 times/week)',
      eatingStyles: ['Quick meals (under 15 min)']
    },
    clothingPreferences: {
      fashionStyles: ['Casual (jeans, t-shirts)'],
      weatherSensitivity: 'Moderately sensitive',
      colorPreferences: ['Neutrals (black, white, grey, beige)'],
      comfortPriority: 3,
      dressCode: 'Smart casual'
    },
    taskStyle: {
      energyPeak: 'Morning person (5 AM - 11 AM)',
      priorityMethod: 'Importance first (highest impact)',
      workBlockDuration: 'Medium blocks (45-60 min)',
      procrastination: 3,
      multitasking: 'Prefer single-tasking (one thing at a time)'
    },
    decisionStyle: {
      novelty: 3,
      budgetConsciousness: 'Moderately careful',
      timeAvailability: 'Usually have some time',
      decisionConfidence: 'Moderately decisive'
    }
  });

  useEffect(() => {
    const storedName = typeof window !== 'undefined' ? localStorage.getItem('name') : '';
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    setDisplayName(storedName || 'You');
    if (!storedToken) {
      router.replace('/signin');
      return;
    }
    setToken(storedToken);
  }, [router]);

  const handleProviderPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setProviderSection((prev) => ({ ...prev, profilePhoto: '' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile photo must be 5 MB or smaller');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProviderSection((prev) => ({ ...prev, profilePhoto: reader.result?.toString() || '' }));
    };
    reader.readAsDataURL(file);
  };

  const toggleMultiSelect = (sectionKey, field, value, limit, exclusiveValue) => {
    setError('');
    setForm((prev) => {
      const current = prev[sectionKey][field];
      const hasValue = current.includes(value);
      let next = hasValue ? current.filter((item) => item !== value) : [...current];
      if (!hasValue) {
        if (exclusiveValue && value === exclusiveValue) {
          next = [exclusiveValue];
        } else {
          next = next.filter((item) => item !== exclusiveValue);
          if (limit && next.length >= limit) {
            setError(`You can select up to ${limit} options.`);
            return prev;
          }
          next.push(value);
        }
      }
      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [field]: next
        }
      };
    });
  };

  const validateSection = () => {
    setError('');
    if (sectionIndex === 0) return true;
    const keys = [
      'profile',
      'health',
      'work',
      'foodPreferences',
      'clothingPreferences',
      'taskStyle',
      'decisionStyle'
    ];
    const key = keys[sectionIndex - 1];
    const values = form[key];
    if (!values) return true;
    for (const [field, value] of Object.entries(values)) {
      if (field === 'occupationOther' || field === 'allergyOther' || field === 'cuisineOther') continue;
      if (Array.isArray(value) && value.length === 0) {
        setError('Please make sure every section is complete before continuing.');
        return false;
      }
      if (!Array.isArray(value) && (value === '' || value === null || value === undefined)) {
        setError('Please make sure every section is complete before continuing.');
        return false;
      }
    }
    if (key === 'profile' && form.profile.occupation === 'Other' && !form.profile.occupationOther) {
      setError('Tell us how you describe your work when selecting Other.');
      return false;
    }
    if (key === 'health' && form.health.allergies.includes('Other') && !form.health.allergyOther) {
      setError('Tell us the other allergy or restriction.');
      return false;
    }
    if (key === 'foodPreferences' && form.foodPreferences.cuisines.includes('Other') && !form.foodPreferences.cuisineOther) {
      setError('Tell us your other favorite cuisine.');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (sectionIndex === 0) {
      setSectionIndex(1);
      return;
    }
    if (!validateSection()) {
      return;
    }
    const isLastSection = sectionIndex === SECTION_TITLES.length;
    if (isLastSection) {
      await submitOnboarding();
      return;
    }
    setSectionIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (sectionIndex === 0) return;
    setError('');
    setSectionIndex((prev) => prev - 1);
  };

  const submitOnboarding = async () => {
    if (!token) {
      router.replace('/signin');
      return;
    }
    setIsSubmitting(true);
    setStatus('loading');
    setError('');
    try {
      const trimmedApiKey = providerSection.apiKey.trim();
      const payload = {
        provider: providerSection.provider,
        ...(trimmedApiKey ? { apiKey: trimmedApiKey } : {}),
        ...(providerSection.profilePhoto ? { profilePhoto: providerSection.profilePhoto } : {}),
        onboarding: form
      };

      const response = await fetch('/api/auth/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Could not save onboarding data');
      }
      window.dispatchEvent(new Event('auth-change'));
      setStatus('success');
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createSectionHeader = () => (
    <div className="space-y-2 text-center">
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        Onboarding
      </div>
      <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
        Shape your AI workspace to match how you make choices
      </h1>
      <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
        Complete all sections in order; you can adjust everything later from Settings once you land on the
        dashboard.
      </p>
    </div>
  );

  const renderProviderSection = () => (
    <Card className="w-full max-w-3xl self-center overflow-hidden rounded-[32px] border border-border/60 bg-card/90 shadow-[0_20px_80px_rgba(29,78,216,0.35)]">
      <CardContent className="space-y-6 p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          {PROVIDERS.map((option) => {
            const isSelected = providerSection.provider === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setProviderSection((prev) => ({ ...prev, provider: option.value }))}
                className={`flex h-full flex-col justify-between rounded-2xl border p-4 text-left transition hover:border-primary/70 ${
                  isSelected
                    ? 'border-primary bg-linear-to-br from-primary/20 to-primary/10 shadow-lg'
                    : 'border-border/60 bg-background/70'
                }`}
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Provider</p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{option.label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                    {option.description}
                  </p>
                </div>
                {isSelected && (
                  <Badge variant="secondary" className="text-[11px]">
                    Selected
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-foreground">
            <span>Provider API Key</span>
            <span className="text-xs text-muted-foreground">Optional · encrypted per provider</span>
          </div>
          <Input
            id="api-key"
            type="password"
            value={providerSection.apiKey}
            placeholder="sk-..."
            onChange={(event) => setProviderSection((prev) => ({ ...prev, apiKey: event.target.value }))}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm"
          />
          <p className="text-xs text-muted-foreground">Skip for now and add it later from Settings if needed.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-foreground">
            <span>Profile Photo</span>
            <span className="text-xs text-muted-foreground">5 MB max</span>
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="photo-upload"
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-dashed border-border/60 bg-background/70 px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary"
            >
              <span>Upload PNG/JPG</span>
              <Camera className="h-5 w-5 text-primary" />
            </label>
            {providerSection.profilePhoto && (
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border/60">
                <img
                  src={providerSection.profilePhoto}
                  alt="Uploaded preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleProviderPhoto}
            className="sr-only"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderFormSection = () => {
    if (sectionIndex === 0) return null;
    const sectionKey = [
      'profile',
      'health',
      'work',
      'foodPreferences',
      'clothingPreferences',
      'taskStyle',
      'decisionStyle'
    ][sectionIndex - 1];
    const sectionData = form[sectionKey];
    const renderPills = (field, options, limit, exclusiveValue) => {
      const selected = sectionData[field] ?? [];
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => toggleMultiSelect(sectionKey, field, option, limit, exclusiveValue)}
              className={getPillClass(selected.includes(option))}
            >
              {option}
            </button>
          ))}
        </div>
      );
    };
    switch (sectionKey) {
      case 'profile':
        return (
          <div className={sectionCardClass}>
            <div className="space-y-3">
              <Label className={fieldLabelClass}>Full name</Label>
              <Input value={displayName} disabled className={fieldControlClass} />
            </div>
            <div className="space-y-3">
              <Label htmlFor="age" className={fieldLabelClass}>
                Age
              </Label>
              <Input
                id="age"
                type="number"
                min={3}
                max={120}
                className={fieldControlClass}
                value={sectionData.age}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, age: Number(event.target.value) }
                  }))
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Gender</Label>
                <Select
                  value={sectionData.gender}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, gender: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Occupation</Label>
                <Select
                  value={sectionData.occupation}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, occupation: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'Student',
                      'Software Engineer',
                      'Business Professional',
                      'Designer/Creative',
                      'Healthcare Worker',
                      'Teacher/Professor',
                      'Entrepreneur',
                      'Homemaker',
                      'Other'
                    ].map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {sectionData.occupation === 'Other' && (
              <div className="space-y-3">
                <Label htmlFor="occupationOther" className={fieldLabelClass}>
                  Describe occupation
                </Label>
                <Input
                  id="occupationOther"
                  className={fieldControlClass}
                  value={sectionData.occupationOther}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, occupationOther: event.target.value }
                    }))
                  }
                />
              </div>
            )}
            <div className="space-y-3">
              <Label htmlFor="location" className={fieldLabelClass}>
                City / Location
              </Label>
              <Input
                id="location"
                className={fieldControlClass}
                value={sectionData.location}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, location: event.target.value }
                  }))
                }
              />
            </div>
            <div className="space-y-3">
              <Label className={fieldLabelClass}>Living situation</Label>
              <Select
                value={sectionData.livingSituation}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, livingSituation: value }
                  }))
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Living situation" />
                </SelectTrigger>
                <SelectContent>
                  {['Live alone', 'With roommates', 'With family', 'With partner'].map((option) => (
                    <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                      {getOptionLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'health':
        return (
          <div className={sectionCardClass}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Dietary type</Label>
                <Select
                  value={sectionData.dietaryType}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      health: { ...prev.health, dietaryType: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick dietary type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dietaryTypes.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Health goal</Label>
                <Select
                  value={sectionData.healthGoal}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      health: { ...prev.health, healthGoal: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthGoals.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Activity level</Label>
                <Select
                  value={sectionData.activityLevel}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      health: { ...prev.health, activityLevel: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityLevels.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Eating pattern</Label>
                <Select
                  value={sectionData.eatingPattern}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      health: { ...prev.health, eatingPattern: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {eatingPatterns.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Allergies & restrictions</Label>
                <span className="text-xs text-muted-foreground">Select up to 3</span>
              </div>
              {renderPills('allergies', allergiesOptions, 3, 'None')}
            </div>
            {sectionData.allergies.includes('Other') && (
              <div className="space-y-3">
                <Label htmlFor="allergyOther" className={fieldLabelClass}>
                  Tell us the other restriction
                </Label>
                <Input
                  id="allergyOther"
                  className={fieldControlClass}
                  value={sectionData.allergyOther}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      health: { ...prev.health, allergyOther: event.target.value }
                    }))
                  }
                />
              </div>
            )}
          </div>
        );
      case 'work':
        return (
          <div className={sectionCardClass}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Work schedule</Label>
                <Select
                  value={sectionData.schedule}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      work: { ...prev.work, schedule: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {workScheduleOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Work location</Label>
                <Select
                  value={sectionData.location}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      work: { ...prev.work, location: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick location" />
                  </SelectTrigger>
                  <SelectContent>
                    {workLocationOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Commute time</Label>
                <Select
                  value={sectionData.commuteTime}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      work: { ...prev.work, commuteTime: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick commute" />
                  </SelectTrigger>
                  <SelectContent>
                    {commuteOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Lunch break</Label>
                <Select
                  value={sectionData.lunchBreak}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      work: { ...prev.work, lunchBreak: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick break" />
                  </SelectTrigger>
                  <SelectContent>
                    {lunchBreakOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Stress level</Label>
                <span className="text-xs text-muted-foreground">{sectionData.stressLevel}/5</span>
              </div>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[sectionData.stressLevel]}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    work: { ...prev.work, stressLevel: value[0] }
                  }))
                }
              />
            </div>
            <div className="space-y-3">
              <Label className={fieldLabelClass}>Daily schedule</Label>
              <Select
                value={sectionData.dailyScheduleType}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    work: { ...prev.work, dailyScheduleType: value }
                  }))
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Pick vibe" />
                </SelectTrigger>
                <SelectContent>
                  {dailyScheduleOptions.map((option) => (
                    <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                      {getOptionLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'foodPreferences':
        return (
          <div className={sectionCardClass}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Favourite cuisines</Label>
                <span className="text-xs text-muted-foreground">Pick up to 4</span>
              </div>
              {renderPills('cuisines', cuisineOptions, 4)}
            </div>
            {sectionData.cuisines.includes('Other') && (
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Other cuisine</Label>
                <Input
                  className={fieldControlClass}
                  value={sectionData.cuisineOther}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      foodPreferences: { ...prev.foodPreferences, cuisineOther: event.target.value }
                    }))
                  }
                />
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Budget</Label>
                <Select
                  value={sectionData.budget}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      foodPreferences: { ...prev.foodPreferences, budget: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Cooking frequency</Label>
                <Select
                  value={sectionData.cookingHabits}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      foodPreferences: { ...prev.foodPreferences, cookingHabits: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick habits" />
                  </SelectTrigger>
                  <SelectContent>
                    {cookingHabitOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Spice tolerance</Label>
                <span className="text-xs text-muted-foreground">{sectionData.spiceTolerance}/5</span>
              </div>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[sectionData.spiceTolerance]}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    foodPreferences: { ...prev.foodPreferences, spiceTolerance: value[0] }
                  }))
                }
              />
            </div>
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {['breakfast', 'lunch', 'dinner'].map((meal) => (
                <div key={meal} className="space-y-3">
                  <Label className={fieldLabelClass}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</Label>
                  <Input
                    type="time"
                    className={fieldControlClass}
                    value={sectionData.mealTimings[meal]}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        foodPreferences: {
                          ...prev.foodPreferences,
                          mealTimings: { ...prev.foodPreferences.mealTimings, [meal]: event.target.value }
                        }
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Eating styles</Label>
                <span className="text-xs text-muted-foreground">Pick up to 3</span>
              </div>
              {renderPills('eatingStyles', eatingStyles, 3)}
            </div>
          </div>
        );
      case 'clothingPreferences':
        return (
          <div className={sectionCardClass}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Fashion styles</Label>
                <span className="text-xs text-muted-foreground">Pick up to 3</span>
              </div>
              {renderPills('fashionStyles', fashionStyles, 3)}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Weather sensitivity</Label>
                <Select
                  value={sectionData.weatherSensitivity}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      clothingPreferences: { ...prev.clothingPreferences, weatherSensitivity: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    {weatherSensitivityOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Dress code</Label>
                <Select
                  value={sectionData.dressCode}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      clothingPreferences: { ...prev.clothingPreferences, dressCode: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick dress code" />
                  </SelectTrigger>
                  <SelectContent>
                    {dressCodeOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Color preferences</Label>
                <span className="text-xs text-muted-foreground">Pick up to 3</span>
              </div>
              {renderPills('colorPreferences', colorOptions, 3)}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Comfort priority</Label>
                <span className="text-xs text-muted-foreground">{sectionData.comfortPriority}/5</span>
              </div>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[sectionData.comfortPriority]}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    clothingPreferences: { ...prev.clothingPreferences, comfortPriority: value[0] }
                  }))
                }
              />
            </div>
          </div>
        );
      case 'taskStyle':
        return (
          <div className={sectionCardClass}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Energy peak</Label>
                <Select
                  value={sectionData.energyPeak}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      taskStyle: { ...prev.taskStyle, energyPeak: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick energy" />
                  </SelectTrigger>
                  <SelectContent>
                    {energyPeakOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Priority method</Label>
                <Select
                  value={sectionData.priorityMethod}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      taskStyle: { ...prev.taskStyle, priorityMethod: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Work block duration</Label>
                <Select
                  value={sectionData.workBlockDuration}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      taskStyle: { ...prev.taskStyle, workBlockDuration: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick blocks" />
                  </SelectTrigger>
                  <SelectContent>
                    {workBlockOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Multitasking style</Label>
                <Select
                  value={sectionData.multitasking}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      taskStyle: { ...prev.taskStyle, multitasking: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick style" />
                  </SelectTrigger>
                  <SelectContent>
                    {multitaskingOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Procrastination level</Label>
                <span className="text-xs text-muted-foreground">{sectionData.procrastination}/5</span>
              </div>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[sectionData.procrastination]}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    taskStyle: { ...prev.taskStyle, procrastination: value[0] }
                  }))
                }
              />
            </div>
          </div>
        );
      case 'decisionStyle':
        return (
          <div className={sectionCardClass}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={fieldLabelClass}>Novelty preference</Label>
                <span className="text-xs text-muted-foreground">{sectionData.novelty}/5</span>
              </div>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[sectionData.novelty]}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    decisionStyle: { ...prev.decisionStyle, novelty: value[0] }
                  }))
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Budget consciousness</Label>
                <Select
                  value={sectionData.budgetConsciousness}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      decisionStyle: { ...prev.decisionStyle, budgetConsciousness: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetConsciousnessOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className={fieldLabelClass}>Time availability</Label>
                <Select
                  value={sectionData.timeAvailability}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      decisionStyle: { ...prev.decisionStyle, timeAvailability: value }
                    }))
                  }
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Pick availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeAvailabilityOptions.map((option) => (
                      <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <Label className={fieldLabelClass}>Decision confidence</Label>
              <Select
                value={sectionData.decisionConfidence}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    decisionStyle: { ...prev.decisionStyle, decisionConfidence: value }
                  }))
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Pick confidence" />
                </SelectTrigger>
                <SelectContent>
                  {decisionConfidenceOptions.map((option) => (
                    <SelectItem key={getOptionValue(option)} value={getOptionValue(option)}>
                      {getOptionLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-muted-foreground">Section controls coming soon.</p>;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/30">
        <ShieldCheck className="h-10 w-10 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/20 via-background to-muted/30 px-4 py-12 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-2 sm:px-4">
        {createSectionHeader()}

        {sectionIndex === 0 ? (
          renderProviderSection()
        ) : (
          <Card className="w-full max-w-3xl self-center overflow-hidden rounded-[32px] border border-border/60 bg-card/90 shadow-[0_20px_80px_rgba(29,78,216,0.35)]">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">Section {sectionIndex}</p>
                <h2 className="text-2xl font-semibold text-foreground">{SECTION_TITLES[sectionIndex - 1]}</h2>
              </div>
              {renderFormSection()}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} disabled={sectionIndex === 0}>
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              {sectionIndex === 0 ? 0 : sectionIndex}/{SECTION_TITLES.length}
            </span>
            <Button onClick={handleNext} disabled={isSubmitting}>
              {sectionIndex === SECTION_TITLES.length ? 'Finish onboarding' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
