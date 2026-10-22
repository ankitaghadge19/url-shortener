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

// Register the Chart.js components required to render and configure the line chart.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

// Convert a date such as "2026-09-28" into a readable label such as "Sep 28".
const formatDate = (date) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const AnalyticsLineChart = ({ data = [] }) => {
  // Transform the analytics records into the labels and values expected by Chart.js.
  // Each record is expected to contain a date and its corresponding click count.
  const chartData = {
    // Use formatted dates as labels along the horizontal axis.
    labels: data.map((item) => formatDate(item.date)),

    datasets: [
      {
        // Plot the click count for each date on the line chart.
        data: data.map((item) => item.clicks),

        // Configure the line and the area filled beneath it.
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 1.5,
        tension: 0.4,
        fill: true,

        // Configure the appearance of data points and their hover state.
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#6366f1",
        pointBorderWidth: 1,
      },
    ],
  };

  // Configure chart responsiveness, axis labels, grid lines, and tick spacing.
  const options = {
    responsive: true,

    // Allow the chart to use the height provided by its parent container.
    maintainAspectRatio: false,

    scales: {
      x: {
        // Hide vertical grid lines to keep the chart visually clean.
        grid: {
          display: false,
        },

        // Prevent date labels from becoming overcrowded on the horizontal axis.
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          font: {
            size: 12,
          },
        },
      },

      y: {
        // Start the click-count axis at zero for a consistent comparison.
        beginAtZero: true,

        // Display click counts in whole-number increments.
        ticks: {
          stepSize: 1,
        },

        // Add a descriptive label to the vertical axis.
        title: {
          display: true,
          text: "Clicks",
        },
      },
    },
  };

  // Render the line chart using the prepared data and configuration.
  return <Line data={chartData} options={options} />;
};

export default AnalyticsLineChart;
