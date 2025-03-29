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
        <div className="overflow-hidden w-full group">
          <div className="flex w-fit animate-scroll-left whitespace-nowrap group-hover:[animation-play-state:paused]">
            <div className="flex">
              {limitedData.map((ride: Ride, index) => (
                <div key={`${ride.ride_id}-${index}`} className="mx-4">
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
            <div className="flex">
              {limitedData.map((ride: Ride, index) => (
                <div key={`${ride.ride_id}-${index}`} className="mx-4">
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
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
