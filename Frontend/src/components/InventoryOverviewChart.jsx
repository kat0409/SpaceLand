import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const InventoryOverviewChart = ({ inventoryData = [] }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (inventoryData.length === 0) return;

    // Create inventory categories based on stock levels
    const lowStock = inventoryData.filter(item => item.quantity < 10);
    const mediumStock = inventoryData.filter(item => item.quantity >= 10 && item.quantity < 50);
    const highStock = inventoryData.filter(item => item.quantity >= 50);

    const data = [
      lowStock.length,
      mediumStock.length,
      highStock.length
    ];

    setChartData({
      labels: ['Low Stock (< 10)', 'Medium Stock (10-49)', 'High Stock (50+)'],
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [inventoryData]);

  // Calculate inventory value
  const calculateInventoryValue = () => {
    if (inventoryData.length === 0) return 0;
    
    return inventoryData.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Inventory Overview',
        color: '#fff',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = Math.round((value / inventoryData.length) * 100);
            return `${label}: ${value} items (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white/10 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-purple-300">Total Items</h3>
          <p className="text-2xl font-bold">{inventoryData.length}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-purple-300">Total Value</h3>
          <p className="text-2xl font-bold">${calculateInventoryValue()}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-red-300">Low Stock Items</h3>
          <p className="text-2xl font-bold">{inventoryData.filter(item => item.quantity < 10).length}</p>
        </div>
      </div>
      <div style={{ height: '300px' }}>
        {inventoryData.length > 0 ? (
          <Doughnut data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No inventory data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryOverviewChart; 