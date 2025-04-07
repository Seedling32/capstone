import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Charts from './charts';
import { getRideSummary } from '@/lib/actions/ride.actions';
import { formatDateTime } from '@/lib/utils';
import {
  BikeIcon,
  CheckCircleIcon,
  ClipboardPlus,
  UsersRound,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'Overview',
};

const AdminOverviewPage = async () => {
  await requireAdmin();

  const summary = await getRideSummary();

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <BikeIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalRidesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersRound />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.usersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              All Time Sign Ups
            </CardTitle>
            <ClipboardPlus />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.userRidesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Months Sign Ups
            </CardTitle>
            <CheckCircleIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.riderData?.[0]?.activeUsers ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts
              data={{
                riderData: summary.riderData,
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recently Signed Up</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Ride</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestRides.map((entry) => (
                  <TableRow key={entry.user_ride_id}>
                    <TableCell>{`${entry.user.firstName} ${entry.user.lastName}`}</TableCell>
                    <TableCell>
                      {entry.ride_id
                        ? entry.ride.shortDescription
                        : 'Deleted Ride'}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(entry.date_signed_up).dateOnly}
                    </TableCell>
                    <TableCell>
                      <Link href={`../rides/${entry.ride.slug}`}>
                        <Button type="button">Details</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
