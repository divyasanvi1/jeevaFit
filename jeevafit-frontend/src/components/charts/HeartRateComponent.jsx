import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const HeartRateChart = ({ healthData }) => {
  const { t } = useTranslation();
  const sortedData = [...healthData].reverse();

  return (
    <div id="heart-rate-chart">
      <h3 className="text-lg font-medium mb-2">{t('graph.charts.heartRate')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
          />
          <YAxis
            label={{ value: 'bpm', angle: -90, position: 'insideLeft' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleString()}
            formatter={(value) => [`${value} bpm`, 'Heart Rate']}
          />
          <Line
            type="monotone"
            dataKey="heartRate"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HeartRateChart;
