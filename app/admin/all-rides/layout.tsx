'use client';

import { LoadScriptNext } from '@react-google-maps/api';
import { Toaster } from '@/components/ui/sonner';

const googleMapsLibraries: (
  | 'drawing'
  | 'geometry'
  | 'places'
  | 'visualization'
)[] = ['geometry'];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={googleMapsLibraries}
    >
      <>
        {children}
        <Toaster position="top-center" richColors />
      </>
    </LoadScriptNext>
  );
}
