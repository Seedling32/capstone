import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'All Users',
};

const AdminAllUsers = async () => {
  await requireAdmin();

  return <>ALL USERS</>;
};

export default AdminAllUsers;
