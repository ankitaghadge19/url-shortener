import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

// Formats a date like "2026-09-28" into "Sep 28" for chart labels
const formatDate = (date) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const AnalyticsLineChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => formatDate(item.date)),

    datasets: [
      {
        data: data.map((item) => item.clicks),

        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",

        borderWidth: 1.5,
        tension: 0.4,
        fill: true,

        pointRadius: 3,
        pointHoverRadius: 5,

        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#6366f1",
        pointBorderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,

          font: {
            size: 12,
          },
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          stepSize: 1,
        },

        title: {
          display: true,
          text: "Clicks",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default AnalyticsLineChart;
