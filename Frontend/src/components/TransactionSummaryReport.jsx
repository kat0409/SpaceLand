import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function TransactionSummaryReport() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    transactionType: 'all'
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    const formattedToday = today.toISOString().split('T')[0];
    const formattedWeekAgo = weekAgo.toISOString().split('T')[0];

    setFilters({
      startDate: formattedWeekAgo,
      endDate: formattedToday,
      transactionType: 'all'
    });
  }, []);

  const fetchReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError('Please select a valid date range.');
      return;
    }

    setLoading(true);
    setError('');

    const params = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
      transactionType: filters.transactionType
    });

    try {
      const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/transaction-summary?${params}`);
      const data = await res.json();

      if (res.ok) {
        setReportData(data);
      } else {
        setError(data.error || 'Failed to load report.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-white">Transaction Summary Report</h2>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-white text-sm">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="p-2 rounded bg-black/50 text-white"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white text-sm">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="p-2 rounded bg-black/50 text-white"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white text-sm">Transaction Type</label>
          <select
            value={filters.transactionType}
            onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
            className="p-2 rounded bg-black/50 text-white"
          >
            <option value="all">All</option>
            <option value="ticket">Ticket</option>
            <option value="mealplan">Meal Plan</option>
            <option value="merch">Merchandise</option>
          </select>
        </div>

        <button
          onClick={fetchReport}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Report Output */}
      {error && <div className="text-red-400">{error}</div>}

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <table className="w-full text-sm text-white mt-4">
          <thead className="text-purple-300 text-left">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Transaction Type</th>
              <th className="p-2">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((row, idx) => (
                <tr key={idx} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-2">{row.transactionDate}</td>
                  <td className="p-2 capitalize">{row.transactionType}</td>
                  <td className="p-2">${parseFloat(row.totalRevenue).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-400">
                  No transactions found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}