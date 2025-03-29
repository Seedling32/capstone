import { getRideBySlug } from '@/lib/actions/ride.actions';
import DynamicMap from '@/components/shared/map/DynamicMap';
import ElevationChart from './elevation-chart';
import SignUpForRide from '@/components/shared/rides/signup-for-ride';
import { auth } from '@/auth';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { prisma } from '@/db/prisma';
import { Card, CardContent } from '@/components/ui/card';
import GoogleMapsWrapper from '@/components/shared/map/google-maps-wrapper';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
  const userRide = await prisma.user_ride.findFirst({
    where: {
      ride_id: ride.ride_id,
      user_id: session?.user?.id,
    },
  });

  // Get other users who are going on this ride
  const otherRiders = await prisma.user_ride.findMany({
    where: { ride_id: ride.ride_id },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  // Parse path from string to array of objects for dynamic map
  const parsedPath =
    typeof ride.path === 'string' ? JSON.parse(ride.path) : ride.path;

  // Parse elevation for chart
  const parsedElevation =
    typeof ride.elevation === 'string'
      ? JSON.parse(ride.elevation)
      : ride.elevation;

  // Calculate dynamic zoom level based on path length
  const calculateZoom = (path: { lat: number; lng: number }[]) => {
    // Close zoom for a single point
    if (path.length < 15) return 15;
    // Zoomed in for a small ride
    else return 13;
  };

  const zoomLevel = calculateZoom(parsedPath);

  return (
    <div className="px-4 sm:px-0 justify-self-center container mt-8 grid md:grid-cols-3 gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{ride.shortDescription}</h1>
        <p className="text-lg mb-4">{ride.longDescription}</p>
        <ul className="mb-6">
          <li>
            Difficulty:{' '}
            {ride.difficulty.charAt(0).toUpperCase() + ride.difficulty.slice(1)}
          </li>
          <li>Distance: {ride.distance} Miles</li>
          <li>Date: {formatDateTime(ride.date).dateOnly}</li>
          <li>Time: {formatDateTime(ride.date).timeOnly}</li>
        </ul>
        <div>
          {session && !userRide ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <p className="mb-4">Sign Up to join in on the fun!</p>
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
              </CardContent>
            </Card>
          ) : session && userRide ? (
            <Card>
              <CardContent className="p-6">
                <p>Thanks for signing up for the ride!</p>
                <p>
                  This helps us keep accurate user metrics and ultimately create
                  a better experience for our users, like you.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 flex items-center gap-2">
                <p>Please sign in to register for rides.</p>
                <Button>
                  <Link href="/sign-in">Sign-in</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="mt-6">
          <h2 className="h2-bold capitalize">Who else is going</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherRiders.length > 0 ? (
                otherRiders.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{`${user.user.firstName} ${user.user.lastName}`}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === 'SIGNED_UP' ||
                          user.status === 'COMPLETED'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {user.status === 'SIGNED_UP' ? 'Signed Up' : 'Canceled'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>
                    No other riders are signed up for this ride.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="col-span-2">
        <GoogleMapsWrapper>
          <DynamicMap path={parsedPath} zoom={zoomLevel} />
        </GoogleMapsWrapper>
        <ElevationChart data={{ rideData: parsedElevation }} />
      </div>
    </div>
  );
};

export default RideDetailsPage;
