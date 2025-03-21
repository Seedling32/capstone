import { Metadata } from 'next';
import CreateRide from './CreateRide';
import { requireAdmin } from '@/lib/auth-guard';

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
      <CreateRide />
    </>
  );
};

export default AdminCreateRide;
