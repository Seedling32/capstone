import { Metadata } from 'next';
import RideForm from '../ride-form';
import { requireAdmin } from '@/lib/auth-guard';
import GoogleMapsWrapper from '@/components/shared/map/google-maps-wrapper';
import InstructionsDrawer from '@/components/admin/instructions-drawer';

export const metadata: Metadata = {
  title: 'Create Ride',
};

const AdminCreateRide = async () => {
  await requireAdmin();

  return (
    <>
      <h2 className="h2-bold">Create Ride</h2>
      <p>
        Fill out the form to create a ride. Click the button for more specific
        instructions.
      </p>
      <InstructionsDrawer />
      <GoogleMapsWrapper>
        <RideForm type="Create" />
      </GoogleMapsWrapper>
    </>
  );
};

export default AdminCreateRide;
