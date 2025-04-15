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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10)
  };
};

const MerchandiseSalesChart = () => {
  const defaultRange = getDefaultDateRange();
  const [filters, setFilters] = useState({
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate
  });
  const [metric, setMetric] = useState('quantity'); // 'quantity' or 'revenue'
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/sales-data?${params}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSalesData(data);
      } else {
        setSalesData([]);
      }
    } catch (err) {
      setSalesData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSalesData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (salesData.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }
    const labels = salesData.map(item => item.itemName);
    const data = metric === 'quantity'
      ? salesData.map(item => item.quantity)
      : salesData.map(item => parseFloat(item.totalAmount));
    setChartData({
      labels,
      datasets: [
        {
          label: metric === 'quantity' ? 'Quantity Sold' : 'Revenue ($)',
          data,
          backgroundColor: metric === 'quantity'
            ? 'rgba(153, 102, 255, 0.6)'
            : 'rgba(75, 192, 192, 0.6)',
          borderColor: metric === 'quantity'
            ? 'rgb(153, 102, 255)'
            : 'rgb(75, 192, 192)',
          borderWidth: 1,
        }
      ]
    });
  }, [salesData, metric]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchSalesData();
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl mb-8">
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-xs mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 rounded bg-black/40 text-white"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="p-2 rounded bg-black/40 text-white"
          />
        </div>
        <button
          onClick={handleApplyFilters}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded transition"
        >
          Apply Filters
        </button>
        <div className="ml-auto flex gap-2 items-center">
          <span className="text-xs">Metric:</span>
          <button
            className={`px-3 py-1 rounded ${metric === 'quantity' ? 'bg-purple-600 text-white' : 'bg-black/40 text-purple-200'}`}
            onClick={() => setMetric('quantity')}
          >
            Quantity Sold
          </button>
          <button
            className={`px-3 py-1 rounded ${metric === 'revenue' ? 'bg-teal-600 text-white' : 'bg-black/40 text-teal-200'}`}
            onClick={() => setMetric('revenue')}
          >
            Revenue ($)
          </button>
        </div>
      </div>
      <div style={{ height: '400px' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Loading...</p>
          </div>
        ) : chartData.labels.length > 0 ? (
          <Bar data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { color: '#fff', font: { size: 12 } }
              },
              title: {
                display: true,
                text: 'Top Merchandise Sales',
                color: '#fff',
                font: { size: 16 }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) label += ': ';
                    if (context.parsed.y !== null) {
                      label += metric === 'revenue' ? `$${context.parsed.y}` : context.parsed.y;
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                ticks: { color: '#ddd' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                title: { display: true, text: metric === 'quantity' ? 'Quantity' : 'Revenue ($)', color: '#fff' }
              },
              x: {
                ticks: { color: '#ddd', maxRotation: 45, minRotation: 45 },
                grid: { color: 'rgba(255,255,255,0.1)' }
              }
            }
          }} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No sales data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchandiseSalesChart; 