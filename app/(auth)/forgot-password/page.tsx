'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { APP_NAME, TURNSTILE_SITE_KEY } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import Turnstile from 'react-turnstile';
import { verifyTurnstile } from '@/lib/actions/user.actions';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error('Please complete CAPTCHA verification.');
      return;
    }

    const isHuman = await verifyTurnstile(captchaToken);

    if (!isHuman) {
      return {
        success: false,
        message: 'CAPTCHA validation failed. Please try again.',
      };
    }

    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    setSent(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="sr-only">Forgot password</h1>
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.png"
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
              className="rounded-md"
            />
          </Link>
          <CardTitle className="text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Use the form to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto pb-8">
            {sent ? (
              <p className="text-center">Check your email for a reset link.</p>
            ) : (
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  className="p-2 border rounded w-full mb-2"
                  type="email"
                  placeholder="Enter your email address..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex justify-center my-4">
                  <Turnstile
                    sitekey={TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setCaptchaToken(token)}
                  />
                </div>
                <Button type="submit" className="w-full mt-4">
                  Send Reset Link
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
