import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import polyline from '@mapbox/polyline';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { slug, path, shortDescription, longDescription, date, distance } =
        req.body;
      // Generate static map URL
      // const pathString = path
      //   .map((point: { lat: number; lng: number }) => `${point.lat},${point.lng}`)
      //   .join('|');

      const encodePolyline = (path: { lat: number; lng: number }[]) => {
        return polyline.encode(path.map((point) => [point.lat, point.lng]));
      };
      const encodedPath = encodePolyline(path);

      const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&path=enc:${encodedPath}&key=${GOOGLE_MAPS_API_KEY}`;

      const newRoute = await prisma.ride.create({
        data: {
          slug,
          path: JSON.stringify(path),
          shortDescription,
          longDescription,
          staticMapUrl,
          date,
          distance,
        },
      });
      res.status(200).json(newRoute);
    } catch (error) {
      res.status(500).json({ error: 'Error saving route' });
      console.log(error);
    }
  }
}
