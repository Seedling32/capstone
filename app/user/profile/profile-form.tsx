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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/lib/actions/user.actions';
import { getAllStates, getLocationById } from '@/lib/actions/location.actions';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const [states, setStates] = useState<{ id: number; abbreviation: string }[]>(
    []
  );

  const firstName = session?.user?.name!.split(' ')[0];
  const lastName = session?.user?.name!.split(' ')[1];

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      email: session?.user?.email ?? '',
      city: '',
      stateId: '',
    },
  });

  useEffect(() => {
    const initializeForm = async () => {
      try {
        const [allStates, location] = await Promise.all([
          getAllStates(),
          session?.user.locationId
            ? getLocationById(session.user.locationId)
            : Promise.resolve(null),
        ]);

        setStates(allStates);

        form.reset({
          firstName: firstName,
          lastName: lastName,
          email: session?.user.email ?? '',
          city: location?.city ?? '',
          stateId: location?.stateId ? String(location.stateId) : '',
        });
      } catch (error) {
        console.error('Error initializing form:', error);
        toast.error('Failed to load form data.');
      }
    };

    initializeForm();
  }, [session?.user, firstName, lastName, form]);

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
                <FormLabel>Email</FormLabel>
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
                <FormLabel>First Name</FormLabel>
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
                <FormLabel>Last Name</FormLabel>
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
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stateId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>State</FormLabel>
                  <Select
                    name="select"
                    onValueChange={field.onChange}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-[75px]">
                        <SelectValue placeholder="Select state">
                          {states.find(
                            (state) => String(state.id) === String(field.value)
                          )?.abbreviation ?? 'Select state'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={String(state.id)}>
                          {state.abbreviation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
