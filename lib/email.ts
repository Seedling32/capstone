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
    html: `
    <div style="border: 2px solid #333; max-width: 450px; padding: .5rem; border-radius: 25px; box-shadow: 5px 5px 10px #333; text-align: center;">
      <img src="https://www.pedal-pact.com/images/logo-1.png" alt="Pedal Pact logo." width="80" height="80" />
      <h2 style="margin-top: 0;">Password Reset</h2>
      <p>Click <a href="${url}" style="text-decoration: none; border: 1px solid #333; border-radius: 5px; padding: 3px; color: black; background-color: #ddd;">here</a> to reset your password.</p>
      <p style="max-width: 300px; margin: 1rem auto;">
        If you didn&apos;t request a password reset, you can safely ignore this email.
      </p>
      <p>Thanks for being a part of the Pact!</p>
      <p><small>This link will expire in 1 hour</small></p>
    </div>
    `,
  });
}
