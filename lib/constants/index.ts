export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Pedal Pact';

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A community-driven app for sharing bike routes, organizing group rides, and connecting cyclists in the Asheville, NC area.';

export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

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
