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
      <LineChart
        data={rideData}
        margin={{
          top: 10,
          right: 10,
          bottom: 30,
          left: 10,
        }}
      >
        <XAxis
          dataKey="distance"
          label={{
            value: 'Distance (mi)',
            position: 'insideBottom',
            offset: -10,
            style: { textAnchor: 'middle' },
          }}
          fontSize={12}
          tickFormatter={(value) => `${value.toFixed(1)}`}
          interval="preserveStartEnd"
          tickMargin={8}
        />
        <YAxis
          label={{
            value: 'Elevation (ft)',
            position: 'insideLeft',
            angle: -90,
            offset: 5,
            style: { textAnchor: 'middle' },
          }}
          domain={[
            Math.floor(minElevation - domainPadding),
            Math.ceil(maxElevation + domainPadding),
          ]}
          fontSize={12}
        />
        <Line
          dataKey={'elevation'}
          stroke="#facc14"
          activeDot={false}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ElevationChart;
