import RideCard from './ride-card';
import { Ride } from '@/types';

const RideList = ({
  data,
  title,
  limit,
}: {
  data: Ride[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="relative flex flex-col items-center w-full">
      <h2 className="h2-bold uppercase mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="overflow-hidden w-full">
          <div className="flex gap-10 animate-scroll-left whitespace-nowrap">
            {limitedData.map((ride: Ride) => (
              <div key={ride.ride_id}>
                <RideCard ride={ride} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>No rides found.</p>
        </div>
      )}
    </div>
  );
};

export default RideList;
