import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/assets/styles/globals.css';
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: `%s | Pedal Pact`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: SERVER_URL,
    siteName: APP_NAME,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pedal Pact logo and tagline',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/group-1-2.webp"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/group-1-small.webp"
          media="(max-width: 767px)"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <noscript className="flex justify-center items-center">
          <div className="flex flex-col items-center pt-8">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.svg"
                height="100"
                width="100"
                alt="Pedal-Pact logo."
              ></img>
            </a>
            <p>JavaScript is required for the best experience on this site.</p>
            <p>Thanks for dropping in!</p>
          </div>
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
