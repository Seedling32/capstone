import { Metadata } from 'next';
import CreateRide from '@/components/shared/map/CreateRide';

export const metadata: Metadata = {
  title: 'Create Ride',
};

const AdminCreateRide = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 className="h2-bold">Create Ride</h1>
      <p>
        Fill out the Ride Title, Description, and Date. Then click around the
        map to create your ride.
      </p>
      <CreateRide />
    </div>
  );
};

export default AdminCreateRide;
