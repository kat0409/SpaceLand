import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Handle special database format
    if (typeof dateString === 'string' && dateString.includes('-')) {
      // Extract date parts from the string
      const parts = dateString.split('T')[0].split('-');
      if (parts.length === 3) {
        // Create date using UTC to avoid timezone offset issues
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
        const day = parseInt(parts[2]);
        
        // Use the date parts to construct a date string that won't shift due to timezone
        return `${month + 1}/${day}/${year}`;
      }
    }
    // For non-string or non-standard formats, use the date object
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // Use UTC methods to avoid timezone issues
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1; // JS months are 0-indexed
      const day = date.getUTCDate();
      
      // Format with leading zeros
      return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    }
    
    // Last fallback - just use the raw string
    return dateString;
  } catch (error) {
    console.error("Date parsing error:", error);
    return dateString;
  }
};

export default function TransactionSummaryReport() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    transactionType: 'all'
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    fetchReport(formattedWeekAgo, formattedToday, 'all');
  }, []);

  const fetchReport = async (startDate, endDate, transactionType) => {
    if (!startDate || !endDate) {
      setError('Please select a valid date range.');
      return;
    }

    setLoading(true);
    setError('');

    const params = new URLSearchParams({
      startDate: startDate || filters.startDate,
      endDate: endDate || filters.endDate,
      transactionType: transactionType || filters.transactionType
    });

    try {
      const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/transaction-summary?${params}`);
      const data = await res.json();

      if (res.ok) {
        const processedData = data.map(row => ({
          ...row,
          totalQty: row.totalQty !== null ? parseInt(row.totalQty, 10) : 0,
          totalRevenue: parseFloat(row.totalRevenue || 0),
          breakdown: row.breakdown !== undefined && row.breakdown !== null ? String(row.breakdown) : '-'
        }));

        setReportData(processedData);
      } else {
        setError(data.error || 'Failed to load report.');
      }
    } catch (err) {
      console.error('Error fetching transaction data:', err);
      setError('Something went wrong.');
    }

    setLoading(false);
  };

  const handleFilterApply = () => {
    fetchReport(filters.startDate, filters.endDate, filters.transactionType);
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-white">Transaction Summary Report</h2>

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
          onClick={handleFilterApply}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {error && <div className="text-red-400">{error}</div>}

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <table className="w-full text-sm text-white mt-4">
          <thead className="text-purple-300 text-left">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Transaction Type</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Total Revenue</th>
              <th className="p-2">Quantity Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((row, idx) => (
                <tr key={idx} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-2">{formatDate(row.transactionDate)}</td>
                  <td className="p-2 capitalize">{row.transactionType}</td>
                  <td className="p-2">{formatNumber(row.totalQty)}</td>
                  <td className="p-2">${parseFloat(row.totalRevenue).toFixed(2)}</td>
                  <td className="p-2">{row.breakdown}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-400">
                  No transactions found for selected filters.
                  {filters.startDate && filters.endDate ? '' : ' Please select a date range.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}