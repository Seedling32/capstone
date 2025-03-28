'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const InstructionsDrawer = () => {
  const pathName = usePathname();
  const redirectLink = pathName.includes('/admin/all-rides/create-ride')
    ? '/admin/all-rides/create-ride'
    : pathName;

  return (
    <Drawer direction="left" aria-describedby="form-instructions">
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="border"
          onClick={(e) => {
            e.currentTarget.blur();
          }}
        >
          Instructions
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <p id="form-instructions" className="sr-only">
          Follow the instructions listed below to complete the form correctly.
        </p>
        <DrawerHeader>
          <DrawerTitle>Fill out the form</DrawerTitle>
          <div className="space-y-1 mt-4">
            <ul className="space-y-8">
              <li>
                <strong>Ride Title:</strong> Set the ride title
              </li>
              <li>
                <strong>Slug:</strong> Click the generate button to set the slug
              </li>
              <li>
                <strong>Description:</strong> Set the ride description
              </li>
              <li>
                <strong>Date:</strong> Use the date picker to set the date and
                time
              </li>
              <li>
                <strong>Difficulty:</strong> Use the drop down list to set the
                difficulty
              </li>
              <li>
                <strong>Distance:</strong> The distance updates automatically as
                you create the route
              </li>
              <li>
                <strong>Use the map:</strong> Your first click is the beginning
                of the route. Click along the desired path to set the route.
              </li>
            </ul>
            <DrawerClose asChild>
              <Link href={redirectLink}>
                <Button className="mt-4">Close</Button>
              </Link>
            </DrawerClose>
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default InstructionsDrawer;
