# 🧠 SWIFTION

> *"Stop wasting mental energy on small decisions. Let AI handle the daily grind while you focus on what truly matters."*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 👨‍💻 Built By

[![Website](https://img.shields.io/badge/Website-@blezecon-181717?style=for-the-badge&logo=github)](https://github.com/blezecon) <br>
[![Mobile App](https://img.shields.io/badge/Mobile_App-@NoE114-181717?style=for-the-badge&logo=github)](https://github.com/NoE114)

## 🚀 What is this?

**SWIFTION** is an AI-powered web application that helps you make daily decisions without the mental exhaustion. Whether it's:

- 🍕 **What should I eat for lunch?**
- ✅ **What task should I tackle next?**
- 👔 **What should I wear today?**

Our intelligent system learns your preferences and provides personalized recommendations based on:
- Your unique profile (diet, lifestyle, work schedule)
- Current weather conditions
- Time of day
- Your past feedback

## ✨ Features That Make This Special

### 🤖 **Multi-AI Provider Support**
Bring your own API keys from:
- **OpenRouter** (GPT-3.5) - Balanced & reliable
- **Groq** (LLaMA 3) - Lightning fast responses  
- **Anthropic** (Claude) - Safety-focused AI

Your API keys are encrypted with **AES-256** and stored securely!

### 📊 **Smart Learning System**
- Rate recommendations (1-5 stars)
- System learns and adapts to your taste
- Confidence scores show how well it knows you
- Blends AI suggestions with your preferences

### 🌤️ **Weather-Aware Decisions**
- Real-time weather integration
- Clothing suggestions based on temperature
- Meal ideas that match the weather

### 🔐 **Bank-Level Security**
- JWT authentication (7-day sessions)
- bcrypt password hashing
- Email verification with OTP
- Middleware protection for private routes

### 📱 **Fully Responsive**
Works beautifully on:
- 💻 Desktop
- 📱 Mobile
- 📱 Tablet

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT (jose) + bcrypt |
| **Email** | Nodemailer (Gmail SMTP) |
| **Validation** | Zod |
| **HTTP Client** | Axios |
| **Animation** | OGL (DarkVeil background) |

## 📁 Project Structure

```
X0R_AMUHACKS5.0/
├── web/                          # 🌐 Next.js Web Application
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   │   ├── login/        # POST /api/auth/login
│   │   │   │   ├── register/     # POST /api/auth/register
│   │   │   │   ├── verify-otp/   # POST /api/auth/verify-otp
│   │   │   │   └── ...
│   │   │   ├── decisions/        # AI recommendation endpoints
│   │   │   ├── feedback/         # User feedback endpoint
│   │   │   └── weather/          # Weather data endpoint
│   │   ├── (pages)/              # Application pages
│   │   │   ├── page.js           # 🏠 Landing page
│   │   │   ├── signin/           # 🔐 Login page
│   │   │   ├── signup/           # 📝 Registration page
│   │   │   ├── verify-otp/       # 📧 OTP verification
│   │   │   ├── onboarding/       # 🎯 User onboarding (7 sections!)
│   │   │   ├── dashboard/        # 📊 Main dashboard
│   │   │   ├── settings/         # ⚙️ Profile & API settings
│   │   │   └── ...
│   │   ├── layout.js             # Root layout with Navbar/Footer
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   └── ...
│   │   ├── DarkVeil.jsx          # ✨ Animated background
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── DecisionCard.jsx      # Recommendation display
│   │   └── FeedbackForm.jsx      # Rating form
│   ├── lib/                      # Backend logic
│   │   ├── models/               # MongoDB schemas
│   │   │   ├── User.js           # User model (comprehensive profile!)
│   │   │   ├── Decision.js       # Decision history
│   │   │   └── Feedback.js       # User feedback
│   │   ├── services/             # Business logic
│   │   │   ├── auth.js           # Authentication service
│   │   │   ├── ai-proxy.js       # AI provider integration
│   │   │   ├── decision-engine.js# Recommendation engine
│   │   │   └── weather.js        # Weather API
│   │   └── utils/                # Utilities
│   │       ├── encryption.js     # AES-256 encryption
│   │       └── learning.js       # ML algorithms
│   ├── middleware.js             # JWT route protection
│   ├── next.config.mjs           # Next.js config
│   ├── package.json              # Dependencies
│   └── .env.example              # Environment template
│
└── mobile/                       # 📱 Mobile app scaffold
    ├── MREADME.md                # Mobile-specific notes
    ├── package.json              # Mobile dependencies
    ├── package-lock.json         # Lockfile (npm)
    ├── add_android.sh            # Add Android platform
    ├── build_apk.sh              # Build APK
    ├── build_web.sh              # Build web assets
    ├── install_deps.sh           # Install dependencies
    ├── sync_capacitor.sh         # Sync Capacitor
    └── swiftionicon.png          # App icon
```

## 🚀 Getting Started

### Prerequisites

Before you start, you'll need:

1. **Node.js 18+** installed
2. **MongoDB Atlas** account (free tier works!)
3. **Gmail account** with App Password enabled
4. **AI Provider API Key** (OpenRouter recommended - has free tier)

### Step 1: Clone & Install

```bash
cd X0R_AMUHACKS5.0/web

# Install dependencies (we use pnpm)
pnpm install

# Or use npm/yarn if you prefer
npm install
# or
yarn install
```

### Step 2: Environment Setup

Create your `web/.env.local` file (this README only covers the web app env for now):

```bash
cd web
cp .env.example .env.local
```

Now edit `web/.env.local` with your credentials:

```env
# 🔗 MongoDB Connection (Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/decision-fatigue?retryWrites=true&w=majority

# 🔐 JWT Secret (Generate random string, min 32 chars)
# You can use: openssl rand -hex 32
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# 🛡️ Encryption Secret (MUST stay constant!)
# Changing this invalidates all stored API keys
ENCRYPTION_SECRET=your-encryption-secret-min-32-characters-long

# 🌤️ OpenWeather API (Optional but recommended)
# Get free API key at: https://openweathermap.org/api
OPENWEATHER_API_KEY=your-openweather-api-key

# 📧 Gmail SMTP for OTP emails
# IMPORTANT: Use App Password, NOT your regular password!
# Enable 2FA → Generate App Password at: https://myaccount.google.com/apppasswords
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-16-char-app-password

# 🌐 App URL (for OpenRouter referrer tracking)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

### Step 4: Build for Production

```bash
pnpm build
pnpm start
```

## 🎯 How It Works

### 1. **Sign Up & Verify**
- Create account with email + password
- Receive 6-digit OTP via email
- Verify to activate account

### 2. **Complete Onboarding** (7 Sections!)
The system learns about you:
- **Profile**: Age, occupation, location
- **Health**: Diet type, allergies, goals, activity level  
- **Work**: Schedule, commute, stress level
- **Food**: Favorite cuisines, budget, cooking habits
- **Clothing**: Style preferences, colors, dress code
- **Task Style**: Energy peaks, work blocks, multitasking
- **Decision Style**: Budget consciousness, confidence level

### 3. **Get Recommendations**
- Choose: Meal / Task / Clothing
- AI generates personalized options
- Weather & time-aware suggestions
- Rate responses (1-5 stars)

### 4. **System Learns**
- Your ratings improve future suggestions
- Confidence scores increase over time
- Blend of AI + your preferences

## 🔌 API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Create new account | ❌ |
| `/api/auth/login` | POST | Sign in | ❌ |
| `/api/auth/verify-otp` | POST | Verify email | ❌ |
| `/api/auth/resend-otp` | POST | Resend OTP | ❌ |
| `/api/auth/onboarding/complete` | POST | Finish onboarding | ✅ |
| `/api/auth/provider-settings` | PATCH | Update AI settings | ✅ |
| `/api/decisions/recommend` | GET | Get AI recommendation | ✅ |
| `/api/decisions/history` | GET | View decision history | ✅ |
| `/api/feedback` | POST | Submit rating | ✅ |
| `/api/user/stats` | GET | Get user statistics | ✅ |
| `/api/weather` | GET | Current weather | ✅ |

## 🧩 Key Components Explained

### `DarkVeil.jsx` - The Animated Background
A WebGL-powered animated background using OGL library. Creates that mesmerizing dark gradient effect on the landing page!

### `DecisionEngine` - The Brain
Located in `lib/services/decision-engine.js`. Handles:
- AI provider routing
- Fallback options when AI fails
- User preference blending
- Confidence calculation

### `Auth Service` - Security Layer
Located in `lib/services/auth.js`. Manages:
- User registration
- Password hashing (bcrypt)
- JWT token generation
- Email OTP verification

### `Middleware` - Route Protection
`middleware.js` protects private routes. Redirects unauthenticated users to signin page.

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Check your API key is correctly entered in Settings
- For OpenRouter: Keys start with `sk-or-v1-`
- For Groq: Keys start with `gsk_`

### Images Not Loading
- Make sure `images.unoptimized: true` is in `next.config.mjs`
- Check that `next/image` imports are correct

### OTP Email Not Sending
- Verify you're using Gmail **App Password** (not regular password)
- Enable 2FA on Google account first
- Generate App Password at: https://myaccount.google.com/apppasswords

### Database Connection Failed
- Check `MONGODB_URI` in `.env.local`
- Ensure IP whitelist in MongoDB Atlas includes your server IP
- For local dev, use `0.0.0.0/0` (allow all IPs temporarily)

### DarkVeil Background Drifting (Chromium)
The animated background uses ResizeObserver to prevent constant reflows. If you see drifting:
- Check your browser zoom is at 100%
- Try hard refreshing (Ctrl+Shift+R)

## 📝 Environment Variables Explained

**Location:** `web/.env.local` (mobile env will be documented later)

### Required (App won't work without these)

| Variable | Purpose | How to Get |
|----------|---------|------------|
| `MONGODB_URI` | Database connection | MongoDB Atlas → Connect → Drivers → Node.js |
| `JWT_SECRET` | Session encryption | Generate: `openssl rand -hex 32` |
| `ENCRYPTION_SECRET` | API key encryption | Generate once, never change! |
| `GMAIL_USER` | Email sender | Your Gmail address |
| `GMAIL_PASS` | Email authentication | Gmail App Password (16 chars) |

### Optional (Enhanced features)

| Variable | Purpose | How to Get |
|----------|---------|------------|
| `OPENWEATHER_API_KEY` | Weather data | https://openweathermap.org/api (free tier) |
| `NEXT_PUBLIC_APP_URL` | App base URL | `http://localhost:3000` for dev |

## 🎨 Customization

### Change Theme Colors
Edit `app/globals.css`:
```css
:root {
  --primary: 250 100% 60%;  /* Change this hue */
}
```

### Add New Decision Types
1. Add to `decision-engine.js` fallback options
2. Update dashboard dropdown
3. Add prompt templates in `ai-proxy.js`

### Customize Email Templates
Edit `lib/services/auth.js` - look for `sendOTPEmail()` function.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built for **AMUHACKS 5.0 Hackathon** by Team X0R.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful accessible components
- **Tailwind CSS** - Utility-first styling magic
- **Next.js Team** - Amazing React framework
- **MongoDB Atlas** - Free cloud database
- **OpenRouter/Groq/Anthropic** - AI API providers

## 💡 Pro Tips

1. **Start with OpenRouter** - They offer free credits to test
2. **Use strong JWT_SECRET** - At least 32 characters, random
3. **Never change ENCRYPTION_SECRET** - Will break all stored API keys
4. **Enable Gmail 2FA** - Required for App Passwords
5. **Test on mobile** - The app is fully responsive!

---
