'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUpDefaultValues, TURNSTILE_SITE_KEY } from '@/lib/constants';
import Link from 'next/link';
import { signUpUser } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { signUpFormSchema } from '@/lib/validators';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  findOrCreateLocation,
  getAllStates,
} from '@/lib/actions/location.actions';
import { useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';

const SignUpForm = () => {
  const { data: session, update } = useSession();
  const [states, setStates] = useState<{ id: number; abbreviation: string }[]>(
    []
  );
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      locationId: 0,
      city: '',
      stateId: '',
    },
  });

  useEffect(() => {
    const getStates = async () => {
      const allStates = await getAllStates();
      setStates(allStates);
    };
    getStates();
  }, []);

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    if (!captchaToken) {
      toast.error('Please complete CAPTCHA verification.');
      return;
    }

    const locationResponse = await findOrCreateLocation({
      stateId: Number(values.stateId) || 0,
      city: values.city || '',
    });

    const locationId = locationResponse.id;

    const response = await signUpUser(null, {
      ...values,
      locationId: locationId,
      captchaToken,
    });

    if (!response.success) {
      return toast.error(`${response.message}`);
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: `${values.firstName} ${values.lastName}`,
      },
    };

    await update(newSession);

    toast.success('User registered successfully.');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel id="firstName">First Name</FormLabel>
                <FormControl>
                  <Input
                    aria-describedby="firstName"
                    placeholder={signUpDefaultValues.firstName}
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
                <FormLabel id="lastName">Last Name</FormLabel>
                <FormControl>
                  <Input
                    aria-describedby="lastName"
                    placeholder={signUpDefaultValues.lastName}
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
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel id="email">Email</FormLabel>
                <FormControl>
                  <Input
                    aria-describedby="email"
                    placeholder={signUpDefaultValues.email}
                    className="input-field"
                    type="email"
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
                  <FormLabel id="city">City</FormLabel>
                  <FormControl>
                    <Input aria-describedby="city" {...field} />
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
                  <FormLabel id="state">State</FormLabel>
                  <Select
                    name="select"
                    onValueChange={field.onChange}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger
                        aria-describedby="state"
                        className="min-w-[75px]"
                      >
                        <SelectValue placeholder="Select state" />
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
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel id="password">Password</FormLabel>
                <FormControl>
                  <Input
                    aria-describedby="password"
                    placeholder={signUpDefaultValues.password}
                    className="input-field"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel id="confirmPassword">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    aria-describedby="confirmPassword"
                    placeholder={signUpDefaultValues.confirmPassword}
                    className="input-field"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center my-4">
          <Turnstile
            sitekey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => setCaptchaToken(token)}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="button col-span-2 w-full mt-4"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Register'}
        </Button>
        <div className="text-sm text-center text-muted-foreground mt-4">
          <Link href="/sign-in" target="_self" className="link hover:underline">
            Already have an account? Sign In
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
