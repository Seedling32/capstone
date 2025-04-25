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
import { convertLocalToUTC, convertUTCToLocal } from '@/lib/utils';
import { Redo2 } from 'lucide-react';

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

        setTimeout(() => {
          form.reset({
            ...processRide,
            city: location?.city ?? '',
            stateId: location?.stateId ? String(location.stateId) : '',
            date: processRideDate
              ? convertUTCToLocal(new Date(processRideDate))
              : new Date(),
          });
        }, 100);
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
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng || !googleRef.current) return;

    const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };

    // First point: just set initial path
    if (path.length === 0) {
      setPath([newPoint]);
      return;
    }

    try {
      const lastPoint = path[path.length - 1];
      const segmentPoints = [lastPoint, newPoint];

      const pathParam = segmentPoints
        .map((point) => `${point.lat},${point.lng}`)
        .join('|');

      const response = await fetch(
        `https://roads.googleapis.com/v1/snapToRoads?path=${pathParam}&interpolate=true&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (!data.snappedPoints) {
        toast.error('Snap to Roads API did not return a valid path.');
        return;
      }

      type SnappedPoint = {
        location: {
          latitude: number;
          longitude: number;
        };
        originalIndex?: number;
        placeId?: string;
      };

      const snappedPath = data.snappedPoints.map(
        (snappedPoint: SnappedPoint) => ({
          lat: snappedPoint.location.latitude,
          lng: snappedPoint.location.longitude,
        })
      );

      // Full path
      setPath((prevPath) => [...prevPath, ...snappedPath.slice(1)]);

      // Accumulate total distance
      if (snappedPath.length > 1) {
        let segmentDistance = 0;
        for (let i = 1; i < snappedPath.length; i++) {
          const prev = snappedPath[i - 1];
          const curr = snappedPath[i];
          const distance =
            googleRef.current.maps.geometry.spherical.computeDistanceBetween(
              new googleRef.current.maps.LatLng(prev.lat, prev.lng),
              new googleRef.current.maps.LatLng(curr.lat, curr.lng)
            );
          segmentDistance += distance;
        }

        const segmentDistanceMiles = segmentDistance * 0.000621371;

        setDistance((prevDistance) => {
          const newTotal = prevDistance + segmentDistanceMiles;
          distanceRef.current = newTotal;
          return parseFloat(newTotal.toFixed(2));
        });
      }

      // Calculate elevation for total path
      const elevator = new googleRef.current.maps.ElevationService();
      elevator.getElevationForLocations(
        {
          locations: [
            new googleRef.current.maps.LatLng(newPoint.lat, newPoint.lng),
          ],
        },
        (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
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
    } catch (error) {
      console.error('Snap to Roads API error:', error);
      toast.error('Failed to snap route to roads.');
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
      const utcDate = convertLocalToUTC(date);
      form.setValue('date', utcDate);
    }

    // Keep 1 of every 10 points to generate the path for encoding
    // the the url. This keeps the url shorter than the common ~2000ish
    // character limit.
    const simplifiedPath = path.filter((_, index) => index % 10 === 0);

    const encodedPath = polyline.encode(
      simplifiedPath.map((p) => [p.lat, p.lng])
    );

    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&path=enc:${encodedPath}&key=${GOOGLE_MAPS_API_KEY}`;

    form.setValue('staticMapUrl', staticMapUrl);

    form.handleSubmit(onSubmit, (errors) => {
      console.log('Validation Errors:', errors);
      toast.error('Please fix form errors.');
    })();
  };

  // Undo the last point that you clicked. Recalculates elevation and distance as well based on the remaining points in the array after removing the last one.
  const undoLastPoint = () => {
    if (path.length > 1) {
      const newPath = [...path];
      newPath.pop();
      setPath(newPath);
    } else {
      setPath([]);
    }

    // Also update elevation and distance if needed
    if (elevation.length > 0) {
      setElevation((prev) => prev.slice(0, -1));
    }

    if (path.length > 1 && googleRef.current) {
      const newTotalDistance = path
        .slice(0, -1)
        .reduce((total, point, index, arr) => {
          if (index === 0) return total;
          const prev = arr[index - 1];
          const segment =
            googleRef.current!.maps.geometry.spherical.computeDistanceBetween(
              new googleRef.current!.maps.LatLng(prev.lat, prev.lng),
              new googleRef.current!.maps.LatLng(point.lat, point.lng)
            );
          return total + segment;
        }, 0);

      const miles = newTotalDistance * 0.000621371;
      setDistance(parseFloat(miles.toFixed(2)));
      distanceRef.current = miles;
    } else {
      setDistance(0);
      distanceRef.current = 0;
    }
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
                <FormLabel id="title">Ride Title</FormLabel>
                <FormControl>
                  <Input
                    aria-describedby="title"
                    placeholder="Enter ride name..."
                    {...field}
                  />
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
                <FormLabel htmlFor="slug" id="slug-description">
                  Slug
                </FormLabel>
                <FormControl>
                  <div aria-describedby="slug-description">
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
              <FormLabel id="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  aria-describedby="description"
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
                <FormLabel id="date">Date</FormLabel>
                <FormControl>
                  <DatePicker
                    aria-describedby="date"
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
                <FormLabel id="difficulty">Difficulty</FormLabel>
                <Select
                  name="select"
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger aria-describedby="difficulty">
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
                <FormLabel id="distance">Distance</FormLabel>
                <FormControl>
                  <Input
                    aria-describedby="distance"
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
                <FormLabel id="city">City</FormLabel>
                <FormControl>
                  <Input
                    aria-describedby="city"
                    placeholder="Enter city..."
                    {...field}
                  />
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
                <FormLabel htmlFor="state" id="state-description">
                  State
                </FormLabel>
                <Select
                  name="state"
                  onValueChange={field.onChange}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger
                      id="state"
                      aria-describedby="state-description"
                      className="min-w-[75px]"
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="h-[400px]">
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
          <div className="relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={12}
              onClick={handleMapClick}
              onLoad={handleMapLoad}
              options={{
                draggableCursor: 'crosshair',
                draggingCursor: 'grabbing',
              }}
            >
              <Polyline
                path={path}
                options={{ strokeColor: '#FF0000', strokeWeight: 4 }}
              />
            </GoogleMap>
            <Button
              type="button"
              onClick={undoLastPoint}
              className="capitalize absolute right-2 bottom-36"
            >
              <Redo2 />
              Undo last point
            </Button>
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            onClick={handlePreSubmit}
            className="min-w-[350px] self-center"
          >
            {form.formState.isSubmitting ? 'Saving Route...' : `${type} Ride`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RideForm;
