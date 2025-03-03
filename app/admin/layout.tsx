'use client';

import { LoadScriptNext } from '@react-google-maps/api';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
    >
      <>{children}</>
    </LoadScriptNext>
  );
}
