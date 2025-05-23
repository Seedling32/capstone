'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { getUserRide } from '@/types';
import Image from 'next/image';
import StatusForm from './status-form';

const RideDetailsTable = ({ userRide }: { userRide: getUserRide }) => {
  const { status, user_ride_id } = userRide;
  const {
    staticMapUrl,
    shortDescription,
    longDescription,
    date,
    distance,
    difficulty,
  } = userRide.ride;

  return (
    <>
      <h1 className="py-4 text-2xl">{shortDescription}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <h2 className="text-xl pb-4">Route Image</h2>
              <Image
                src={staticMapUrl!}
                alt={`Map of ${shortDescription}.`}
                width={600}
                height={500}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl">Ride Details</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Difficulty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{formatDateTime(date).dateOnly}</TableCell>
                    <TableCell>{formatDateTime(date).timeOnly}</TableCell>
                    <TableCell>{`${distance} Miles`}</TableCell>
                    <TableCell>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <h2 className="text-xl pb-4">Route Description</h2>
              <p>{longDescription}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl pb-4">
                Ride Actions for{' '}
                {`${userRide.user.firstName} ${userRide.user.lastName}`}
              </h2>
              <p className="pb-4">
                If you can&apos;t make it to a ride, please use the select menu
                below to change your status to &apos;Canceled&apos; at least
                24hrs before the ride.
              </p>
              <p>
                This helps our ride leader in preparing for the ride and knowing
                how many people to expect.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Set Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant={
                          status === 'SIGNED_UP' || status === 'COMPLETED'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {status === 'SIGNED_UP'
                          ? 'Signed Up'
                          : status === 'CANCELED'
                            ? 'Canceled'
                            : status === 'COMPLETED'
                              ? 'Completed'
                              : 'No Show'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusForm userRideId={user_ride_id} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RideDetailsTable;
