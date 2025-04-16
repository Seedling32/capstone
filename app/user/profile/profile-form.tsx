'use client';

import { updateProfileSchema } from '@/lib/validators';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Image from 'next/image';
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
import {
  findOrCreateLocation,
  getAllStates,
  getLocationById,
} from '@/lib/actions/location.actions';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '@/components/ui/card';

const ProfileForm = () => {
  const router = useRouter();
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
      locationId: session?.user?.locationId ?? null,
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

        setTimeout(() => {
          form.reset({
            ...session?.user,
            firstName: firstName ?? '',
            lastName: lastName ?? '',
            email: session?.user.email ?? '',
            city: location?.city ?? '',
            stateId: location?.stateId ? String(location.stateId) : '',
            image: session?.user?.image ?? null,
          });
        }, 100);
      } catch (error) {
        console.error('Error initializing form:', error);
        toast.error('Failed to load form data.');
      }
    };

    initializeForm();
  }, [session?.user, firstName, lastName, form]);

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    try {
      const locationResponse = await findOrCreateLocation({
        stateId: Number(values.stateId) || 0,
        city: values.city || '',
      });

      const locationId = {
        city: locationResponse.city,
        id: locationResponse.id,
      };
      const response = await updateProfile({
        ...values,
        locationId: locationId.id,
        image: image,
      });

      if (!response.success) {
        return toast.error(`${response.message}`);
      }

      const newSession = {
        ...session,
        user: {
          name: `${values.firstName} ${values.lastName}`,
          locationId: locationId.id,
          image: image,
        },
      };

      await update(newSession);

      toast.success(`${response.message}`);

      form.reset();
      router.push('/user/profile');
    } catch (error) {
      toast.error(`${(error as Error).message}`);
    }
  };

  const image = form.watch('image');
  console.log(image);

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
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Avatar</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-32">
                    <div className="flex-start">
                      {image ? (
                        <Image
                          src={image}
                          alt="User image."
                          className="w-20 h-20 object-cover object-center rounded-sm mr-4"
                          width={100}
                          height={100}
                        />
                      ) : (
                        ''
                      )}
                      <FormControl>
                        <UploadButton
                          className="text-foreground"
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('image', res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`${error.message}`);
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
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
