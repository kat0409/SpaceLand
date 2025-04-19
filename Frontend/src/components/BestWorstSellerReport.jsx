import React, { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://spaceland.onrender.com";

export default function BestWorstSellerReport() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    transactionType: "all",
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    const { startDate, endDate, transactionType } = filters;

    if (!startDate || !endDate) {
      setError("Start and end dates are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams({
        startDate,
        endDate,
        transactionType
      }).toString();

      const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/best-worst?${query}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch report");
      setReportData(data);
    } catch (err) {
      setError(err.message);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-xl mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Best/Worst Seller Report</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-white">Start Date</label>
          <input
            type="date"
            className="p-2 rounded bg-black text-white"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white">End Date</label>
          <input
            type="date"
            className="p-2 rounded bg-black text-white"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white">Transaction Type</label>
          <select
            value={filters.transactionType}
            onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
            className="p-2 rounded bg-black text-white"
          >
            <option value="all">All</option>
            <option value="ticket">Tickets</option>
            <option value="mealplan">Meal Plans</option>
            <option value="merch">Merchandise</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchReport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Error / Loading */}
      {error && <div className="text-red-500 font-semibold mb-2">{error}</div>}
      {loading && <div className="text-purple-300">Loading report...</div>}

      {/* Report Table */}
      {!loading && reportData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-white text-sm bg-white/5 rounded-lg">
            <thead className="bg-purple-800 text-white">
              <tr>
                <th className="p-3">Transaction Type</th>
                <th className="p-3">Best Seller</th>
                <th className="p-3">Worst Seller</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((entry, idx) => (
                <tr key={idx} className="text-center border-b border-gray-700">
                  <td className="p-3 capitalize">{entry.transactionType}</td>
                  <td className="p-3">{entry.best}</td>
                  <td className="p-3">{entry.worst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && reportData.length === 0 && !error && (
        <div className="text-white mt-4">No data available for selected filters.</div>
      )}
    </div>
  );
}