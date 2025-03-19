import { Metadata } from 'next';
import { getUserRideById } from '@/lib/actions/ride.actions';
import { notFound } from 'next/navigation';
import RideDetailsTable from './ride-details-table';

export const metadata: Metadata = {
  title: 'Ride Details',
};

const UserRidesDetailsPage = async (props: {
  params: Promise<{
    userRideId: string;
  }>;
}) => {
  const { userRideId } = await props.params;

  const userRide = await getUserRideById(userRideId);
  if (!userRide) notFound();

  return <RideDetailsTable userRide={userRide} />;
};

export default UserRidesDetailsPage;
