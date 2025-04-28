import { Metadata } from 'next';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import ProfileForm from './profile-form';
import { deleteUser } from '@/lib/actions/user.actions';
import DeleteDialog from '@/components/shared/delete-dialog';

export const metadata: Metadata = {
  title: 'User Profile',
};

const Profile = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="max-w-md bg-muted mx-auto rounded-lg p-6 space-y-4 bg-gradient-to-t from-transparent to-background">
        <h2 className="h2-bold">Profile</h2>
        <ProfileForm />
        <div className="flex flex-col items-center gap-4">
          <h2 className="h2-bold capitalize">Delete account</h2>
          <DeleteDialog
            id={session!.user.id!}
            action={deleteUser}
            userDelete={true}
          />
        </div>
      </div>
    </SessionProvider>
  );
};

export default Profile;
