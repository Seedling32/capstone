import RideList from '@/components/shared/rides/ride-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeatherWidget from '@/components/weather-widget';
import { getLatestRides } from '@/lib/actions/ride.actions';
import Image from 'next/image';
import Link from 'next/link';

const HomePage = async () => {
  const rideData = await getLatestRides();

  return (
    <div>
      <div className="flex flex-col bg-hero-small min-h-[50vh] text-white md:bg-hero-large relative z-10">
        <div className="absolute top-10 flex flex-col gap-4 md:top-[180px] md:left-20 translate-y-[100px]  max-w-[650px]">
          <h1 className="text-left text-7xl font-bold text-shadow uppercase max-w-[550px]">
            Connect & ride with the ultimate hub for community cycling
          </h1>
          <p className="text-lg text-popover-foreground">
            Pedal Pact makes it easy to discover new routes, join group rides,
            and share the adventure with cyclists of all levels.
          </p>
          <Button asChild className="max-w-32">
            <Link href="/register">Join for free</Link>
          </Button>
        </div>
      </div>
      <section className="mt-[250px] border-t bg-muted drop-shadow-xl py-16 px-4">
        <RideList title="Upcoming Rides" data={rideData} />
      </section>
      <section className="py-16 text-center max-w-6xl mx-auto px-4">
        <div className="bg-muted flex flex-col gap-6 p-6 border rounded-xl md:gap-0 md:flex-row-reverse items-center shadow-xl">
          <div>
            <h2 className="text-6xl mb-4">How it works</h2>
            <ol className="flex flex-col gap-16 md:-translate-x-[100px]">
              <li>
                <Card>
                  <CardHeader>
                    <CardTitle>Step 1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    Sign-up for free to join the community.
                  </CardContent>
                </Card>
              </li>
              <li>
                <Card>
                  <CardHeader>
                    <CardTitle>Step 2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    Browse existing routes or events near you.
                  </CardContent>
                </Card>
              </li>
              <li>
                <Card>
                  <CardHeader>
                    <CardTitle>Step 3</CardTitle>
                  </CardHeader>
                  <CardContent>
                    Meet fellow cyclists and enjoy the ride!
                  </CardContent>
                </Card>
              </li>
            </ol>
          </div>
          <Image
            src={'/images/portrait-home.png'}
            alt="David Graham."
            width={500}
            height={686}
            className="rounded-lg"
          />
        </div>
      </section>
      <div className=" wrapper">
        <WeatherWidget />
      </div>
    </div>
  );
};

export default HomePage;
