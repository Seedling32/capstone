import Link from 'next/link';
import ModeToggle from './mode-toggle';
import UserButton from './user-button';
import MobileMenu from './mobile-menu';

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
      <nav className="md:hidden flex">
        <MobileMenu />
        <UserButton />
      </nav>
    </div>
  );
};

export default Menu;
