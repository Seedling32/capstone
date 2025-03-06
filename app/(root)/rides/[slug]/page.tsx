import { getRideBySlug } from '@/lib/actions/ride.actions';
import DynamicMap from '@/components/shared/map/DynamicMap';
import SignUpForRide from '@/components/shared/rides/signup-for-ride';
import { auth } from '@/auth';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const RideDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const ride = await getRideBySlug(slug);

  if (!ride) {
    return <p>Ride not found.</p>;
  }

  // See if there's a session for dynamic content
  const session = await auth();

  // Parse path from string to array of objects for dynamic map
  const parsedPath =
    typeof ride.path === 'string' ? JSON.parse(ride.path) : ride.path;
  console.log(parsedPath);

  // Calculate dynamic zoom level based on path length
  const calculateZoom = (path: { lat: number; lng: number }[]) => {
    // Close zoom for a single point
    if (path.length < 15) return 15;
    // Zoomed in for a small ride
    else return 13;
  };

  const zoomLevel = calculateZoom(parsedPath);

  return (
    <div className="container flex flex-col justify-self-center justify-between  gap-10 mt-8 px-8 md:flex-row">
      <div className="max-w-full md:max-w-[33%]">
        <h1 className="text-3xl font-bold mb-4">{ride.shortDescription}</h1>
        <p className="text-lg mb-4">{ride.longDescription}</p>
        <ul className="mb-6">
          <li>Distance: {ride.distance} Miles</li>
          <li>Date: {formatDateTime(ride.date).dateOnly}</li>
          <li>Time: {formatDateTime(ride.date).timeOnly}</li>
        </ul>
        {session ? (
          <SignUpForRide
            ride={{
              ride_id: ride.ride_id,
              shortDescription: ride.shortDescription,
              slug: ride.slug,
              date: ride.date,
              distance: ride.distance,
              staticMapUrl: ride.staticMapUrl,
            }}
          />
        ) : (
          <>
            <p>Please sign in to register for rides.</p>
            <Button>
              <Link href="/sign-in">Sign-in</Link>
            </Button>
          </>
        )}
      </div>
      <div className="container">
        <DynamicMap path={parsedPath} zoom={zoomLevel} />
      </div>
    </div>
  );
};

export default RideDetailsPage;
