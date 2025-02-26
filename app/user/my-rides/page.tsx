import { Metadata } from 'next';
import { getMyRides } from '@/lib/actions/ride.actions';
import RidesTable from './my-rides-table';

export const metadata: Metadata = {
  title: 'My Rides',
};

const MyRidesPage = async () => {
  const rides = await getMyRides();

  return (
    <>
      <RidesTable rides={rides} />
    </>
  );
};

export default MyRidesPage;
