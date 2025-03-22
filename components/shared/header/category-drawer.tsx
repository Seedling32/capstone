import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllDifficulties } from '@/lib/actions/ride.actions';
import { BikeIcon } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
  const difficulties = await getAllDifficulties();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="ghost">
          <BikeIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a Difficulty</DrawerTitle>
          <div className="space-y-1 mt-4">
            {difficulties.map((x) => (
              <Button
                variant="ghost"
                className="w-full justify-start"
                key={x.difficulty}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/rides?difficulty=${x.difficulty}`}>
                    {x.difficulty} ({x._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
