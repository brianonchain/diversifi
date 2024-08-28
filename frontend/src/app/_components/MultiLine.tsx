// import { Line } from "react-chartjs-2";
// import { Chart, registerables } from "chart.js";
// Chart.register(...registerables);

// const LineChart = () => {
//   const mockHistory = {
//     slow: [
//       1.81, 1.84, 1.83, 1.82, 1.8, 1.78, 1.76, 1.76, 1.77, 1.74, 1.72, 1.78, 1.76, 1.8, 1.81, 1.82, 1.84, 1.9, 1.91, 1.85, 1.86, 1.76, 1.77,
//       1.8, 1.81,
//     ],
//     average: [
//       1.81, 1.84, 1.83, 1.82, 1.8, 1.78, 1.76, 1.76, 1.77, 1.74, 1.72, 1.78, 1.76, 1.8, 1.81, 1.82, 1.84, 1.9, 1.91, 1.85, 1.86, 1.76, 1.77,
//       1.8, 1.81,
//     ].map((i) => i * 1.1),
//     fast: [
//       1.81, 1.84, 1.83, 1.82, 1.8, 1.78, 1.76, 1.76, 1.77, 1.74, 1.72, 1.78, 1.76, 1.8, 1.81, 1.82, 1.84, 1.9, 1.91, 1.85, 1.86, 1.76, 1.77,
//       1.8, 1.81,
//     ].map((i) => i * 1.2),
//   };

//   return (
//     <div className="w-full h-[250px] flex justify-center">
//       <Line
//         datasetIdKey="id"
//         data={{
//           labels: Array.from(Array(24).keys()),
//           datasets: [
//             { label: "SLOW", data: mockHistory.slow, backgroundColor: "rgb(209, 60, 96)", borderColor: "rgb(209, 60, 96)" },
//             { label: "AVERAGE", data: mockHistory.average, backgroundColor: "rgb(219, 91, 89)", borderColor: "rgb(219, 91, 89)" },
//             { label: "FAST", data: mockHistory.fast, backgroundColor: "rgb(235, 144, 76)", borderColor: "rgb(235, 144, 76)" },
//           ],
//         }}
//         options={{
//           scales: {
//             y: {
//               ticks: { color: "white", backdropColor: "white", display: true },
//               border: { color: "white" },
//             },
//             x: {
//               ticks: { color: "white", backdropColor: "white", display: true },
//               border: { color: "white" },
//             },
//           },
//           position: "right",
//           showLine: true,
//           elements: {
//             point: {
//               radius: 0,
//             },
//           },
//           plugins: {
//             legend: {
//               display: true,
//               labels: { color: "white", padding: 30 },
//             },
//           },
//           interaction: {
//             intersect: false,
//             mode: "index",
//           },
//           spanGaps: true,
//         }}
//         plugins={[
//           {
//             afterDraw: (chart) => {
//               if (chart.tooltip?._active?.length) {
//                 let x = chart.tooltip._active[0].element.x;
//                 let yAxis = chart.scales.y;
//                 let ctx = chart.ctx;
//                 ctx.save();
//                 ctx.beginPath();
//                 ctx.setLineDash([5, 5]);
//                 ctx.moveTo(x, yAxis.top);
//                 ctx.lineTo(x, yAxis.bottom);
//                 ctx.lineWidth = 1;
//                 ctx.strokeStyle = "rgba(235, 144, 76)";
//                 ctx.stroke();
//                 ctx.restore();
//               }
//             },
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default LineChart;
