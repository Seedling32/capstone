import { verifyTurnstile } from '@/lib/actions/user.actions';

export async function POST(req: Request) {
  const formData = await req.formData();
  const captchaToken = formData.get('captchaToken');

  if (!captchaToken || typeof captchaToken !== 'string') {
    return {
      success: false,
      message: 'CAPTCHA token missing',
    };
  }

  const isHuman = await verifyTurnstile(captchaToken);

  if (!isHuman) {
    return {
      success: false,
      message: 'CAPTCHA validation failed. Please try again.',
    };
  }
  formData.delete('captchaToken');
  formData.append('access_key', '94aa02a2-d5b5-4cf2-bee2-8adc2e6bf9b4');

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (data.success) {
    return {
      success: true,
      message: 'Form submitted successfully',
    };
  } else {
    return {
      success: false,
      message: `${data.message}`,
    };
  }

  // continue processing form (send to Web3Forms, save to db, etc.)
}
