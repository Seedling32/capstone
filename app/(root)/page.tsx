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
      <div className="flex flex-col bg-hero-small min-h-[40vh] md:bg-hero-large lg:min-h-[60vh] relative z-10">
        <div className="absolute px-2 top-32 md:top-4 flex flex-col gap-4 md:left-20  max-w-[650px]">
          <h1 className="text-left text-[clamp(1.5rem,5vw,4rem)] font-bold text-white text-shadow uppercase max-w-[550px]">
            Connect & ride with the ultimate hub for community cycling
          </h1>
          <p className="text-lg text-popover-foreground bg-white/50 rounded-md px-4 text-black">
            Pedal Pact makes it easy to discover new routes, join group rides,
            and share the adventure with cyclists of all levels.
          </p>
          <Button asChild className="max-w-32">
            <Link href="/register">Join for free</Link>
          </Button>
        </div>
      </div>
      <section className="border-t bg-muted drop-shadow-xl py-16 px-4 bg-gradient-to-t from-transparent to-background">
        <RideList title="Upcoming Rides" data={rideData} />
      </section>
      <section className="py-16 text-center max-w-6xl mx-auto px-4">
        <div className="bg-muted flex flex-col gap-6 p-6 rounded-xl md:gap-0 md:flex-row-reverse items-center shadow-xl bg-gradient-to-t from-transparent to-background">
          <div className="min-w-[225px] flex-1">
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
          <div className="flex-shrink md:flex-1">
            <Image
              src={'/images/portrait-home.png'}
              alt="David Graham."
              width={500}
              height={686}
              className="rounded-lg w-full max-w-[500px] height-auto"
            />
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="h2-bold capitalize mb-6">- Who Pedal-Pact is for -</h2>
          <ul className="space-y-4 text-lg">
            <li> Road cyclists chasing long miles</li>
            <li> Casual cruisers exploring scenic routes</li>
            <li> Weekend adventurers discovering new paths</li>
            <li> Ride leaders building community events</li>
          </ul>
        </div>
      </section>
      <div className="wrapper">
        <WeatherWidget />
      </div>
    </div>
  );
};

export default HomePage;
