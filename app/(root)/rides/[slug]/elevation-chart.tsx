'use client';

import { XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

const ElevationChart = ({
  data: { rideData },
}: {
  data: { rideData: { distance: number; elevation: number }[] };
}) => {
  const elevations = rideData.map((point) => point.elevation);
  const minElevation = Math.min(...elevations);
  const maxElevation = Math.max(...elevations);
  const domainPadding = 100;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={rideData}>
        <XAxis dataKey="distance" fontSize={12} />
        <YAxis
          domain={[
            Math.floor(minElevation - domainPadding),
            Math.ceil(maxElevation + domainPadding),
          ]}
          fontSize={12}
        />
        <Line dataKey={'elevation'} stroke="#facc14" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ElevationChart;
