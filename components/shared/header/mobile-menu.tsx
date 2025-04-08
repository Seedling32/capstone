'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EllipsisVertical } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ModeToggle from './mode-toggle';

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="align-middle text-primary flex">
        Menu
        <EllipsisVertical className="text-primary" />
      </SheetTrigger>
      <SheetContent className="flex flex-col items-start">
        <SheetTitle>Menu</SheetTitle>
        <Link
          href="/search-rides"
          className="hover:underline"
          onClick={handleLinkClick}
        >
          Rides
        </Link>
        <Link
          href="/about-us"
          className="hover:underline"
          onClick={handleLinkClick}
        >
          About
        </Link>
        <Link
          href="/contact"
          className="hover:underline"
          onClick={handleLinkClick}
        >
          Contact
        </Link>
        <ModeToggle />
        <SheetDescription />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
