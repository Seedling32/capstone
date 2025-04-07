import { prisma } from '@/db/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(states);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching states' },
      { status: 500 }
    );
  }
}
