import { getRideBySlug } from '@/lib/actions/ride.actions';
import DynamicMap from '@/components/shared/map/DynamicMap';
import SignUpForRide from '@/components/shared/rides/signup-for-ride';
import { auth } from '@/auth';
import { formatDateTime } from '@/lib/utils';

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

  // Parse path from string to array of objects if needed
  const parsedPath =
    typeof ride.path === 'string' ? JSON.parse(ride.path) : ride.path;

  return (
    <div className="container flex flex-col justify-self-center justify-between  gap-10 mt-8 mx-4 md:flex-row">
      <div className="max-w-[300px]">
        <h1 className="text-3xl font-bold mb-4">{ride.shortDescription}</h1>
        <p className="text-lg mb-4">{ride.longDescription}</p>
        <ul className="mb-6">
          <li>Distance: {ride.distance} Miles</li>
          <li>Date: {formatDateTime(ride.date).dateTime}</li>
        </ul>
        {session && (
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
        )}
      </div>
      <div className="container mx-auto p-6">
        <DynamicMap path={parsedPath} zoom={15} />
      </div>
    </div>
  );
};

export default RideDetailsPage;
