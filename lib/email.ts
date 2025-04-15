import { Resend } from 'resend';
import { RESEND_API_KEY } from './constants';

export async function sendPasswordResetEmail(email: string, url: string) {
  const resendApiKey = RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('Missing API key');
    return;
  }

  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: 'Pedal Pact <no-reply@pedal-pact.com>',
    to: email,
    subject: 'Reset your Pedal Pact password',
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
  });
}
