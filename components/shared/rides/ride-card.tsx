import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Ride } from '@/types';
import { limitedDescription } from '@/lib/utils';

const RideCard = ({ ride }: { ride: Ride }) => {
  return (
    <Card className="flex flex-col w-full max-w-sm shadow-xl">
      <CardHeader className="p-0 items-center">
        <Link href={`/rides/${ride.slug}`}>
          <Image
            src={ride.staticMapUrl}
            alt={ride.shortDescription}
            height={300}
            width={300}
            priority={true}
            className="rounded-t-lg"
          />
        </Link>
      </CardHeader>
      <CardContent className="grow flex flex-col justify-between p-4">
        <Link href={`/rides/${ride.slug}`}>
          <h3 className="h3-bold">{ride.shortDescription}</h3>
          <p className="text-m">{limitedDescription(ride.longDescription)}</p>
        </Link>
        <div>
          <p className="font-bold">{ride.distance} Miles</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
