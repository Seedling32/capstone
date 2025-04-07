'use client';

import { updateUserSchema } from '@/lib/validators';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { USER_ROLES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/lib/actions/user.actions';
import { useEffect, useState } from 'react';
import {
  findOrCreateLocation,
  getAllStates,
  getLocationById,
} from '@/lib/actions/location.actions';

const UpdateUserForm = ({
  user,
  admin,
}: {
  user: z.infer<typeof updateUserSchema>;
  admin: boolean;
}) => {
  const router = useRouter();
  const [states, setStates] = useState<{ id: number; abbreviation: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      ...user,
      city: user.city ?? '',
      stateId: user.stateId ?? '',
    },
  });

  useEffect(() => {
    const initializeForm = async () => {
      try {
        const [allStates, location] = await Promise.all([
          getAllStates(),
          user.locationId
            ? getLocationById(user.locationId)
            : Promise.resolve(null),
        ]);

        setStates(allStates);

        form.reset({
          ...user,
          city: location?.city ?? '',
          stateId: location?.stateId ? String(location.stateId) : '',
        });

        setLoading(false); // ✅ Done loading
      } catch (error) {
        console.error('Error initializing form:', error);
        toast.error('Failed to load form data.');
      }
    };

    initializeForm();
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      const locationResponse = await findOrCreateLocation({
        stateId: Number(values.stateId) || 0,
        city: values.city || '',
      });

      const locationId = {
        city: locationResponse.city,
        id: locationResponse.id,
      };

      const response = await updateUser({
        ...values,
        locationId: locationId.id,
        city: locationId.city,
        userId: user.userId,
      });

      if (!response.success) {
        return toast.error(`${response.message}`);
      }

      toast.success(`${response.message}`);

      form.reset();
      router.push('/admin/users');
    } catch (error) {
      toast.error(`${(error as Error).message}`);
    }
  };

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                'email'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder="Enter user email..."
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
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                'firstName'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                'lastName'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name..." {...field} />
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
          {admin ? (
            <FormField
              control={form.control}
              name="role"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof updateUserSchema>,
                  'role'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>
        <div className="mt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Update User'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
