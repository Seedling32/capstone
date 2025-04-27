'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { APP_NAME, TURNSTILE_SITE_KEY } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Turnstile from 'react-turnstile';
import { verifyTurnstile } from '@/lib/actions/user.actions';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const token = useSearchParams().get('token');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      toast.error(`${error}`);
      return;
    }

    setDone(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
          <form onSubmit={handleSubmit} className="max-w-md mx-auto py-8">
            <h1 className="text-xl font-bold mb-4">Reset Password</h1>
            {done ? (
              <p className="text-center">
                Password successfully updated.{' '}
                <Link
                  href="/sign-in"
                  target="_self"
                  className="link hover:underline"
                >
                  Sign-in
                </Link>
                .
              </p>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <label htmlFor="password" className="sr-only">
                  Enter password
                </label>
                <input
                  id="password"
                  className="p-2 border rounded w-full mb-2"
                  type="password"
                  required
                  placeholder="New password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  className="p-2 border rounded w-full"
                  type="password"
                  required
                  placeholder="Confirm password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
                <div className="flex justify-center my-4">
                  <Turnstile
                    sitekey={TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setCaptchaToken(token)}
                  />
                </div>
                <Button disabled={!password || password !== confirmPassword}>
                  Reset Password
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
