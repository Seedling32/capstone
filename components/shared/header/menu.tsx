import Link from 'next/link';
import ModeToggle from './mode-toggle';
import { EllipsisVertical } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './user-button';

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex items-center w-full max-w-s gap-2">
        <Link href="/search-rides" className="hover:text-primary">
          Rides
        </Link>
        <Link href="/about-us" className="hover:text-primary">
          About
        </Link>
        <Link href="/contact" className="hover:text-primary">
          Contact
        </Link>
        <UserButton />
        <ModeToggle />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle text-primary flex">
            Menu
            <EllipsisVertical className="text-primary" />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <SheetClose asChild>
              <Link href="/search-rides" className="hover:underline">
                Rides
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/about-us" className="hover:underline">
                About
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </SheetClose>
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
