import { Metadata } from 'next';
import { getMyRides } from '@/lib/actions/ride.actions';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import RideCard from '@/components/shared/rides/ride-card';

export const metadata: Metadata = {
  title: 'My Rides',
};

const MyRidesPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;

  const rides = await getMyRides({
    page: Number(page) || 1,
  });

  return (
    <>
      <h1 className="py-4 h2-bold">My Rides</h1>
      {!rides || rides.userRides.length < 1 ? (
        <div>
          <p>No rides to display.</p>
          <Button type="button" className="mt-4">
            <Link href="/search-rides">Sign Up For Rides</Link>
          </Button>
        </div>
      ) : (
        <section>
          <div className="flex flex-col items-center gap-4 md:hidden">
            {rides.userRides.map((ride) => (
              <div
                key={ride.ride_id}
                className="space-y-4 border p-4 rounded-lg bg-foreground"
              >
                <Badge
                  variant={
                    ride.status === 'SIGNED_UP' || ride.status === 'COMPLETED'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {ride.status === 'SIGNED_UP'
                    ? 'Signed Up'
                    : ride.status === 'CANCELED'
                      ? 'Canceled'
                      : ride.status === 'COMPLETED'
                        ? 'Completed'
                        : 'No Show'}
                </Badge>
                <RideCard ride={ride.ride} />
                <Button variant="outline" size="sm">
                  <Link href={`/user/my-rides/${ride.user_ride_id}`}>
                    Details
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-3 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ride</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rides.userRides.map((ride) => (
                    <TableRow key={ride.ride.slug}>
                      <TableCell>
                        <Link
                          href={`/rides/${ride.ride.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={ride.ride.staticMapUrl!}
                            alt={ride.ride.shortDescription}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">
                            {ride.ride.shortDescription}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {formatDateTime(ride.ride.date).dateTime}
                      </TableCell>
                      <TableCell>{ride.ride.distance} Miles</TableCell>
                      <TableCell>{ride.ride.location.city}</TableCell>
                      <TableCell>
                        {ride.ride.difficulty.charAt(0).toUpperCase() +
                          ride.ride.difficulty.slice(1)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ride.status === 'SIGNED_UP' ||
                            ride.status === 'COMPLETED'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {ride.status === 'SIGNED_UP'
                            ? 'Signed Up'
                            : ride.status === 'CANCELED'
                              ? 'Canceled'
                              : ride.status === 'COMPLETED'
                                ? 'Completed'
                                : 'No Show'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Link href={`/user/my-rides/${ride.user_ride_id}`}>
                            Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {rides.totalPages > 1 && (
                <Pagination
                  page={Number(page) || 1}
                  totalPages={rides?.totalPages}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default MyRidesPage;
