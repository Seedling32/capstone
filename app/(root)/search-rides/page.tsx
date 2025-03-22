import Pagination from '@/components/shared/pagination';
import RideCard from '@/components/shared/rides/ride-card';
import { getAllRides } from '@/lib/actions/ride.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rides',
};

const SearchRidesPage = async (props: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    difficulty?: string;
    distance?: string;
    sort?: string;
  }>;
}) => {
  const {
    page = '1',
    q = 'all',
    difficulty = 'all',
    distance = 'all',
    sort = 'newest',
  } = await props.searchParams;

  // Construct the filter Url
  const getFilterUrl = ({
    pg,
    dif,
    dis,
    s,
  }: {
    pg?: string;
    dif?: string;
    dis?: string;
    s?: string;
  }) => {
    const params = { q, difficulty, distance, sort, page };

    if (pg) params.page = pg;
    if (dif) params.difficulty = dif;
    if (dis) params.distance = dis;
    if (s) params.sort = s;
    if (pg) params.page = pg;

    return `/search-rides?${new URLSearchParams(params).toString()}`;
  };

  const rides = await getAllRides({
    page: Number(page),
    query: q,
    difficulty,
    distance,
    sort,
  });

  return (
    <div className="grid my-8 md:grid-cols-5 md:gap-5">
      <div className="filter-links">{/* Filter Links */}</div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {rides.data.length === 0 && <div>No rides found.</div>}
          {rides.data.map((ride) => (
            <RideCard key={ride.ride_id} ride={ride} />
          ))}
        </div>
        <Pagination page={Number(page) || 1} totalPages={rides.totalPages} />
      </div>
    </div>
  );
};

export default SearchRidesPage;
