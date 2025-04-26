import { verifyTurnstile } from '@/lib/actions/user.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const captchaToken = formData.get('captchaToken');

  if (!captchaToken || typeof captchaToken !== 'string') {
    return NextResponse.json(
      { success: false, message: 'Missing CAPTCHA token.' },
      { status: 400 }
    );
  }

  const isHuman = await verifyTurnstile(captchaToken);

  if (!isHuman) {
    return NextResponse.json(
      {
        success: false,
        message: 'CAPTCHA validation failed. Please try again.',
      },
      { status: 400 }
    );
  }
  formData.delete('captchaToken');
  formData.append('access_key', '94aa02a2-d5b5-4cf2-bee2-8adc2e6bf9b4');

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (data.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { success: false, message: data.message },
      { status: 500 }
    );
  }
}
