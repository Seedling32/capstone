import { Resend } from 'resend';
import { RESEND_API_KEY } from './constants';

const resend = new Resend(RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, url: string) {
  await resend.emails.send({
    from: 'Pedal Pact <no-reply@pedal-pact.com>',
    to: email,
    subject: 'Reset your Pedal Pact password',
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
  });
}
