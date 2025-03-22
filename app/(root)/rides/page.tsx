import Pagination from '@/components/shared/pagination';
import RideList from '@/components/shared/rides/ride-list';
import { getAllRidesPage } from '@/lib/actions/ride.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rides',
};

const RidesPage = async (props: {
  searchParams: Promise<{
    page: number;
    query: string;
    difficulty: string;
  }>;
}) => {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const difficulty = searchParams.difficulty || '';

  const rides = await getAllRidesPage({
    query: searchText,
    page,
    difficulty,
  });

  return (
    <div className="mb-8">
      <RideList data={rides.data} title="Explore our rides" />
      <Pagination page={Number(page) || 1} totalPages={rides.totalPages} />
    </div>
  );
};

export default RidesPage;
