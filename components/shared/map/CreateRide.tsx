'use client';

import { useState, useEffect, useRef } from 'react';
import { GoogleMap, Polyline } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = { lat: 35.5951, lng: -82.5515 }; // Asheville, NC

type Route = {
  id: number;
  slug: string;
  date?: string;
  path: { lat: number; lng: number }[];
  distance: number;
  shortDescription: string;
  longDescription: string;
  staticMapUrl: string;
};

const CreateRide = () => {
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [savedRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(0);
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [staticMapUrl, setStaticMapUrl] = useState('');
  const [date, setDate] = useState<string>('');
  const googleRef = useRef<typeof google | null>(null); // Store Google API

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      googleRef.current = window.google;
    }
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPath = [
        ...path,
        { lat: event.latLng.lat(), lng: event.latLng.lng() },
      ];

      if (newPath.length > 1 && googleRef.current) {
        const lastPoint = newPath[newPath.length - 2];
        const newPoint = newPath[newPath.length - 1];

        // Compute distance in meters and convert to kilometers
        const segmentDistance =
          googleRef.current.maps.geometry.spherical.computeDistanceBetween(
            lastPoint,
            newPoint
          );

        setDistance(
          (prevDistance) => prevDistance + segmentDistance * 0.000621371
        ); // Convert to miles
      }

      setPath(newPath);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload

    if (path.length === 0) {
      alert('Please add some points to the map before saving.');
      return;
    }

    const formattedDate = date ? new Date(date + 'UTC').toISOString() : null;

    setLoading(true);

    try {
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slugify(shortDescription),
          path,
          shortDescription,
          longDescription,
          staticMapUrl,
          date: formattedDate,
          distance: parseFloat(distance.toFixed(2)),
        }),
      });

      if (response.ok) {
        toast.success('Route saved successfully!');
        setPath([]);
        setShortDescription('');
        setLongDescription('');
        setStaticMapUrl('');
        setDate('');
        setDistance(0);
      } else {
        toast.error(
          <div className="text-destructive">Failed to save the route.</div>
        );
      }
    } catch (error) {
      console.error('Error saving route:', error);
      toast.warning(
        <div className="text-destructive">
          An error occurred while saving the route.
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '20px' }}>
      <h2>Bike Route Planner</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <Input
          type="text"
          placeholder="Ride Title..."
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="mb-3"
          required
        />
        <Input
          type="text"
          placeholder="Description..."
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          className="mb-3"
          required
        />
        <Input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-none"
          required
        />

        {/* Hidden input to include path in form validation */}
        <input type="hidden" value={JSON.stringify(path)} required />

        <div style={{ position: 'relative', width: '100%', height: '600px' }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={12}
            onClick={handleMapClick}
          >
            <Polyline
              path={path}
              options={{ strokeColor: '#FF0000', strokeWeight: 4 }}
            />
            {savedRoutes.map((route) => (
              <Polyline
                key={route.id}
                path={route.path}
                options={{ strokeColor: '#00FF00', strokeWeight: 4 }}
              />
            ))}
          </GoogleMap>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="p-3 bg-blue-500 text-white rounded disabled:bg-gray-500"
        >
          {loading ? 'Saving...' : 'Save Route'}
        </Button>
      </form>
    </div>
  );
};

export default CreateRide;
