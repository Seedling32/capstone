import RideCard from './ride-card';
import { RideWithLocation } from '@/types';

const RideList = ({
  data,
  title,
  limit,
}: {
  data: RideWithLocation[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="relative flex flex-col w-full">
      <h2 className="h2-bold uppercase mb-4 text-center">{title}</h2>
      {data.length > 0 ? (
        <div className="overflow-hidden w-full group">
          <div className="flex w-fit animate-scroll-left whitespace-nowrap group-hover:[animation-play-state:paused]">
            <div className="flex">
              {limitedData.map((ride: RideWithLocation, index) => (
                <div key={`${ride.ride_id}-${index}`} className="mx-4">
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
            <div className="flex">
              {limitedData.map((ride: RideWithLocation, index) => (
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
