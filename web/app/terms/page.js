import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to Decision Fatigue Reducer. By using our service, you agree to these terms.
            </p>
            
            <h3 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h3>
            <p>
              By accessing or using our service, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h3 className="text-lg font-semibold text-foreground">2. Use of Service</h3>
            <p>
              Our AI-powered decision assistant is provided for personal use. You are responsible for maintaining the confidentiality of your account and API keys.
            </p>

            <h3 className="text-lg font-semibold text-foreground">3. Privacy</h3>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.
            </p>

            <h3 className="text-lg font-semibold text-foreground">4. Disclaimer</h3>
            <p>
              The AI recommendations provided are suggestions only. We are not responsible for decisions you make based on these recommendations.
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
