import CreateRide from '@/components/shared/map/CreateRide';

const AdminPage = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 className="h2-bold">Create Ride</h1>
      <p>Manage and create bike routes easily.</p>
      <CreateRide />
    </div>
  );
};

export default AdminPage;
