import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted border-t">
      <div className="p-5 flex items-center justify-center gap-2 text-center">
        {currentYear} {APP_NAME}{' '}
        <Image
          src="/images/logo.png"
          width={48}
          height={48}
          alt={`${APP_NAME} logo`}
        />{' '}
        All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
