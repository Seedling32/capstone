import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'All Rides',
};

const AdminAllRides = async () => {
  await requireAdmin();

  return <>ALL RIDES</>;
};

export default AdminAllRides;
