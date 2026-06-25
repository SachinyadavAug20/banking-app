"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({accounts}:DoughnutChartProps) => {
  const accountsNames = accounts.map((account) => account.name);
  const accountsAmount = accounts.map((account) => account.currentBalance);
  const data ={
    datasets: [
      {
        label:"Banks",
        data:accountsAmount,
        backgroundColor:["#2d3748","#3b82f6","#f87171"]
      }
    ],
    labels:accountsNames
  }
  return (
      <Doughnut data={data} options={{
        cutout:"60%",
        plugins:{
          legend:{
            display:false,
          }
        }
      }}/>
  );
};

export default DoughnutChart;
