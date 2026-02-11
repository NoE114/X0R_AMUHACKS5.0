import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="flex-1 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              At Decision Fatigue Reducer, we take your privacy seriously. This policy explains how we handle your data.
            </p>
            
            <h3 className="text-lg font-semibold text-foreground">1. Information We Collect</h3>
            <p>
              We collect information you provide directly, including your name, email, and preferences. We also store your encrypted API keys for AI providers.
            </p>

            <h3 className="text-lg font-semibold text-foreground">2. Data Security</h3>
            <p>
              Your API keys are encrypted using AES-256 encryption. We never store your passwords in plain text. All data is stored securely in our database.
            </p>

            <h3 className="text-lg font-semibold text-foreground">3. How We Use Your Data</h3>
            <p>
              We use your preferences to provide personalized AI recommendations. Your data helps us improve our suggestion algorithms.
            </p>

            <h3 className="text-lg font-semibold text-foreground">4. Your Rights</h3>
            <p>
              You can access, update, or delete your account information at any time through the Settings page.
            </p>

            <h3 className="text-lg font-semibold text-foreground">5. Third-Party Services</h3>
            <p>
              We use third-party AI providers (OpenRouter, Groq, Anthropic) to generate recommendations. Your API keys are only used to access these services on your behalf.
            </p>

            <div className="pt-4 border-t">
              <p className="text-sm">
                Last updated: February 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
