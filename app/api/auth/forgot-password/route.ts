import { prisma } from '@/db/prisma';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { sendPasswordResetEmail } from '@/lib/email';
import { SERVER_URL } from '@/lib/constants';
import { toast } from 'sonner';

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true }); // Don't reveal user existence

  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.passwordResetToken.create({
    data: { token, userId: user.userId, expires },
  });

  const resetUrl = `${SERVER_URL}/reset-password?token=${token}`;
  console.log(resetUrl);
  try {
    await sendPasswordResetEmail(email, resetUrl);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ ok: true });
}
