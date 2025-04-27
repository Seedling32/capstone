'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type DownloadGPXProps = {
  title: string;
  path: { lat: number; lng: number }[];
};

const DownloadGPX = ({ title, path }: DownloadGPXProps) => {
  const handleDownload = () => {
    const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Pedal Pact" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>${title}</name>
    <trkseg>`;

    const gpxPoints = path
      .map((point) => `<trkpt lat="${point.lat}" lon="${point.lng}"></trkpt>`)
      .join('\n');

    const gpxFooter = `
    </trkseg>
  </trk>
</gpx>`;

    const gpxContent = `${gpxHeader}\n${gpxPoints}\n${gpxFooter}`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload}>
      <Download /> Download GPX
    </Button>
  );
};

export default DownloadGPX;
