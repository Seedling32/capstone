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
    <div style="display: flex; flex-direction: column; align-items: center; border: 2px solid #333; max-width: 450px; padding: .5rem; border-radius: 25px; box-shadow: 5px 5px 10px #333;">
      <img src="https://www.pedal-pact.com/images/logo.svg" alt="Pedal Pact logo." width="80" height="80" />
      <h2>Password Reset</h2>
      <p>Click <a href="${url}" style="text-decoration: none; border: 1px solid #333; border-radius: 5px; padding: 3px; color: black; background-color: #ddd;">here</a> to reset your password.</p>
      <p style="max-width: 300px;">
        If you didn&apos;t request a password reset, you can safely ignore this email.
      </p>
      <p>Thanks for being a part of the Pact!</p>
    </div>
    `,
  });
}
