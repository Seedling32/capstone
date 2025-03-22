'use client';

import { LoadScriptNext } from '@react-google-maps/api';

const googleMapsLibraries: (
  | 'drawing'
  | 'geometry'
  | 'places'
  | 'visualization'
)[] = ['geometry'];

export default function GoogleMapsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={googleMapsLibraries}
    >
      <>{children}</>
    </LoadScriptNext>
  );
}
