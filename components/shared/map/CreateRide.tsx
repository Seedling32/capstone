'use client';

import { useState, useEffect, useRef } from 'react';
import { GoogleMap, Polyline } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import slugify from 'slugify';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { createRideSchema } from '@/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createRideFormDefaultValues,
  GOOGLE_MAPS_API_KEY,
} from '@/lib/constants';
import { createNewRide } from '@/lib/actions/ride.actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import polyline from '@mapbox/polyline';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = { lat: 35.5951, lng: -82.5515 }; // Asheville, NC

const CreateRide = () => {
  const form = useForm<z.infer<typeof createRideSchema>>({
    resolver: zodResolver(createRideSchema),
    defaultValues: createRideFormDefaultValues,
  });

  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  // const [savedRoutes] = useState<Route[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(0);
  // const [shortDescription, setShortDescription] = useState('');
  // const [longDescription, setLongDescription] = useState('');
  // const [staticMapUrl, setStaticMapUrl] = useState('');
  // const [date, setDate] = useState<string>('');
  const googleRef = useRef<typeof google | null>(null); // Store Google API

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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      googleRef.current = window.google;
    }
  }, []);

  useEffect(() => {
    form.setValue('distance', parseFloat(distance.toFixed(2)));
  }, [distance, form]);

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

  const onSubmit: SubmitHandler<z.infer<typeof createRideSchema>> = async (
    values
  ) => {
    if (submitted) return;
    setSubmitted(true);

    if (path.length === 0) console.log('wtf');
    const encodePolyline = (path: { lat: number; lng: number }[]) => {
      return polyline.encode(path.map((point) => [point.lat, point.lng]));
    };
    const encodedPath = encodePolyline(path);

    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&path=enc:${encodedPath}&key=${GOOGLE_MAPS_API_KEY}`;

    const updatedValues = {
      ...values,
      distance: parseFloat(distance.toFixed(2)),
      staticMapUrl,
    };

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
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '20px' }}>
      <h2>Bike Route Planner</h2>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log(errors);
          })}
          className="flex flex-col items-center gap-4"
        >
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
              <FormItem>
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
                    <Input placeholder="Enter slug" {...field} />
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
                    placeholder="Enter product description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={
                      field.value instanceof Date
                        ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                        : ''
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distance"
            render={() => (
              <FormItem>
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

          <div style={{ position: 'relative', width: '100%', height: '600px' }}>
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
            onClick={handlePreSubmit}
            className="p-3 bg-orange-600 text-white rounded disabled:bg-gray-500"
          >
            {form.formState.isSubmitting ? 'Saving Route...' : 'Save Route'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateRide;
