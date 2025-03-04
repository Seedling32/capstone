'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

const links = [
  {
    title: 'Overview',
    href: '/admin/overview',
  },
  {
    title: 'Create Ride',
    href: '/admin/create-ride',
  },
  {
    title: 'All Rides',
    href: '/admin/all-rides',
  },
  {
    title: 'User Rides',
    href: '/admin/user-rides',
  },
  {
    title: 'Users',
    href: '/admin/users',
  },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathName = usePathname();

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm text-white font-medium transition-colors hover:text-primary',
            pathName?.includes(item.href) ? '' : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
