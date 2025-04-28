import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';
import { getAllUserRides } from '@/lib/actions/ride.actions';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AdminSearch from '@/components/admin/admin-search';

export const metadata: Metadata = {
  title: 'User Rides',
};

const AdminUserRides = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  await requireAdmin();
  const { page = '1', query: searchText } = await props.searchParams;

  const userRides = await getAllUserRides({
    page: Number(page),
    query: searchText,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Sign Ups</h1>
        {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>{' '}
            <Link href="/admin/user-rides">
              <Button variant="outline" size="sm">
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <AdminSearch forHeader={false} />
      <div className="overflow-x-auto">
        <Table className="hidden lg:table">
          <TableHeader>
            <TableRow>
              <TableHead>Ride</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userRides.data.map((ride) => (
              <TableRow key={ride.user_ride_id}>
                <TableCell className="flex">
                  <Image
                    src={ride.ride.staticMapUrl!}
                    alt={ride.ride.shortDescription}
                    width={50}
                    height={50}
                  />
                  <span className="px-2">{ride.ride.shortDescription}</span>
                </TableCell>
                <TableCell>
                  {`${ride.user.firstName} ${ride.user.lastName}`}
                </TableCell>
                <TableCell>{formatDateTime(ride.ride.date).dateTime}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/user/my-rides/${ride.user_ride_id}`}>
                      Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2  justify-items-center gap-4 lg:hidden">
          {userRides.data.map((ride) => (
            <Card key={ride.user_ride_id} className="drop-shadow-lg">
              <CardHeader className="p-0 items-center">
                <Link href={`/rides/${ride.ride.slug}`}>
                  <Image
                    src={ride.ride.staticMapUrl!}
                    alt={ride.ride.shortDescription}
                    height={300}
                    width={300}
                    priority={true}
                    className="rounded-t-lg"
                  />
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 mt-4">
                <ul className="flex flex-col gap-2">
                  <li>
                    <strong>Ride: </strong>
                    {ride.ride.shortDescription}
                  </li>
                  <li>
                    <strong>User: </strong>
                    {`${ride.user.firstName} ${ride.user.lastName}`}
                  </li>
                  <li>
                    <strong>Date: </strong>
                    {formatDateTime(ride.ride.date).dateTime}
                  </li>
                  <li className="flex justify-between">
                    <strong>Status: </strong>
                    <Badge
                      className="mr-4"
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
                  </li>
                </ul>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/user/my-rides/${ride.user_ride_id}`}>
                    Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {userRides?.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={userRides?.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUserRides;
