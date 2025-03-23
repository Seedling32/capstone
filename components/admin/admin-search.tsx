'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const AdminSearch = () => {
  const pathName = usePathname();
  const formActionUrl = pathName.includes('/admin/user-rides')
    ? '/admin/user-rides'
    : pathName.includes('/admin/users')
    ? '/admin/users'
    : '/admin/all-rides';

  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');

  useEffect(() => {
    setQueryValue(searchParams.get('query') || '');
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="hidden md:w-[100px] lg:w-[300px]"
      />
      <Button className="sr-only" type="submit">
        Search
      </Button>
    </form>
  );
};

export default AdminSearch;
