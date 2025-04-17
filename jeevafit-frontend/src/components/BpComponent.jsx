import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const BloodPressureChart = ({ healthData }) => {
  const sortedData = [...healthData].reverse();
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Blood Pressure</h3>
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
