import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Register necessary chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const DiastolicBPChart = ({ healthData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Diastolic BP',
        data: [],
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    if (healthData.length > 0) {
      const timestamps = healthData.map((data) => new Date(data.timestamp).toLocaleTimeString());
      const diastolicBP = healthData.map((data) => data.diastolicBP);

      setChartData({
        labels: timestamps,
        datasets: [
          {
            label: 'Diastolic BP',
            data: diastolicBP,
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [healthData]);

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} mmHg at ${tooltipItem.label}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Diastolic BP (mmHg)',
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default DiastolicBPChart;
