import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { Signal } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../constants';

interface CategoryChartProps {
  signals: Signal[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ signals }) => {
  // Aggregate data
  const dataMap: Record<string, number> = {};
  signals.forEach(s => {
    if (!dataMap[s.category]) dataMap[s.category] = 0;
    dataMap[s.category] += s.score;
  });

  const data = Object.keys(dataMap).map(key => ({
    category: key,
    label: CATEGORY_LABELS[key as any] || key,
    score: dataMap[key]
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="label" 
            width={120} 
            tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }}
            interval={0}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1c1917', borderColor: '#444' }}
            itemStyle={{ color: '#fff' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category as any]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;