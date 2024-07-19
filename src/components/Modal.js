// Modal.js
import React from "react";
import "../styles/Modal.css";
import { Chart, registerables } from 'chart.js';
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

const Modal = ({ isOpen, onClose, ActiveCustomar }) => {
  if (!isOpen) return null;

  const chartData = {
    labels: ActiveCustomar?.transaction.map(transaction => transaction.date), 
    datasets: [
      {
        label: `Transactions for ${ActiveCustomar?.customarData?.name}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: ActiveCustomar?.transaction.map(transaction => transaction.amount),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day' 
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10 
        }
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        <h2>Transactions for: {ActiveCustomar?.customarData?.name}</h2>
        <div className="line-chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
