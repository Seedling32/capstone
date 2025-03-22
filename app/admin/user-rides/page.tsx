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

export const metadata: Metadata = {
  title: 'User Rides',
};

const AdminUserRides = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  await requireAdmin();
  const { page = 1 } = await props.searchParams;

  const userRides = await getAllUserRides({
    page: Number(page),
  });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">All User Sign Ups</h2>
      <div className="overflow-x-auto">
        <Table>
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
        <Pagination
          page={Number(page) || 1}
          totalPages={userRides?.totalPages}
        />
      </div>
    </div>
  );
};

export default AdminUserRides;
