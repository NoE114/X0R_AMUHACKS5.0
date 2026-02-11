import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  passwordHash: {
    type: String,
    required: true
  },
  encryptedApiKeys: {
    type: Map,
    of: new mongoose.Schema({
      encrypted: {
        type: String,
        required: true
      },
      iv: {
        type: String,
        required: true
      }
    }, { _id: false }),
    default: {}
  },
  preferences: {
    meal: {
      type: Map,
      of: Number,
      default: {}
    },
    task: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  profile: {
    age: {
      type: Number,
      min: 3,
      max: 120
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    occupation: {
      type: String,
      enum: [
        'Student',
        'Software Engineer',
        'Business Professional',
        'Designer/Creative',
        'Healthcare Worker',
        'Teacher/Professor',
        'Entrepreneur',
        'Homemaker',
        'Other'
      ]
    },
    occupationOther: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true
    },
    livingSituation: {
      type: String,
      enum: ['Live alone', 'With roommates', 'With family', 'With partner']
    }
  },
  health: {
    dietaryType: {
      type: String,
      enum: ['Non-vegetarian', 'Vegetarian', 'Vegan', 'Pescatarian', 'Flexitarian']
    },
    allergies: {
      type: [String],
      default: []
    },
    allergyOther: {
      type: String,
      trim: true,
      default: ''
    },
    healthGoal: {
      type: String,
      enum: [
        'Weight loss',
        'Muscle gain/fitness',
        'Maintain current weight',
        'Heart health',
        'Diabetes management',
        'No specific goal'
      ]
    },
    activityLevel: {
      type: String,
      enum: [
        'Sedentary (desk job, minimal exercise)',
        'Lightly active (light exercise 1-3 days/week)',
        'Moderately active (exercise 3-5 days/week)',
        'Very active (intense exercise 6-7 days/week)'
      ]
    },
    eatingPattern: {
      type: String,
      enum: [
        '3 regular meals',
        '5-6 small meals (frequent snacker)',
        '2 meals + snacks',
        'Intermittent fasting',
        'Irregular/varies'
      ]
    }
  },
  work: {
    schedule: {
      type: String,
      enum: [
        '9 AM - 5 PM (standard)',
        '10 AM - 6 PM',
        'Flexible hours',
        'Night shift',
        'Freelance/variable',
        'Student schedule',
        'Unemployed/Retired'
      ]
    },
    location: {
      type: String,
      enum: ['Home (WFH/online classes)', 'Office/Campus', 'Hybrid (3-4 days office)', 'Hybrid (1-2 days office)']
    },
    commuteTime: {
      type: String,
      enum: ['No commute (WFH)', '0-15 minutes', '15-30 minutes', '30-60 minutes', '60+ minutes']
    },
    lunchBreak: {
      type: String,
      enum: ['30 minutes', '45 minutes', '1 hour', 'More than 1 hour', 'Flexible/no fixed time']
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 5
    },
    dailyScheduleType: {
      type: String,
      enum: ['Meetings/classes heavy', 'Deep focus work', 'Mix of both', 'Mostly customer-facing', 'Physical/hands-on work']
    }
  },
  foodPreferences: {
    cuisines: {
      type: [String],
      default: []
    },
    cuisineOther: {
      type: String,
      trim: true,
      default: ''
    },
    spiceTolerance: {
      type: Number,
      min: 1,
      max: 5
    },
    budget: {
      type: String,
      enum: [
        '₹50-100 (very budget)',
        '₹100-200 (budget-conscious)',
        '₹200-300 (moderate)',
        '₹300-500 (comfortable)',
        '₹500+ (flexible)'
      ]
    },
    mealTimings: {
      breakfast: String,
      lunch: String,
      dinner: String
    },
    cookingHabits: {
      type: String,
      enum: [
        'Never cook (always eat out/order)',
        'Rarely cook (1-2 times/week)',
        'Sometimes cook (3-4 times/week)',
        'Often cook (5-6 times/week)',
        'Always cook at home'
      ]
    },
    eatingStyles: {
      type: [String],
      default: []
    }
  },
  clothingPreferences: {
    fashionStyles: {
      type: [String],
      default: []
    },
    weatherSensitivity: {
      type: String,
      enum: ['Very sensitive (layer up/down frequently)', 'Moderately sensitive', 'Not very sensitive (same clothes most temps)']
    },
    colorPreferences: {
      type: [String],
      default: []
    },
    comfortPriority: {
      type: Number,
      min: 1,
      max: 5
    },
    dressCode: {
      type: String,
      enum: [
        'Very formal (suit/tie, formal attire)',
        'Business casual',
        'Smart casual',
        'Casual (anything goes)',
        'Uniform required',
        'Not applicable'
      ]
    }
  },
  taskStyle: {
    energyPeak: {
      type: String,
      enum: ['Morning person (5 AM - 11 AM)', 'Midday peak (11 AM - 3 PM)', 'Afternoon (3 PM - 7 PM)', 'Night owl (7 PM - midnight)', 'Late night (after midnight)']
    },
    priorityMethod: {
      type: String,
      enum: ['Urgency first (closest deadline)', 'Importance first (highest impact)', 'Easiest first (quick wins)', 'Hardest first (eat the frog)', 'Mix it up based on mood']
    },
    workBlockDuration: {
      type: String,
      enum: ['Short bursts (15-25 min, Pomodoro style)', 'Medium blocks (45-60 min)', 'Long blocks (2+ hours deep work)', 'Varies by task']
    },
    procrastination: {
      type: Number,
      min: 1,
      max: 5
    },
    multitasking: {
      type: String,
      enum: ['Prefer multitasking', 'Prefer single-tasking (one thing at a time)', 'Depends on task type']
    }
  },
  decisionStyle: {
    novelty: {
      type: Number,
      min: 1,
      max: 5
    },
    budgetConsciousness: {
      type: String,
      enum: ['Very strict (track every rupee)', 'Moderately careful', 'Flexible (don\'t stress about small amounts)', 'Not concerned about budget']
    },
    timeAvailability: {
      type: String,
      enum: ['Always rushed', 'Usually have some time', 'Generally relaxed schedule', 'Varies day to day']
    },
    decisionConfidence: {
      type: String,
      enum: ['Very decisive (make decisions quickly)', 'Moderately decisive', 'Often second-guess myself', 'Very indecisive (struggle with choices)']
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otpCode: {
    type: String,
    default: null
  },
  otpExpiresAt: {
    type: Date,
    default: null
  },
  profilePhoto: {
    type: String,
    default: null
  },
  preferredProvider: {
    type: String,
    enum: ['openrouter', 'groq', 'anthropic', 'fallback'],
    default: 'openrouter'
  },
  onboarded: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent overwriting model in hot reload
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
