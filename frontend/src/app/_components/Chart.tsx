import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const LineChart = ({ selectedVault }: { selectedVault: any }) => {
  console.log(selectedVault);
  const [label, setLabel] = useState("All Vaults");

  const data: any = {
    all: [
      13351.2462, 13359.2462, 13369.2462, 13380.2462, 13385.2462, 13390.2462, 13395.2462, 13398.2462, 13405.2462, 13415.2462, 13419.2462,
      13429.2462, 13441.2462, 13447.2462, 13456.2462, 13463.2462, 13465.2462, 13477.2462, 13480.2462, 13488.2462, 13495.2462, 13504.2462,
      13511.2462, 13515.2462, 13521.2462, 13526.2462, 13534.2462, 13540.2462, 13548.2462, 13560.2462,
    ],
    "sol-jlp": [
      5763.1231, 5764.1231, 5766.1231, 5769.1231, 5771.1231, 5774.1231, 5777.1231, 5778.1231, 5780.1231, 5783.1231, 5784.1231, 5786.1231,
      5789.1231, 5791.1231, 5794.1231, 5796.1231, 5797.1231, 5800.1231, 5801.1231, 5803.1231, 5806.1231, 5807.1231, 5809.1231, 5812.1231,
      5814.1231, 5817.1231, 5818.1231, 5820.1231, 5823.1231, 5826.1231,
    ],
    "base-stable1": [
      7588.1231, 7595.1231, 7603.1231, 7611.1231, 7614.1231, 7616.1231, 7618.1231, 7620.1231, 7625.1231, 7632.1231, 7635.1231, 7643.1231,
      7652.1231, 7656.1231, 7662.1231, 7667.1231, 7668.1231, 7677.1231, 7679.1231, 7685.1231, 7689.1231, 7697.1231, 7702.1231, 7703.1231,
      7707.1231, 7709.1231, 7716.1231, 7720.1231, 7725.1231, 7734.1231,
    ],
  };

  return (
    <div className="w-full h-[90%] flex justify-center">
      <Line
        data={{
          labels: Array.from(Array(30).keys()),
          datasets: [
            {
              label: selectedVault?.title ?? "",
              data: data[selectedVault?.id] ?? [],
              backgroundColor: "rgb(255,206,27)",
              borderColor: "rgb(255,206,27)",
            },
          ],
        }}
        options={{
          responsive: true,
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
                color: "#2C247D",
              },
              title: { text: "July 2024", display: true, color: "white" },
            },
          },
          showLine: true,
          elements: {
            point: {
              radius: 0,
            },
          },
          plugins: {
            legend: {
              display: false,
              labels: { color: "white", padding: 30 },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          spanGaps: false,
        }}
      />
    </div>
  );
};

export default LineChart;
