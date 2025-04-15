import { prisma } from '@/db/prisma';
import { hash } from 'bcrypt-ts-edge';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!tokenRecord || tokenRecord.expires < new Date()) {
    return NextResponse.json(
      { error: 'Token invalid or expired' },
      { status: 400 }
    );
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.update({
    where: { userId: tokenRecord.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ ok: true });
}
