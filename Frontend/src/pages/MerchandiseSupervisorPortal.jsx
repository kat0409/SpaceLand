import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function SupervisorPortal() {
    const [lowStock, setLowStock] = useState([]);
    const [ticketSales, setTicketSales] = useState([]);
    const [visitorPurchasesReport, setVisitorPurchasesReport] = useState([]);

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
    }, []);

        return (
            <>
            <Header />
            <section className="min-h-screen px-6 py-20 text-white bg-gradient-to-b from-black via-gray-900 to-black">
                <h1 className="text-4xl font-bold mb-8 text-center">📦 Merchandise Supervisor Portal</h1>
        
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