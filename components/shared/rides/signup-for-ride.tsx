'use client';

import { useRouter } from 'next/navigation';
import { Plus, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { rideItem } from '@/types';
import { addRideToUserRide } from '@/lib/actions/ride.actions';
import { useTransition } from 'react';

const SignUpForRide = ({ ride }: { ride: rideItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleSignUpForRide = async () => {
    startTransition(async () => {
      const response = await addRideToUserRide(ride);

      if (!response.success) {
        toast(<div className="text-destructive">{response.message}</div>);
        return;
      }

      // Handle success add to rides
      toast(`Signed Up For ${ride.shortDescription}`, {
        action: {
          label: 'Go To Rides',
          onClick: () => router.push('/user/my-rides'),
        },
      });
    });
  };

  return (
    <Button className="w-full" type="button" onClick={handleSignUpForRide}>
      {isPending ? <Loader className="animate-spin" /> : <Plus />}
      Sign Up
    </Button>
  );
};

export default SignUpForRide;
