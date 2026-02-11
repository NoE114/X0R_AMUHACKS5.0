"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DarkVeil from '@/components/DarkVeil';
import {
  Cpu,
  Zap,
  Shield,
  Star,
  Clock,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Utensils,
  CheckSquare,
  Shirt,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);
  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Decisions',
      description: 'Smart recommendations that learn from your preferences and reduce decision fatigue'
    },
    {
      icon: Zap,
      title: 'Save Mental Energy',
      description: 'Stop wasting brainpower on small daily decisions. Focus on what truly matters.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your API keys are encrypted with AES-256. Your data stays private and secure.'
    },
    {
      icon: Sparkles,
      title: 'Continuous Learning',
      description: 'Our system learns from your feedback to provide increasingly accurate suggestions'
    },
    {
      icon: Clock,
      title: 'Time-Aware',
      description: 'Recommendations adapt based on time of day and your daily routines'
    },
    {
      icon: LineChart,
      title: 'Track Progress',
      description: 'Monitor your decision patterns and see how your preferences evolve over time'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Sign Up',
      description: 'Create your account and optionally add your AI API keys for enhanced recommendations'
    },
    {
      step: '02',
      title: 'Ask for Help',
      description: 'Tell us what you need help deciding - meals, tasks, or daily activities'
    },
    {
      step: '03',
      title: 'Get Recommendations',
      description: 'Receive personalized suggestions powered by AI and your preferences'
    },
    {
      step: '04',
      title: 'Provide Feedback',
      description: 'Rate your choices to help the system learn and improve future recommendations'
    }
  ];

  const testimonials = [
    {
      quote: "This app has saved me so much mental energy every morning. No more staring into the fridge wondering what to eat!",
      author: "Sarah M.",
      role: "Product Manager"
    },
    {
      quote: "The AI recommendations are surprisingly accurate. It feels like the app actually knows my preferences.",
      author: "James K.",
      role: "Software Developer"
    },
    {
      quote: "I was skeptical at first, but now I can't imagine my day without it. Highly recommend!",
      author: "Emily R.",
      role: "Designer"
    }
  ];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background py-20 md:py-32">
        <div className="absolute inset-x-0 top-0 -z-10">
          <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <DarkVeil
              hueShift={0}
              noiseIntensity={0}
              scanlineIntensity={0}
              speed={1}
              scanlineFrequency={0}
              warpAmount={0}
            />
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Star className="h-4 w-4" />
              AI-Powered Daily Decisions
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Stop Wasting Mental Energy on{' '}
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Small Decisions
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Let our AI handle your daily choices - from what to eat to what to do. 
              Save your mental energy for the things that truly matter.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground mt-1">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground mt-1">Decisions Made</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Reduce Decision Fatigue
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to help you make better decisions with less effort
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in minutes and let AI handle your daily decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Can We Help You Decide?
            </h2>
            <p className="text-lg text-muted-foreground">
              From meals to tasks to outfits, we&apos;ve got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Meal Decisions</h3>
                <p className="text-muted-foreground mb-4">
                  Never wonder what to eat again. Get personalized meal suggestions.
                </p>
                <ul className="space-y-2">
                  {['Weather-aware suggestions', 'Dietary preferences', 'Budget-conscious picks'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <CheckSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Daily Tasks</h3>
                <p className="text-muted-foreground mb-4">
                  Boost productivity with AI-suggested tasks that match your energy.
                </p>
                <ul className="space-y-2">
                  {['Time-appropriate tasks', 'Energy-level aware', 'Productivity optimized'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center mb-4">
                  <Shirt className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Outfit Choices</h3>
                <p className="text-muted-foreground mb-4">
                  Stop staring at your wardrobe. Get outfit ideas instantly.
                </p>
                <ul className="space-y-2">
                  {['Weather-matched outfits', 'Dress code aware', 'Style preferences'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of people who have reduced their decision fatigue
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Reduce Your Decision Fatigue?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of people who have reclaimed their mental energy. 
              Sign up today and get your first recommendation in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 rounded-full blur-3xl" />
        </div>
      </section>
    </main>
  );
}
