import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReorderForm from './ReorderForm';
import StockArrivalForm from './StockArrival';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function SupervisorPortal() {
    const [lowStock, setLowStock] = useState([]);
    const [ticketSales, setTicketSales] = useState([]);
    const [visitorPurchasesReport, setVisitorPurchasesReport] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [merchandise, setMerchandise] = useState([]);
    const [merchReorders, setMerchReorders] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        ticketType: '',
        visitorName:'',
        minSpent: '',
        maxSpent: '',
        purchaseType: '',
        merchandiseItem: ''
    });

    const fetchFilteredReport = () => {
        const params = new URLSearchParams(filters);
        fetch(`${BACKEND_URL}/supervisor/merchandise/visitor-purchases?${params.toString()}`)
            .then(res => res.json())
            .then(data => setVisitorPurchasesReport(data))
            .catch(err => console.error('Filtered report error:'. err));
    };

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/merchandise/low-stock`)
            .then(res => res.json())
            .then(data => setLowStock(data))
            .catch(err => console.error('Low Stock Error:', err));
        fetch(`${BACKEND_URL}/supervisor/merchandise/ticket-sales`)
            .then(res => res.json())
            .then(data => setTicketSales(data))
            .catch(err => console.error('Ticket Sales Error:', err));
        fetch(`${BACKEND_URL}/supervisor/merchandise/visitor-purchases`)
            .then(res => res.json())
            .then(data => setVisitorPurchasesReport(data))
            .catch(err => console.error('Visitor Purchases Report Error:', err));
        fetch(`${BACKEND_URL}/supervisor/merchandise/notifications?SupervisorID=12`)
            .then(res => res.json())
            .then(data => setLowStockItems(data))
            .catch(err => console.error('Error fetching low stock notifications:', err));
        fetch(`${BACKEND_URL}/supervisor/merchandise/merch`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                setMerchandise(data);
                } else {
                console.error("Unexpected merchandise data:", data);
                }
            })
            .catch((err) => {
                console.error("Error fetching merchandise:", err);
            });
        fetch(`${BACKEND_URL}/supervisor/merchandise/orders`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                setMerchReorders(data);
                } else {
                console.error("Unexpected order data:", data);
                }
            })
            .catch((err) => {
                console.error("Error fetching merchandise orders:", err);
            });
        fetchFilteredReport();
    }, []);

        return (
            <>
            <Header />
            <section className="min-h-screen px-6 py-20 text-white bg-gradient-to-b from-black via-gray-900 to-black">
                <h1 className="text-4xl font-bold mb-8 text-center">📦 Merchandise Supervisor Portal</h1>

                {lowStockItems.length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">Low Stock Alert!</strong>
                        <ul className="mt-2 list-disc list-inside">
                        {lowStockItems.map((item) => (
                            <li key={item.notificationID}>
                            {item.itemName}: Only {item.stockLevel} left — {item.message}
                            </li>
                        ))}
                        </ul>
                    </div>
                )}

                {/* TICKET SALES */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">🎟 Ticket Sales</h2>
                    <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-purple-300">
                        <tr>
                            <th>Ticket ID</th>
                            <th>Visitor ID</th>
                            <th>Type</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ticketSales.map(ticket => (
                            <tr key={ticket.ticketID} className="border-t border-white/10">
                            <td>{ticket.ticketID}</td>
                            <td>{ticket.VisitorID}</td>
                            <td>{ticket.ticketType}</td>
                            <td>${ticket.price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
        
                {/* Low Stock */}
                <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Low Stock Alerts</h2>
                <ul className="bg-white/10 rounded-xl p-4">
                    {lowStock.map(item => (
                    <li key={item.merchandiseID}>
                        {item.itemName} — Qty: {item.quantity}
                    </li>
                    ))}
                </ul>
                </div>
                
                <div className="bg-white/10 p-4 rounded-xl mb-8">
                <h2 className="text-lg mb-2 font-semibold">Filter Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="date" placeholder="Start Date" value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
                    <input type="date" placeholder="End Date" value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
                    <select value={filters.ticketType}
                    onChange={(e) => setFilters({ ...filters, ticketType: e.target.value })}>
                    <option value="">All Ticket Types</option>
                    <option value="General">General</option>
                    <option value="Cosmic">Cosmic</option>
                    </select>
                    <input type="text" placeholder="Visitor Name" value={filters.visitorName}
                    onChange={(e) => setFilters({ ...filters, visitorName: e.target.value })} />
                    <input type="number" placeholder="Min Total Spent" value={filters.minSpent}
                    onChange={(e) => setFilters({ ...filters, minSpent: e.target.value })} />
                    <input type="number" placeholder="Max Total Spent" value={filters.maxSpent}
                    onChange={(e) => setFilters({ ...filters, maxSpent: e.target.value })} />
                    <select value={filters.purchaseType}
                    onChange={(e) => setFilters({ ...filters, purchaseType: e.target.value })}>
                    <option value="">All Purchases</option>
                    <option value="tickets">Tickets Only</option>
                    <option value="merchandise">Merchandise Only</option>
                    <option value="both">Both</option>
                    </select>
                    <input type="text" placeholder="Merchandise Item" value={filters.merchandiseItem}
                    onChange={(e) => setFilters({ ...filters, merchandiseItem: e.target.value })} />
                </div>
                <button className="mt-4 px-4 py-2 bg-purple-600 rounded"
                    onClick={fetchFilteredReport}>Apply Filters</button>
                </div>

                <div className="p-6">
                    {/* ...other components */}
                    <ReorderForm />
                </div>

                <div className="p-6">
                    {/* ...other components */}
                    <StockArrivalForm />
                </div>
        
                {/* Visitor Purchases */}
                <div>
                <h2 className="text-2xl font-semibold mb-4">Visitor Purchases Report</h2>
                <table className="w-full text-sm bg-white/10 rounded-xl p-4">
                    <thead className="text-purple-300">
                    <tr>
                        <th>Visitor</th>
                        <th>Ticket Type</th>
                        <th>Merchandise</th>
                        <th>Total Spent</th>
                    </tr>
                    </thead>
                    <tbody>
                    {visitorPurchasesReport.map((v, idx) => (
                        <tr key={idx}>
                        <td>{v.Visitor_Name}</td>
                        <td>{v.Ticket_Type || 'N/A'}</td>
                        <td>{v.Merchandise_Bought || 'N/A'}</td>
                        <td>${(v.Merchandise_Total_Spent || 0)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                {/* Merchandise Table */}
                <div>
                <h2 className="text-2xl font-semibold mb-4">🛍️ Merchandise Inventory</h2>
                <table className="w-full text-sm bg-white/10 rounded-xl p-4">
                    <thead className="text-purple-300">
                    <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {merchandise.map((item) => (
                        <tr key={item.merchandiseID}>
                        <td>{item.merchandiseID}</td>
                        <td>{item.itemName}</td>
                        <td>{item.quantity}</td>
                        <td>${parseFloat(item.price).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                {/* Merchandise Re-Orders Table */}
                <div>
                <h2 className="text-2xl font-semibold mb-4">📦 Merchandise Re-Orders</h2>
                <table className="w-full text-sm bg-white/10 rounded-xl p-4">
                    <thead className="text-purple-300">
                    <tr>
                        <th>Reorder ID</th>
                        <th>Item Name</th>
                        <th>Quantity Ordered</th>
                        <th>Expected Arrival</th>
                        <th>Status</th>
                        <th>Notes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {merchReorders.map((order) => (
                        <tr key={order.reorderID}>
                        <td>{order.reorderID}</td>
                        <td>{order.itemName}</td>
                        <td>{order.quantityOrdered}</td>
                        <td>{order.expectedArrivalDate ? new Date(order.expectedArrivalDate).toLocaleDateString() : 'N/A'}</td>
                        <td>{order.status}</td>
                        <td>{order.notes || '—'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </section>
            <Footer />
            </>
        );
}