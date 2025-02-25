'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { rideItem } from '@/types';
import { addRideToUserRide } from '@/lib/actions/signup.actions';

const SignUpForRide = ({ ride }: { ride: rideItem }) => {
  const router = useRouter();

  const handleSignUpForRide = async () => {
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
  };

  return (
    <Button className="w-full" type="button" onClick={handleSignUpForRide}>
      <Plus />
      Sign Up
    </Button>
  );
};

export default SignUpForRide;
