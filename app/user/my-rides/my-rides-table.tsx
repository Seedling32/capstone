import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMyRide } from '@/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';

const RidesTable = ({ rides }: { rides: getMyRide }) => {
  return (
    <>
      <h1 className="py-4 h2-bold">My Rides</h1>
      {!rides || rides.rides.length < 1 ? (
        <div>
          <p>No rides to display.</p>
          <Button type="button" className="mt-4">
            <Link href="/rides">Sign Up For Rides</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ride</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Distance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rides.rides.map((ride) => (
                  <TableRow key={ride.slug}>
                    <TableCell>
                      <Link
                        href={`/rides/${ride.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={ride.staticMapUrl}
                          alt={ride.shortDescription}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{ride.shortDescription}</span>
                      </Link>
                    </TableCell>
                    <TableCell>{formatDateTime(ride.date).dateTime}</TableCell>
                    <TableCell>{ride.distance} Miles</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default RidesTable;
