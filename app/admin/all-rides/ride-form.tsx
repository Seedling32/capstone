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
import { Ride, State } from '@/types';
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
  getLocationById,
} from '@/lib/actions/location.actions';

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
    ride && type === 'Update' ? ride : createRideFormDefaultValues;

  console.log(processRide);

  const form = useForm<CreateRideSchema | UpdateRideSchema>({
    resolver: zodResolver(
      type === 'Update' ? updateRideSchema : createRideSchema
    ),
    defaultValues: {
      ...processRide,
      city: processRide.city ?? '',
      stateId: processRide.stateId ?? '',
    },
  });

  const googleRef = useRef<typeof google | null>(null); // Store Google API
  const mapRef = useRef<google.maps.Map | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [pathInitialized, setPathInitialized] = useState(false);
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [elevation, setElevation] = useState<
    { distance: number; elevation: number }[]
  >([]);
  const distanceRef = useRef(0);
  const [submitted, setSubmitted] = useState(false);
  const [distance, setDistance] = useState<number>(0);

  // Fetch all states for populated drop down in form.
  // Use processRide from earlier to set form values
  const processRideDate = ride?.date ?? null;

  useEffect(() => {
    const initializeForm = async () => {
      try {
        const [allStates, location] = await Promise.all([
          getAllStates(),
          processRide?.locationId
            ? getLocationById(processRide.locationId)
            : Promise.resolve(null),
        ]);

        setStates(allStates);

        form.reset({
          ...processRide,
          city: location?.city ?? '',
          stateId: location?.stateId ? String(location.stateId) : '',
          date: processRideDate ? new Date(processRideDate) : new Date(),
        });
      } catch (error) {
        console.error('Error initializing form:', error);
        toast.error('Failed to load form data.');
      }
    };

    initializeForm();
  }, [processRide, processRideDate, form]);

  // Loads the map with the existing path if updating a ride
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (typeof window !== 'undefined' && window.google) {
      googleRef.current = window.google;
    }

    if (
      !pathInitialized &&
      type === 'Update' &&
      ride &&
      ride.path &&
      googleRef.current?.maps?.geometry
    ) {
      try {
        // Parse path from string to array of objects for dynamic map
        const parsedPath =
          typeof ride.path === 'string' ? JSON.parse(ride.path) : ride.path;

        setPath(parsedPath);
        setPathInitialized(true);

        // Calculate distance from decoded path
        if (parsedPath.length > 1) {
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
  };

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
        distanceRef.current += segmentDistance * 0.000621371;
      }

      setPath(newPath);

      // Fetch elevation for this point
      const elevator = new googleRef.current!.maps.ElevationService();

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      elevator.getElevationForLocations(
        { locations: [new google.maps.LatLng(lat, lng)] },
        (results, status) => {
          if (status === 'OK' && results && results?.length > 0) {
            const elevationInFeet = results[0].elevation * 3.28084;

            setElevation((prev) => [
              ...prev,
              {
                distance: Number(distanceRef.current.toFixed(2)),
                elevation: elevationInFeet,
              },
            ]);
          } else {
            console.error('Elevation lookup failed: ', status);
          }
        }
      );
    }
  };

  // These two use effects check window status for google maps and update distance continually
  useEffect(() => {
    form.setValue('distance', parseFloat(distance.toFixed(2)));
  }, [distance, form]);

  // Encodes the path array and sets the value for staticMapUrl
  // Sets the time based on time zone
  const handlePreSubmit = () => {
    if (path.length === 0) {
      toast.error('Please draw a route first.');
      return;
    }

    // Adjust time to UTC before submitting
    const date = form.getValues('date');
    if (date) {
      const utcDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      form.setValue('date', utcDate);
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

    const locationResponse = await findOrCreateLocation({
      stateId: Number(values.stateId) || 0,
      city: values.city || '',
    });

    const locationId = locationResponse.id;

    const updatedValues = {
      ...values,
      locationId: locationId,
    };

    delete updatedValues.city;
    delete updatedValues.stateId;

    // On Create
    if (type === 'Create') {
      const response = await createNewRide({
        data: updatedValues,
        path,
        elevation,
      });
      console.log(response.success);

      if (!response.success) {
        toast.error(`${response.message}`);
        setSubmitted(false);
      } else {
        toast.success(`${response.message}`);
        form.reset();
        distanceRef.current = 0;
        setPath([]);
        setElevation([]);
        setDistance(0);
        setSubmitted(false);
        router.push('/admin/all-rides');
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
        router.push('/admin/all-rides');
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
                <FormLabel htmlFor="slug">Slug</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      id="slug"
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
                  name="select"
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

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof createRideSchema>,
                'city'
              >;
            }) => (
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
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof createRideSchema>,
                'stateId'
              >;
            }) => (
              <FormItem className="flex flex-col">
                <FormLabel>State</FormLabel>
                <Select
                  name="select"
                  onValueChange={field.onChange}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="min-w-[75px]">
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

        <div className="flex flex-col space-y-4">
          <div>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={12}
              onClick={handleMapClick}
              onLoad={handleMapLoad}
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
