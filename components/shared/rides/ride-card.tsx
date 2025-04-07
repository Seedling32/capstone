import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RideWithLocation } from '@/types';
import { limitedDescription } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';

const RideCard = ({ ride }: { ride: RideWithLocation }) => {
  console.log(ride);

  return (
    <Card className="flex flex-col w-full max-w-[300px] shadow-xl overflow-hidden">
      <CardHeader className="p-0 items-center">
        <Link href={`/rides/${ride.slug}`}>
          <Image
            src={ride.staticMapUrl!}
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
        <div className="mt-2">
          <hr />
          <p className="font-bold">
            Difficulty:{' '}
            {ride.difficulty.charAt(0).toUpperCase() + ride.difficulty.slice(1)}
          </p>
          <p className="font-bold">Length: {ride.distance} Miles</p>
          <p className="font-bold">
            Date: {formatDateTime(ride.date).dateTime}
          </p>
          <p className="font-bold">Location: {ride.location.city}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
