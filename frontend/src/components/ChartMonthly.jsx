import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartMonthly({ categories = [] }) {
  // categories is an array with { category, totalsByType: [{type,total}] }
  const labels = categories.map(c => c.category);
  const data = categories.map(c => {
    // prefer showing expense totals; if none, show income for that category
    const expense = c.totalsByType.find(t => t.type === 'expense')?.total || 0;
    return expense;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses by category',
        data,
      }
    ]
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <Doughnut data={chartData} />
    </div>
  );
}
