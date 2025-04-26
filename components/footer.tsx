import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center gap-4 py-2 bg-muted border-t">
      <div className="flex items-center justify-center gap-2 text-center">
        {currentYear} {APP_NAME}{' '}
        <Image
          src="/images/logo.png"
          width={48}
          height={48}
          alt={`${APP_NAME} logo`}
        />{' '}
        All Rights Reserved
      </div>
      <div className=" flex gap-2 text-sm underline">
        <Link href="/terms-of-service">Terms of service</Link>
        {'|'}
        <Link href="/privacy-policy">Privacy policy</Link>
      </div>
    </footer>
  );
};

export default Footer;
