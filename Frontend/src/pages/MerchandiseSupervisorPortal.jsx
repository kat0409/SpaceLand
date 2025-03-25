import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function SupervisorPortal() {
    const [lowStock, setLowStock] = useState([]);
    const [ticketSales, setTicketSales] = useState([]);
    const [visitorPurchasesReport, setVisitorPurchasesReport] = useState([]);
    //const [lowStockNotification, ]

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
        fetch(`${BACKEND_URL}/supervisor/merchandise/notifications?supervisorID=12`)
            .then(res => res.json())
            .then(data => setLowStockItems(data))
            .catch(err => console.error('Error fetching low stock notifications:', err));
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
            </section>
            <Footer />
            </>
        );
}