import React, { useMemo } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  showTooltip?: boolean;
  showGrid?: boolean;
  showAxis?: boolean;
  className?: string;
}

export function BarChart({ 
  data, 
  height = 300, 
  showTooltip = true, 
  showGrid = true, 
  showAxis = true,
  className = '' 
}: BarChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      name: item.name,
      value: item.value,
      color: item.color || 'hsl(var(--primary))'
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm">{`${payload[0].value} votes`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={chartData} barCategoryGap="20%">
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showAxis && <XAxis dataKey="name" />}
          {showAxis && <YAxis />}
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          <Bar 
            dataKey="value" 
            fill="currentColor"
            className="fill-primary"
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
