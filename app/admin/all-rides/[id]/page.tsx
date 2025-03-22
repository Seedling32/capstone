import RideForm from '../ride-form';
import { getRideById } from '@/lib/actions/ride.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Update Ride',
};

const AdminUpdateRidePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const ride = await getRideById(id);

  if (!ride) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Ride</h1>
      <RideForm type="Update" ride={ride} rideId={ride.ride_id} />
    </div>
  );
};

export default AdminUpdateRidePage;
