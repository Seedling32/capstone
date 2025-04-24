import Pagination from '@/components/shared/pagination';
import RideCard from '@/components/shared/rides/ride-card';
import { Button } from '@/components/ui/button';
import { getAllRides, getAllDifficulties } from '@/lib/actions/ride.actions';
import Link from 'next/link';

const distances = [
  {
    name: '0-5 Miles',
    value: '0-5',
  },
  {
    name: '5-10 Miles',
    value: '5.01-10',
  },
  {
    name: '10-15 Miles',
    value: '10.01-15',
  },
  {
    name: '15-20 Miles',
    value: '15.01-20',
  },
  {
    name: '20 Miles & Up',
    value: '20.01-100',
  },
];

const sortOrders = ['newest', 'shortest', 'longest'];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    difficulty: string;
    distance: string;
    sort: string;
  }>;
}) {
  const {
    q = 'all',
    difficulty = 'all',
    distance = 'all',
    sort = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim()! == '';
  const isDifficultySet =
    difficulty && difficulty !== 'all' && difficulty.trim()! == '';
  const isDistanceSet =
    distance && distance !== 'all' && distance.trim()! == '';
  const isSortSet = sort && sort !== 'all' && sort.trim()! == '';

  if (isQuerySet || isDifficultySet || isDistanceSet || isSortSet) {
    return {
      title: `
    Search ${isQuerySet ? q : ''}
    ${isDifficultySet ? `: Difficulty ${difficulty}` : ''}
    ${isDistanceSet ? `: Distance ${distance}` : ''}
    ${isSortSet ? `: Sort by ${sort}` : ''}`,
    };
  } else {
    return {
      title: 'Rides',
    };
  }
}

const SearchRidesPage = async (props: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    difficulty?: string;
    distance?: string;
    sort?: string;
    state?: string;
  }>;
}) => {
  const {
    page = '1',
    q = 'all',
    difficulty = 'all',
    distance = 'all',
    sort = 'newest',
    state = 'all',
  } = await props.searchParams;

  // Construct the filter Url
  const getFilterUrl = ({
    pg,
    dif,
    dis,
    sor,
    sta,
  }: {
    pg?: string;
    dif?: string;
    dis?: string;
    sor?: string;
    sta?: string;
  }) => {
    const params = { q, difficulty, distance, sort, page, state };

    if (pg) params.page = pg;
    if (dif) params.difficulty = dif;
    if (dis) params.distance = dis;
    if (sor) params.sort = sor;
    if (pg) params.page = pg;
    if (sta) params.state = sta;

    return `/search-rides?${new URLSearchParams(params).toString()}`;
  };

  const rides = await getAllRides({
    page: Number(page),
    query: q,
    difficulty,
    distance,
    sort,
    state,
  });

  const difficulties = await getAllDifficulties();

  return (
    <div className="wrapper grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Difficulty Links */}
        <div className="text-xl mb-2 mt-3">Difficulty</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (difficulty === 'all' || difficulty === '') && 'font-bold'
                }`}
                href={getFilterUrl({ dif: 'all' })}
              >
                Any
              </Link>
            </li>
            {difficulties.map((x) => (
              <li key={x.difficulty}>
                <Link
                  className={`${difficulty === x.difficulty && 'font-bold'}`}
                  href={getFilterUrl({ dif: x.difficulty })}
                >
                  {x.difficulty.charAt(0).toUpperCase() + x.difficulty.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Distance Links */}
        <div className="text-xl mb-2 mt-3">Distance</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${distance === 'all' && 'font-bold'}`}
                href={getFilterUrl({ dis: 'all' })}
              >
                Any
              </Link>
            </li>
            {distances.map((d) => (
              <li key={d.value}>
                <Link
                  className={`${distance === d.value && 'font-bold'}`}
                  href={getFilterUrl({ dis: d.value })}
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center gap-2">
            <span>{q !== 'all' && q !== '' && 'Query: ' + q}</span>
            <span>
              {difficulty !== 'all' &&
                difficulty !== '' &&
                'Difficulty: ' +
                  difficulty.charAt(0).toUpperCase() +
                  difficulty.slice(1)}
            </span>
            <span>
              {distance !== 'all' && 'Distance: ' + distance + ' Miles'}
            </span>
            <span>{state !== 'all' && 'State: ' + state}</span>
            {(q !== 'all' && q !== '') ||
            (difficulty !== 'all' && difficulty !== '') ||
            distance !== 'all' ||
            state !== 'all' ? (
              <Button variant={'link'} asChild className="border">
                <Link href="/search-rides">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by:{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort == s && 'font-bold'}`}
                href={getFilterUrl({ sor: s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
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
