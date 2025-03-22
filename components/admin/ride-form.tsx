'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, Polyline } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';
import slugify from 'slugify';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { createRideSchema, updateRideSchema } from '@/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createRideFormDefaultValues,
  GOOGLE_MAPS_API_KEY,
  RIDE_DIFFICULTIES,
} from '@/lib/constants';
import { createNewRide, updateRide } from '@/lib/actions/ride.actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import polyline from '@mapbox/polyline';
import { Ride } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = { lat: 35.5951, lng: -82.5515 }; // Asheville, NC

const RideForm = ({
  type,
  ride,
  rideId,
}: {
  type: 'Create' | 'Update';
  ride?: Ride;
  rideId?: string;
}) => {
  const router = useRouter();

  type CreateRideSchema = z.infer<typeof createRideSchema>;
  type UpdateRideSchema = z.infer<typeof updateRideSchema>;

  // If updating, use existing ride values as the default values for the form, else, use default values
  const processRide =
    ride && type === 'Update'
      ? {
          ...ride,
          date: ride.date ? new Date(ride.date) : new Date(),
        }
      : createRideFormDefaultValues;

  const form = useForm<CreateRideSchema | UpdateRideSchema>({
    resolver: zodResolver(
      type === 'Update' ? updateRideSchema : createRideSchema
    ),
    defaultValues: processRide,
  });

  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [distance, setDistance] = useState<number>(0);
  const googleRef = useRef<typeof google | null>(null); // Store Google API

  // Populate the path array and calculate distance.
  // If the event happens on a lat/lng point it adds it to the array
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPath = [
        ...path,
        { lat: event.latLng.lat(), lng: event.latLng.lng() },
      ];

      if (newPath.length > 1 && googleRef.current) {
        const lastPoint = newPath[newPath.length - 2];
        const newPoint = newPath[newPath.length - 1];

        // Compute distance in meters and convert to kilometers
        const segmentDistance =
          googleRef.current.maps.geometry.spherical.computeDistanceBetween(
            lastPoint,
            newPoint
          );

        setDistance(
          (prevDistance) => prevDistance + segmentDistance * 0.000621371
        ); // Convert to miles
      }

      setPath(newPath);
    }
  };

  // These two use effects check window status for google maps and update distance continually
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      googleRef.current = window.google;
    }
  }, []);

  useEffect(() => {
    form.setValue('distance', parseFloat(distance.toFixed(2)));
  }, [distance, form]);

  // Parses out the existing path if one exists to draw on the map
  useEffect(() => {
    if (type === 'Update' && ride && ride.path) {
      try {
        // Parse path from string to array of objects for dynamic map
        const parsedPath =
          typeof ride.path === 'string' ? JSON.parse(ride.path) : ride.path;

        setPath(parsedPath);

        // Calculate distance from decoded path
        if (parsedPath.length > 1 && googleRef.current) {
          let totalDistance = 0;
          for (let i = 1; i < parsedPath.length; i++) {
            const prev = parsedPath[i - 1];
            const curr = parsedPath[i];
            const segment =
              googleRef.current.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(prev.lat, prev.lng),
                new google.maps.LatLng(curr.lat, curr.lng)
              );
            totalDistance += segment * 0.000621371; // to miles
          }
          setDistance(totalDistance);
        }
      } catch (error) {
        console.error('Error decoding path:', error);
      }
    }
  }, [type, ride]);

  // Encodes the path array and sets the value for staticMapUrl
  const handlePreSubmit = () => {
    if (path.length === 0) {
      toast.error('Please draw a route first.');
      return;
    }

    const encodedPath = polyline.encode(path.map((p) => [p.lat, p.lng]));
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&path=enc:${encodedPath}&key=${GOOGLE_MAPS_API_KEY}`;

    form.setValue('staticMapUrl', staticMapUrl);

    form.handleSubmit(onSubmit, (errors) => {
      console.log('Validation Errors:', errors);
      toast.error('Please fix form errors.');
    })();
  };

  //
  const onSubmit: SubmitHandler<z.infer<typeof createRideSchema>> = async (
    values
  ) => {
    if (submitted) return;
    setSubmitted(true);

    const updatedValues = {
      ...values,
    };

    // On Create
    if (type === 'Create') {
      const response = await createNewRide({
        data: updatedValues,
        path,
      });
      console.log(response.success);

      if (!response.success) {
        toast.error(`${response.message}`);
        setSubmitted(false);
      } else {
        toast.success(`${response.message}`);
        form.reset();
        setPath([]);
        setDistance(0);
        setSubmitted(false);
      }
    }

    // On Update
    if (type === 'Update') {
      if (!rideId) {
        router.push('/admin/all-rides');
        return;
      }
      const response = await updateRide({
        data: {
          ...updatedValues,
          ride_id: rideId,
        },
      });
      console.log(response.success);

      if (!response.success) {
        toast.error(`${response.message}`);
        setSubmitted(false);
      } else {
        toast.success(`${response.message}`);
        form.reset();
        setPath([]);
        setDistance(0);
        setSubmitted(false);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="shortDescription"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof createRideSchema>,
                'shortDescription'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Ride Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ride name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof createRideSchema>,
                'slug'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled
                      placeholder="Click the button to generate the slug..."
                      {...field}
                    />
                    <Button
                      type="button"
                      className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue(
                          'slug',
                          slugify(form.getValues('shortDescription'), {
                            lower: true,
                          })
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="longDescription"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof createRideSchema>,
              'longDescription'
            >;
          }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the ride description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row md:justify-between">
          <FormField
            control={form.control}
            name="date"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof createRideSchema>,
                'date'
              >;
            }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value instanceof Date ? field.value : null}
                    onChange={(date) => field.onChange(date)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    showIcon
                    toggleCalendarOnIconClick
                    showTimeSelect
                    popperPlacement="bottom-start"
                    timeFormat="HH:mm aa"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd h:mm aa"
                    className="border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof createRideSchema>,
                'difficulty'
              >;
            }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RIDE_DIFFICULTIES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distance"
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel>Distance</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`${parseFloat(distance.toFixed(2))}`}
                    value={`${parseFloat(distance.toFixed(2))} Miles`}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={12}
              onClick={handleMapClick}
            >
              <Polyline
                path={path}
                options={{ strokeColor: '#FF0000', strokeWeight: 4 }}
              />
            </GoogleMap>
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            onClick={handlePreSubmit}
            className="bg-green-500 min-w-[350px] self-center"
          >
            {form.formState.isSubmitting ? 'Saving Route...' : `${type} Ride`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RideForm;
