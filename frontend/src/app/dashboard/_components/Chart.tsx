"use client";
// chartjs
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
// react query
import { useQueryClient } from "@tanstack/react-query";
// zustand
import { useUserVaultIndexStore } from "@/store";

export default function LineChart({ chartData, userVaults }: { chartData: any; userVaults: any }) {
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;
  console.log("/dashboard Chart.tsx", time);

  // get userVaultIndex from Zustand
  const userVaultIndex = useUserVaultIndexStore((state) => state.userVaultIndex);

  // select info
  const selectedUserVault = userVaults[userVaultIndex];
  const selectedChartData = chartData[selectedUserVault.id];

  return (
    <>
      <div className="w-full font-medium">Performance: {selectedUserVault?.title ?? ""}</div>
      <div data-show="yes" className="w-[90%] h-[95%] flex justify-center items-center relative">
        <Line
          data={{
            labels: Array.from(Array(30).keys()),
            datasets: [
              {
                label: selectedUserVault,
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
      </div>
    </>
  );
}
