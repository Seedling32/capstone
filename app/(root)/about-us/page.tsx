import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Handshake, Heart, Leaf, Lightbulb, Map, Users } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
};

const AboutUsPage = () => {
  return (
    <div>
      <section className="flex flex-col justify-center items-center mb-4 bg-hero-small min-h-96 text-white text-center md:bg-sunrise-hero bg-center relative">
        <div className="absolute top-10 flex justify-center items-center mx-auto md:top-[180px] md:left-20">
          <h1 className="text-left text-5xl font-bold text-shadow uppercase max-w-[475px] bg-gradient-to-l from-slate-400/50 to-transparent rounded-lg">
            Ride together, explore further
          </h1>
        </div>
      </section>
      <section className="max-w-6xl mx-auto py-16 px-4 flex flex-col-reverse md:flex-row items-center gap-10">
        <Image
          src={'/images/turn.jpg'}
          alt="Cyclists making a sharp turn."
          width={500}
          height={333}
          className="rounded-sm"
        />
        <div>
          <h2 className="h2-bold mb-4">The story behind Pedal-Pact</h2>
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
      <section className="py-16 bg-accent">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="h2-bold capitalize mb-8">What we offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent>
                <CardHeader>
                  <CardTitle className="capitalize">Custom maps</CardTitle>
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
                  <CardTitle className="capitalize">Custom maps</CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col items-center">
                  <Map width={100} height={100} />
                  Explore our custom routes with an interactive map.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="h2-bold capitalize mb-6">Who Pedal-Pact is for</h2>
          <ul className="space-y-4 text-lg">
            <li className="before:content-['-']">
              {' '}
              Road cyclists chasing long miles
            </li>
            <li className="before:content-['-']">
              {' '}
              Casual cruisers exploring scenic routes
            </li>
            <li className="before:content-['-']">
              {' '}
              Weekend adventurers discovering new paths
            </li>
            <li className="before:content-['-']">
              {' '}
              Ride leaders building community events
            </li>
          </ul>
        </div>
      </section>
      <section className="bg-accent py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="h2-bold capitalize mb-8">Our values</h2>
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
                  <CardTitle className="capitalize">Continuos growth</CardTitle>
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
        <div className="flex flex-col md:flex-row gap-4 justify-center">
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
