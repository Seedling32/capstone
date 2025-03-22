import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';
import { getAllRides, deleteRide } from '@/lib/actions/ride.actions';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';

export const metadata: Metadata = {
  title: 'All Rides',
};

const AdminAllRides = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    difficulty: string;
  }>;
}) => {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const difficulty = searchParams.difficulty || '';

  const rides = await getAllRides({
    query: searchText,
    page,
    difficulty,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">All Rides</h1>
        <Button asChild variant="default">
          <Link href="/admin/all-rides/create-ride">Create New Ride</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ride</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Attendees</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rides.data.map((ride) => (
            <TableRow key={ride.ride_id}>
              <TableCell>
                <Link
                  href={`/rides/${ride.slug}`}
                  className="flex items-center"
                >
                  <Image
                    src={ride.staticMapUrl!}
                    alt={ride.shortDescription}
                    width={50}
                    height={50}
                  />
                  <span className="px-2">{ride.shortDescription}</span>
                </Link>
              </TableCell>
              <TableCell>{formatDateTime(ride.date).dateTime}</TableCell>
              <TableCell>{ride.distance} Miles</TableCell>
              <TableCell>
                {ride.difficulty.charAt(0).toUpperCase() +
                  ride.difficulty.slice(1)}
              </TableCell>
              <TableCell>{ride.user_ride.length}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Link href={`/admin/all-rides/${ride.ride_id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={ride.ride_id} action={deleteRide} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rides.totalPages > 1 && (
        <Pagination page={Number(page) || 1} totalPages={rides?.totalPages} />
      )}
    </div>
  );
};

export default AdminAllRides;
