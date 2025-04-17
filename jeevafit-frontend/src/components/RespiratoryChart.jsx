import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const RespiratoryRateChart = ({ healthData }) => {
  const sortedData = [...healthData].reverse();
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Respiratory Rate</h3>
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
