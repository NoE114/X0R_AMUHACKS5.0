import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken, completeOnboarding } from '@/lib/services/auth.js';

const string24Hour = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format');

const onboardingSchema = z.object({
  provider: z.enum(['openrouter', 'groq', 'anthropic']).optional(),
  apiKey: z.string().min(3, 'API key is too short').max(2048).optional(),
  profilePhoto: z.string().optional(),
  skip: z.boolean().optional(),
  onboarding: z.object({
    profile: z.object({
      age: z.number().int().min(3).max(120),
      gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']),
      occupation: z.enum([
        'Student',
        'Software Engineer',
        'Business Professional',
        'Designer/Creative',
        'Healthcare Worker',
        'Teacher/Professor',
        'Entrepreneur',
        'Homemaker',
        'Other'
      ]),
      occupationOther: z.string().max(100).optional(),
      location: z.string().min(2).max(100),
      livingSituation: z.enum(['Live alone', 'With roommates', 'With family', 'With partner'])
    }),
    health: z.object({
      dietaryType: z.enum(['Non-vegetarian', 'Vegetarian', 'Vegan', 'Pescatarian', 'Flexitarian']),
      allergies: z
        .array(
          z.enum(['None', 'Lactose intolerant', 'Gluten-free', 'Nut allergy', 'Shellfish allergy', 'Other'])
        )
        .max(6),
      allergyOther: z.string().max(100).optional(),
      healthGoal: z.enum([
        'Weight loss',
        'Muscle gain/fitness',
        'Maintain current weight',
        'Heart health',
        'Diabetes management',
        'No specific goal'
      ]),
      activityLevel: z.enum([
        'Sedentary (desk job, minimal exercise)',
        'Lightly active (light exercise 1-3 days/week)',
        'Moderately active (exercise 3-5 days/week)',
        'Very active (intense exercise 6-7 days/week)'
      ]),
      eatingPattern: z.enum([
        '3 regular meals',
        '5-6 small meals (frequent snacker)',
        '2 meals + snacks',
        'Intermittent fasting',
        'Irregular/varies'
      ])
    }),
    work: z.object({
      schedule: z.enum([
        '9 AM - 5 PM (standard)',
        '10 AM - 6 PM',
        'Flexible hours',
        'Night shift',
        'Freelance/variable',
        'Student schedule',
        'Unemployed/Retired'
      ]),
      location: z.enum([
        'Home (WFH/online classes)',
        'Office/Campus',
        'Hybrid (3-4 days office)',
        'Hybrid (1-2 days office)'
      ]),
      commuteTime: z.enum(['No commute (WFH)', '0-15 minutes', '15-30 minutes', '30-60 minutes', '60+ minutes']),
      lunchBreak: z.enum(['30 minutes', '45 minutes', '1 hour', 'More than 1 hour', 'Flexible/no fixed time']),
      stressLevel: z.number().int().min(1).max(5),
      dailyScheduleType: z.enum([
        'Meetings/classes heavy',
        'Deep focus work',
        'Mix of both',
        'Mostly customer-facing',
        'Physical/hands-on work'
      ])
    }),
    foodPreferences: z.object({
      cuisines: z
        .array(
          z.enum([
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
          ])
        )
        .max(5)
        .min(1),
      cuisineOther: z.string().max(100).optional(),
      spiceTolerance: z.number().int().min(1).max(5),
      budget: z.enum([
        '₹50-100 (very budget)',
        '₹100-200 (budget-conscious)',
        '₹200-300 (moderate)',
        '₹300-500 (comfortable)',
        '₹500+ (flexible)'
      ]),
      mealTimings: z.object({
        breakfast: string24Hour,
        lunch: string24Hour,
        dinner: string24Hour
      }),
      cookingHabits: z.enum([
        'Never cook (always eat out/order)',
        'Rarely cook (1-2 times/week)',
        'Sometimes cook (3-4 times/week)',
        'Often cook (5-6 times/week)',
        'Always cook at home'
      ]),
      eatingStyles: z
        .array(
          z.enum([
            'Quick meals (under 15 min)',
            'Sit-down dining',
            'Street food',
            'Fine dining (occasional)',
            'Meal prep/batch cooking',
            'Home-cooked food'
          ])
        )
        .min(1)
        .max(6)
    }),
    clothingPreferences: z.object({
      fashionStyles: z
        .array(
          z.enum([
            'Casual (jeans, t-shirts)',
            'Smart casual',
            'Formal/business',
            'Sporty/athleisure',
            'Trendy/fashionable',
            'Minimalist',
            'Traditional/ethnic',
            'Comfortable above all'
          ])
        )
        .max(3)
        .min(1),
      weatherSensitivity: z.enum([
        'Very sensitive (layer up/down frequently)',
        'Moderately sensitive',
        'Not very sensitive (same clothes most temps)'
      ]),
      colorPreferences: z
        .array(
          z.enum([
            'Neutrals (black, white, grey, beige)',
            'Blues',
            'Earth tones (brown, green, olive)',
            'Bold colors (red, yellow, orange)',
            'Pastels',
            'All-black everything',
            'No preference'
          ])
        )
        .min(1),
      comfortPriority: z.number().int().min(1).max(5),
      dressCode: z.enum([
        'Very formal (suit/tie, formal attire)',
        'Business casual',
        'Smart casual',
        'Casual (anything goes)',
        'Uniform required',
        'Not applicable'
      ])
    }),
    taskStyle: z.object({
      energyPeak: z.enum([
        'Morning person (5 AM - 11 AM)',
        'Midday peak (11 AM - 3 PM)',
        'Afternoon (3 PM - 7 PM)',
        'Night owl (7 PM - midnight)',
        'Late night (after midnight)'
      ]),
      priorityMethod: z.enum([
        'Urgency first (closest deadline)',
        'Importance first (highest impact)',
        'Easiest first (quick wins)',
        'Hardest first (eat the frog)',
        'Mix it up based on mood'
      ]),
      workBlockDuration: z.enum([
        'Short bursts (15-25 min, Pomodoro style)',
        'Medium blocks (45-60 min)',
        'Long blocks (2+ hours deep work)',
        'Varies by task'
      ]),
      procrastination: z.number().int().min(1).max(5),
      multitasking: z.enum([
        'Prefer multitasking',
        'Prefer single-tasking (one thing at a time)',
        'Depends on task type'
      ])
    }),
    decisionStyle: z.object({
      novelty: z.number().int().min(1).max(5),
      budgetConsciousness: z.enum([
        'Very strict (track every rupee)',
        'Moderately careful',
        'Flexible (don\'t stress about small amounts)',
        'Not concerned about budget'
      ]),
      timeAvailability: z.enum(['Always rushed', 'Usually have some time', 'Generally relaxed schedule', 'Varies day to day']),
      decisionConfidence: z.enum([
        'Very decisive (make decisions quickly)',
        'Moderately decisive',
        'Often second-guess myself',
        'Very indecisive (struggle with choices)'
      ])
    })
  }).optional()
});

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const body = await request.json();
    const payload = onboardingSchema.parse(body);

    const result = await completeOnboarding(decoded.userId, payload);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Onboarding error:', error);

    if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid onboarding payload', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Something went wrong' },
      { status: 400 }
    );
  }
}
