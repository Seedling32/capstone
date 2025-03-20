import Link from 'next/link';
import ModeToggle from './mode-toggle';
import { EllipsisVertical } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './user-button';

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex items-center w-full max-w-s gap-2 text-white">
        <Link href="/rides" className="hover:text-orange-600">
          Rides
        </Link>
        <Link href="/about-us" className="hover:text-orange-600">
          About
        </Link>
        <Link href="/contact" className="hover:text-orange-600">
          Contact
        </Link>
        <UserButton />
        <ModeToggle />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical className="text-orange-600" />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <Link href="/rides" className="hover:underline">
              Rides
            </Link>
            <Link href="/about-us" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <UserButton />
            <ModeToggle />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
