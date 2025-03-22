import { Metadata } from 'next';
import RideForm from '../ride-form';
import { requireAdmin } from '@/lib/auth-guard';
import GoogleMapsWrapper from '@/components/shared/map/google-maps-wrapper';

export const metadata: Metadata = {
  title: 'Create Ride',
};

const AdminCreateRide = async () => {
  await requireAdmin();

  return (
    <>
      <h2 className="h2-bold">Create Ride</h2>
      <p>
        Fill out the Ride Title, Description, and Date. Don&apos;t forget to
        generate the slug!
      </p>
      <GoogleMapsWrapper>
        <RideForm type="Create" />
      </GoogleMapsWrapper>
    </>
  );
};

export default AdminCreateRide;
