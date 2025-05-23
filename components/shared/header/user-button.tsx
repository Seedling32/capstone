import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon, UserRoundPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon /> Sign In
          </Link>
        </Button>
        <Button asChild>
          <Link href="/register">
            <UserRoundPlus /> Register
          </Link>
        </Button>
      </>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? '';
  const image = session.user?.image;

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            {image ? (
              <Avatar className="cursor-pointer">
                <AvatarImage src={image} alt="User image." />
                <AvatarFallback>{firstInitial}</AvatarFallback>
              </Avatar>
            ) : (
              <Button
                variant="ghost"
                className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200 text-black"
              >
                {firstInitial}
              </Button>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href="/user/profile" className="w-full">
              User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/my-rides" className="w-full">
              My Rides
            </Link>
          </DropdownMenuItem>

          {(session?.user?.role === 'ADMIN' ||
            session?.user?.role === 'SUPER_ADMIN') && (
            <DropdownMenuItem>
              <Link href="/admin/overview" className="w-full">
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
