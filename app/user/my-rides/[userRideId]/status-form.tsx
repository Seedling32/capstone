'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { changeUserRideStatus } from '@/lib/actions/user.actions';
import { updateStatusFormDefaultValues } from '@/lib/constants';
import { updateUserRideStatusSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const userStatusOptions = ['SIGNED_UP', 'CANCELED', 'COMPLETED'];

const StatusForm = ({ userRideId }: { userRideId: string }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof updateUserRideStatusSchema>>({
    resolver: zodResolver(updateUserRideStatusSchema),
    defaultValues: updateStatusFormDefaultValues,
  });

  // Open form handler
  const handleOpenForm = async () => {
    form.setValue('userRideId', userRideId);
    setOpen(true);
  };

  // Submit form handler
  const onSubmit: SubmitHandler<
    z.infer<typeof updateUserRideStatusSchema>
  > = async (values) => {
    const response = await changeUserRideStatus({ ...values, userRideId });

    if (!response.success) {
      return toast.error(`${response.message}`);
    }

    setOpen(false);

    toast.success(`${response.message}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant="default">
        Change Status
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Change your ride status</DialogTitle>
              <DialogDescription>
                Thanks for taking the time to update your status!
              </DialogDescription>
            </DialogHeader>
            <div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ride Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userStatusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === 'SIGNED_UP'
                              ? 'Signed Up'
                              : option === 'CANCELED'
                              ? 'Canceled'
                              : 'Completed'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StatusForm;
