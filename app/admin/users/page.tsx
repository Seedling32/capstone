import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatId } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AdminSearch from '@/components/admin/admin-search';

export const metadata: Metadata = {
  title: 'All Users',
};

const AdminAllUsers = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) => {
  await requireAdmin();

  const { page = '1', query: searchText } = await props.searchParams;

  const users = await getAllUsers({ page: Number(page), query: searchText });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Users</h1>
        {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>{' '}
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <AdminSearch forHeader={false} />
      <div className="overflow-x-auto">
        <Table className="hidden lg:table">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.userId}>
                <TableCell className="flex">{formatId(user.userId)}</TableCell>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {user.role === 'ADMIN'
                      ? 'Admin'
                      : user.role === 'SUPER_ADMIN'
                        ? 'Super Admin'
                        : 'User'}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.userId}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.userId} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden min-w-[305px]">
          {users.data.map((user) => (
            <Card key={user.userId} className="drop-shadow-lg">
              <CardHeader className="relative p-0">
                {user.image ? (
                  <Avatar className="absolute right-4 top-4">
                    <AvatarImage src={user.image} alt="User image." />
                    <AvatarFallback className="absolute right-4 top-4">
                      {user.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Button
                    variant="ghost"
                    className="absolute right-4 top-4 w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200 text-black"
                  >
                    {user.firstName.charAt(0).toUpperCase()}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-4 mt-4">
                <ul className="flex flex-col gap-2">
                  <li>
                    <strong>ID: </strong>
                    {formatId(user.userId)}
                  </li>
                  <li>
                    <strong>Name: </strong>
                    {`${user.firstName} ${user.lastName}`}
                  </li>
                  <li>
                    <strong>Email: </strong>
                    {user.email}
                  </li>
                  <li className="flex justify-between">
                    <strong>Role: </strong>
                    <Badge
                      variant={
                        user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {user.role === 'ADMIN'
                        ? 'Admin'
                        : user.role === 'SUPER_ADMIN'
                          ? 'Super Admin'
                          : 'User'}
                    </Badge>
                  </li>
                </ul>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/users/${user.userId}`}>Edit</Link>
                </Button>
                <DeleteDialog id={user.userId} action={deleteUser} />
              </CardContent>
            </Card>
          ))}
        </div>
        {users?.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
  );
};

export default AdminAllUsers;
