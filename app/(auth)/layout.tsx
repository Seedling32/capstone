import { SessionProvider } from 'next-auth/react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <div className="flex-center min-h-screen w-full">{children}</div>
    </SessionProvider>
  );
}
