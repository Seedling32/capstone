import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import Search from './search';

const Header = () => {
  return (
    <header role="header" className="bg-muted w-full">
      <div className="wrapper flex-between py-5">
        <div className="flex-start">
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/logo-1.png"
              alt={`${APP_NAME} logo.`}
              height={48}
              width={48}
              priority={true}
              className="rounded-lg"
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
