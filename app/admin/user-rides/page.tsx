import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'User Rides',
};

const AdminUserRides = async () => {
  await requireAdmin();

  return <>USER RIDES</>;
};

export default AdminUserRides;
