export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Pedal Pact';

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A community-driven app for sharing bike routes, organizing group rides, and connecting cyclists in the Asheville, NC area.';

export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY || '';

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 8;

export const signInDefaultValues = {
  email: '',
  password: '',
};

export const signUpDefaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const updateStatusFormDefaultValues = {
  status: '',
};

export const createRideFormDefaultValues = {
  shortDescription: '',
  longDescription: '',
  date: new Date(),
  staticMapUrl: '',
  distance: 0.0,
  slug: '',
  difficulty: '',
  city: '',
  stateId: '0',
  locationId: 0,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['ADMIN', 'SUPER_ADMIN', 'USER'];

export const RIDE_DIFFICULTIES = process.env.RIDE_DIFFICULTIES
  ? process.env.RIDE_DIFFICULTIES.split(', ')
  : ['easy', 'challenging', 'difficult', 'hard', 'expert'];
