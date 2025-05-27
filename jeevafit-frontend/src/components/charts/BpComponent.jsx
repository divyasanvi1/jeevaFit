import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';


const BloodPressureChart = ({ healthData }) => {
  const sortedData = [...healthData].reverse();
  const { t } = useTranslation();
  return (
    <div id="blood-pressure-chart">
      <h3 className="text-lg font-medium mb-2">{t('graph.charts.bloodPressure')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
          <YAxis />
          <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
          <Line type="monotone" dataKey="systolicBP" stroke="#a78bfa" strokeWidth={2} dot={false} name="Systolic BP" />
          <Line type="monotone" dataKey="diastolicBP" stroke="#818cf8" strokeWidth={2} dot={false} name="Diastolic BP" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BloodPressureChart;
