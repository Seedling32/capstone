'use client';

import { XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

const Charts = ({
  data: { riderData },
}: {
  data: { riderData: { month: string; activeUsers: number }[] };
}) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={riderData}
        margin={{
          top: 10,
          right: 10,
          bottom: 30,
          left: 10,
        }}
      >
        <XAxis
          dataKey="month"
          fontSize={12}
          label={{
            value: 'Month',
            position: 'insideBottom',
            offset: -15,
          }}
        />
        <YAxis
          fontSize={12}
          label={{
            value: 'Number of Users',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
          }}
        />
        <Line dataKey={'activeUsers'} stroke="#facc14" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Charts;
