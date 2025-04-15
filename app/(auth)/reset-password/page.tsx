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
import { APP_NAME } from '@/lib/constants';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const token = useSearchParams().get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
    setDone(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
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
              <>
                <input
                  className="p-2 border rounded w-full mb-2"
                  type="password"
                  required
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn-primary">Reset Password</button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
