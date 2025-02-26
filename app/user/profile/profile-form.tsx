'use client';

import { updateProfileSchema } from '@/lib/validators';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/lib/actions/user.actions';

const ProfileForm = () => {
  const { data: session, update } = useSession();

  const firstName = session?.user?.name!.split(' ')[0];
  const lastName = session?.user?.name!.split(' ')[1];

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const response = await updateProfile(values);

    if (!response.success) {
      return toast(<div className="text-destructive">{response.message}</div>);
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: `${values.firstName} ${values.lastName}`,
      },
    };

    await update(newSession);

    toast('User updated successfully.');
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    disabled
                    placeholder="Email"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="First Name"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="button col-span-2 w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
