import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Compass,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  Map,
  Users,
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
};

const AboutUsPage = () => {
  return (
    <div>
      <section className="flex flex-col justify-center items-center bg-sunrise-hero-small text-white text-center md:bg-sunrise-hero relative md:min-h-[384px] min-h-[300px]">
        <div className="absolute top-36 flex justify-center items-center mx-auto md:top-[180px] md:left-20">
          <h1 className="text-left text-5xl font-bold text-shadow uppercase max-w-[475px]">
            Ride together, explore further
          </h1>
        </div>
      </section>
      <section className="max-w-6xl mx-auto py-16 px-4 flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="relative flex justify-center items-center flex-shrink flex-1 rounded-md max-w-[500px]">
          <Image
            src={'/images/turn.jpg'}
            alt="Cyclists making a sharp turn."
            width={500}
            height={333}
            className="rounded-md max-w-[500px] height-auto w-full"
          />
        </div>
        <div className="min-w-[320px] flex-1">
          <h2 className="h2-bold capitalize mb-4">
            The story behind Pedal-Pact
          </h2>
          <p>
            Pedal Pact began as a capstone project, but it quickly grew into
            something bigger. As a passionate cyclist and web developer, I
            wanted to create a platform that brings people together through
            shared rides and local exploration. Whether you&apos;re chasing
            sunrises, training for your next event, or just out for a casual
            cruise, Pedal Pact is here to support your journey. Every route
            mapped and every ride shared is a step toward building a stronger,
            more connected cycling community.
          </p>
        </div>
      </section>
      <section className="py-16 border-t bg-accent bg-gradient-to-b from-transparent to-background">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="h2-bold capitalize mb-8">What we offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent>
                <CardHeader>
                  <CardTitle className="capitalize">Custom routes</CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col items-center">
                  <Map width={100} height={100} />
                  Explore our custom routes with an interactive map.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <CardHeader>
                  <CardTitle className="capitalize">Group rides</CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col items-center">
                  <Users width={100} height={100} />
                  Join rides and connect with local cyclists.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <CardHeader>
                  <CardTitle className="capitalize">Discovery</CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col items-center">
                  <Compass width={100} height={100} />
                  Find hidden gems and scenic spots with curated routes.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="h2-bold capitalize text-center mb-16">
          Meet the ride leaders
        </h2>
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 mb-8">
          <div>
            <h3 className="h2-bold mb-4">David Graham</h3>
            <p>
              Hi, I&apos;m David Graham — the creator of Pedal Pact and a
              passionate cyclist at heart. I combined my love for riding with my
              background in web development to build a platform where cyclists
              can connect, explore new routes, and grow their community
              together. Whether I&apos;m coding new features or out scouting
              local trails, I&apos;m driven by the idea that every great ride
              starts with great company. When I&apos;m not working on Pedal
              Pact, you&apos;ll probably find me chasing sunrises on two wheels,
              exploring new climbs, or brainstorming ways to make this platform
              even better for fellow riders. Let&apos;s ride!
            </p>
          </div>
          <Image
            src={'/images/david.png'}
            alt="David Graham."
            width={500}
            height={624}
            className="rounded-sm"
          />
        </div>
        <div className="flex flex-col-reverse md:flex-row-reverse items-center gap-10">
          <div>
            <h3 className="h2-bold mb-4">Joe Piorkowski</h3>
            <p>
              Joe is a master woodworker and lifelong rider whose journey
              started on BMX tracks before he found his way into mountain biking
              and road cycling. Whether he&apos;s shaping timber in the shop or
              carving perfect lines through the forest, Joe brings creativity,
              precision, and passion to everything he does. With deep roots in
              craftsmanship and a love for two wheels, Joe thrives on building
              connections — both on the trails and in the cycling community. His
              favorite rides are the ones that mix fast descents with good
              company, and he&apos;s always ready to share a tip, a laugh, or a
              route recommendation. Off the bike, you&apos;ll find Joe designing
              custom creations, working on woodworking projects, or scouting out
              new adventures to bring back to the Pedal Pact crew.
            </p>
          </div>
          <Image
            src={'/images/joe.png'}
            alt="David Graham."
            width={500}
            height={624}
            className="rounded-sm"
          />
        </div>
      </section>
      <section className="bg-accent py-16 drop-shadow-xl bg-gradient-to-t from-transparent to-background">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="h2-bold capitalize mb-16">Our values</h2>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <CardHeader>
                  <CardTitle className="capitalize">Community first</CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col items-center">
                  <Heart width={100} height={100} />
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <CardHeader>
                  <CardTitle className="capitalize">Inclusion</CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col items-center">
                  <Handshake width={100} height={100} />
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <CardHeader>
                  <CardTitle className="capitalize">Sustainability</CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col items-center">
                  <Leaf width={100} height={100} />
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <CardHeader>
                  <CardTitle className="capitalize">
                    Continuous growth
                  </CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col items-center">
                  <Lightbulb width={100} height={100} />
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to Ride?</h2>
        <p className="mb-8 text-lg">
          Explore our routes and join a ride near you.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button>
            <Link href="/search-rides" className="btn-primary">
              Browse Rides
            </Link>
          </Button>
          <Button>
            <Link href="/register" className="btn-secondary">
              Register
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
