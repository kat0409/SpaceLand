import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MerchandiseSalesChart = ({ salesData = [] }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (salesData.length === 0) return;

    // Process sales data for chart
    const itemNames = [...new Set(salesData.map(sale => sale.itemName))];
    const salesByItem = itemNames.map(item => {
      const filteredSales = salesData.filter(sale => sale.itemName === item);
      const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
      const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
      
      return {
        item,
        quantity: totalQuantity,
        revenue: totalRevenue
      };
    });

    // Sort by revenue for better visualization
    salesByItem.sort((a, b) => b.revenue - a.revenue);

    // Take top 10 items for clarity
    const topItems = salesByItem.slice(0, 10);

    setChartData({
      labels: topItems.map(item => item.item),
      datasets: [
        {
          label: 'Quantity Sold',
          data: topItems.map(item => item.quantity),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgb(153, 102, 255)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'Revenue ($)',
          data: topItems.map(item => item.revenue.toFixed(2)),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          yAxisID: 'y1',
        }
      ]
    });
  }, [salesData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Quantity',
          color: '#fff'
        },
        ticks: {
          color: '#ddd',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Revenue ($)',
          color: '#fff'
        },
        ticks: {
          color: '#ddd',
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          color: '#ddd',
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Top Merchandise Sales',
        color: '#fff',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 1) {
                label += `$${context.parsed.y}`;
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl mb-8" style={{ height: '400px' }}>
      {salesData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>No sales data available</p>
        </div>
      )}
    </div>
  );
};

export default MerchandiseSalesChart; 