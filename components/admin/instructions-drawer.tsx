import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Link from 'next/link';

const InstructionsDrawer = () => {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="link" className="border">
          Instructions
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
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
              <Link href="/admin/all-rides/create-ride">
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
