import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PressureGaugeProps {
  value: number; // 0 to 1
}

const PressureGauge: React.FC<PressureGaugeProps> = ({ value }) => {
  const data = [
    { name: 'Pressure', value: value },
    { name: 'Remaining', value: 1 - value },
  ];

  const startAngle = 180;
  const endAngle = 0;

  // Color interpolation based on value
  const getColor = (val: number) => {
    if (val < 0.4) return '#10b981'; // Green
    if (val < 0.7) return '#f59e0b'; // Orange
    return '#f43f5e'; // Red
  };

  const activeColor = getColor(value);

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={60}
            outerRadius={90}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={activeColor} />
            <Cell fill="#333" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="text-4xl font-serif font-bold text-white">
          {(value * 100).toFixed(1)}%
        </span>
        <span className="text-xs uppercase tracking-widest text-stone-500">
          Innovation Pressure
        </span>
      </div>
    </div>
  );
};

export default PressureGauge;