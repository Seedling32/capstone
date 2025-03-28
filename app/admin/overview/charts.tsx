'use client';

import { XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

const Charts = ({
  data: { riderData },
}: {
  data: { riderData: { month: string; activeUsers: number }[] };
}) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={riderData}>
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <Line dataKey={'activeUsers'} stroke="#facc14" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Charts;
