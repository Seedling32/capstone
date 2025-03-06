'use client';

import { LoadScriptNext } from '@react-google-maps/api';
import { Toaster } from '@/components/ui/sonner';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
    >
      <>
        {children}
        <Toaster position="top-center" />
      </>
    </LoadScriptNext>
  );
}
