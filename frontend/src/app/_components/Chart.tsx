"use client";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const LineChart = ({ selectedVaultString, selectedChartDataString }: { selectedVaultString: string; selectedChartDataString: string }) => {
  const selectedVault = JSON.parse(selectedVaultString);
  const selectedChartData = JSON.parse(selectedChartDataString);

  return (
    <>
      <Line
        data={{
          labels: Array.from(Array(30).keys()),
          datasets: [
            {
              label: selectedVault,
              data: selectedChartData,
              backgroundColor: "rgb(255,206,27)",
              borderColor: "rgb(255,206,27)",
            },
          ],
        }}
        options={{
          transitions: { active: { animation: { duration: 0 } } },
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                color: "white",
                backdropColor: "white",
                display: true,
                callback: (value, index, values) => {
                  return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                },
              },
              border: { color: "white" },
              grid: {
                display: true,
                color: "#233171",
              },
            },
            x: {
              ticks: { color: "white", backdropColor: "white", display: true },
              border: { color: "white" },
              grid: {
                display: false,
              },
              title: { text: "July 2024", display: true, color: "white" },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              displayColors: false,
              callbacks: {
                title: (context) => {
                  return `Day ${context[0].parsed.x}`;
                },
                label: (context) => {
                  return `$${context.parsed.y.toFixed(2)}`;
                },
              },
            },
          },
          showLine: true,
          elements: {
            point: {
              radius: 0,
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          spanGaps: false,
        }}
      />
    </>
  );
};

export default LineChart;
