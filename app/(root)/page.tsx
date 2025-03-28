import RideList from '@/components/shared/rides/ride-list';
import { getLatestRides } from '@/lib/actions/ride.actions';
import Image from 'next/image';

const HomePage = async () => {
  const rideData = await getLatestRides();

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-4 bg-hero-small min-h-96 text-white text-center md:bg-hero-large relative">
        <div className="absolute top-10 flex justify-center items-center mx-auto md:top-[180px] md:left-6">
          <h1 className="text-left text-4xl font-bold text-shadow uppercase max-w-[300px]">
            Connect and ride, together
          </h1>
        </div>
      </div>
      <RideList title="Upcoming Rides" data={rideData} />
      <div className=" wrapper mt-14">
        <Image
          src="/images/portrait-home.png"
          width={387}
          height={643}
          alt="Sunrise bike ride with friends."
        />
      </div>
    </div>
  );
};

export default HomePage;
