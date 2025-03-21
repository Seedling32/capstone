import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';
import { getAllUsers } from '@/lib/actions/user.actions';
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

export const metadata: Metadata = {
  title: 'All Users',
};

const AdminAllUsers = async (props: {
  searchParams: Promise<{
    page: string;
  }>;
}) => {
  await requireAdmin();

  const { page = '1' } = await props.searchParams;

  const users = await getAllUsers({ page: Number(page) });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">All Users</h2>
      <div className="overflow-x-auto">
        <Table>
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
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`admin/users/${user.userId}`}>Edit</Link>
                  </Button>
                  {/* <DeleteDialog id={user.userId} action={deleteUser} /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
      </div>
    </div>
  );
};

export default AdminAllUsers;
