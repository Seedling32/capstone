import InstructionsDrawer from '@/components/admin/instructions-drawer';
import RideForm from '../ride-form';
import { getRideById } from '@/lib/actions/ride.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GoogleMapsWrapper from '@/components/shared/map/google-maps-wrapper';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'Update Ride',
};

const AdminUpdateRidePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  await requireAdmin();
  const { id } = await props.params;

  const ride = await getRideById(id);

  if (!ride) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Ride</h1>
      <p>
        Edit the form to update a ride. Click the button for more specific
        instructions.
      </p>
      <InstructionsDrawer />
      <GoogleMapsWrapper>
        <RideForm type="Update" ride={ride} rideId={ride.ride_id} />
      </GoogleMapsWrapper>
    </div>
  );
};

export default AdminUpdateRidePage;
