import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const RespiratoryRateChart = ({ healthData }) => {
  const { t } = useTranslation();
  const sortedData = [...healthData].reverse();
  return (
    <div id="respiratory-rate-chart">
      <h3 className="text-lg font-medium mb-2">{t('graph.charts.respiratoryRate')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
          <YAxis />
          <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
          <Line type="monotone" dataKey="respiratoryRate" stroke="#34d399" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RespiratoryRateChart;
