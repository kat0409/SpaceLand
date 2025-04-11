import { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReorderForm from './ReorderForm';
import StockArrivalForm from './StockArrival';
import AddMerchandiseForm from './AddMerchForm';
import MerchandiseSalesChart from '../components/MerchandiseSalesChart';
import InventoryOverviewChart from '../components/InventoryOverviewChart';
import EditMerchandiseModal from '../components/EditMerchandiseModal';
import { AuthContext } from '../components/AuthProvider';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function SupervisorPortal() {
    const [lowStock, setLowStock] = useState([]);
    const [ticketSales, setTicketSales] = useState([]);
    const [visitorPurchasesReport, setVisitorPurchasesReport] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [merchandise, setMerchandise] = useState([]);
    const [merchReorders, setMerchReorders] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const {logout} = useContext(AuthContext);
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
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchFilteredReport = () => {
        const params = new URLSearchParams(filters);
        fetch(`${BACKEND_URL}/supervisor/merchandise/visitor-purchases?${params.toString()}`)
            .then(res => res.json())
            .then(data => setVisitorPurchasesReport(data))
            .catch(err => console.error('Filtered report error:', err));
    };
    
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };
    
    const handleEditItem = (item) => {
        setCurrentItem(item);
        setEditModalOpen(true);
    };
    
    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                const response = await fetch(`${BACKEND_URL}/supervisor/merchandise/delete-item/${itemId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    // Remove the item from the state
                    setMerchandise(prev => prev.filter(item => item.merchandiseID !== itemId));
                    showNotification('Item deleted successfully');
                } else {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to delete item');
                }
            } catch (error) {
                showNotification(error.message, 'error');
                console.error('Delete error:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };
    
    const handleSaveEdit = async (updatedItem) => {
        try {
            const response = await fetch(`${BACKEND_URL}/supervisor/merchandise/update-item`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update item');
            }
            
            // Update the item in the state
            setMerchandise(prev => 
                prev.map(item => 
                    item.merchandiseID === updatedItem.merchandiseID ? updatedItem : item
                )
            );
            
            showNotification('Item updated successfully');
            return Promise.resolve();
        } catch (error) {
            showNotification(error.message, 'error');
            console.error('Update error:', error);
            return Promise.reject(error);
        }
    };

    useEffect(() => {
        // Fetch low stock items
        fetch(`${BACKEND_URL}/supervisor/merchandise/low-stock`)
            .then(res => res.json())
            .then(data => setLowStock(data))
            .catch(err => console.error('Low Stock Error:', err));
        
        // Fetch ticket sales
        fetch(`${BACKEND_URL}/supervisor/merchandise/ticket-sales`)
            .then(res => res.json())
            .then(data => setTicketSales(data))
            .catch(err => console.error('Ticket Sales Error:', err));
        
        // Fetch visitor purchases report
        fetch(`${BACKEND_URL}/supervisor/merchandise/visitor-purchases`)
            .then(res => res.json())
            .then(data => setVisitorPurchasesReport(data))
            .catch(err => console.error('Visitor Purchases Report Error:', err));
        
        // Fetch low stock notifications
        fetch(`${BACKEND_URL}/supervisor/merchandise/notifications?SupervisorID=12`)
            .then(res => res.json())
            .then(data => setLowStockItems(data))
            .catch(err => console.error('Error fetching low stock notifications:', err));
        
        // Fetch merchandise data
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
        
        // Fetch merchandise orders
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
        
        // Fetch merchandise sales data for charts
        fetch(`${BACKEND_URL}/supervisor/merchandise/sales-data`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSalesData(data);
                } else {
                    console.error("Unexpected sales data:", data);
                }
            })
            .catch(err => console.error("Error fetching sales data:", err));
            
        fetchFilteredReport();
    }, []);

    return (
        <>
            <Header />
            <section className="min-h-screen px-6 py-10 text-white bg-gradient-to-b from-black via-gray-900 to-black">
                <h1 className="text-4xl font-bold mb-4 text-center">📦 Merchandise Supervisor Portal</h1>
                
                {/* Notification Banner */}
                {notification.message && (
                    <div className={`p-4 mb-6 rounded-lg ${notification.type === 'error' ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                        {notification.message}
                    </div>
                )}

                {/* Low Stock Alerts */}
                {lowStockItems.length > 0 && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6" role="alert">
                        <strong className="font-bold">⚠️ Low Stock Alert!</strong>
                        <ul className="mt-2 list-disc list-inside">
                            {lowStockItems.map((item) => (
                                <li key={item.notificationID}>
                                    {item.itemName}: Only {item.stockLevel} left — {item.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex flex-wrap border-b border-gray-700 mb-6">
                    <button 
                        className={`py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button 
                        className={`py-2 px-4 font-medium ${activeTab === 'inventory' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        Inventory
                    </button>
                    <button 
                        className={`py-2 px-4 font-medium ${activeTab === 'sales' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('sales')}
                    >
                        Sales Reports
                    </button>
                    <button 
                        className={`py-2 px-4 font-medium ${activeTab === 'manage' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('manage')}
                    >
                        Manage Inventory
                    </button>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        <InventoryOverviewChart inventoryData={merchandise} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recent Orders */}
                            <div className="bg-white/10 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                                {merchReorders.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="text-left text-purple-300">
                                                <tr>
                                                    <th className="pb-2">Item</th>
                                                    <th className="pb-2">Qty</th>
                                                    <th className="pb-2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {merchReorders.slice(0, 5).map(order => (
                                                    <tr key={order.reorderID} className="border-t border-white/10">
                                                        <td className="py-2">{order.itemName}</td>
                                                        <td className="py-2">{order.quantityOrdered}</td>
                                                        <td className="py-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                order.status === 'pending' ? 'bg-yellow-900/50 text-yellow-200' :
                                                                order.status === 'delivered' ? 'bg-green-900/50 text-green-200' :
                                                                'bg-blue-900/50 text-blue-200'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No recent orders</p>
                                )}
                            </div>
                            
                            {/* Low Stock Items */}
                            <div className="bg-white/10 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold mb-4">Low Stock Items</h2>
                                {lowStock.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="text-left text-purple-300">
                                                <tr>
                                                    <th className="pb-2">Item</th>
                                                    <th className="pb-2">Qty</th>
                                                    <th className="pb-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lowStock.map(item => (
                                                    <tr key={item.merchandiseID} className="border-t border-white/10">
                                                        <td className="py-2">{item.itemName}</td>
                                                        <td className="py-2">{item.quantity}</td>
                                                        <td className="py-2">
                                                            <button 
                                                                onClick={() => handleEditItem(item)}
                                                                className="text-blue-400 hover:text-blue-300 mr-2"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteItem(item.merchandiseID)}
                                                                className="text-red-400 hover:text-red-300"
                                                                disabled={isDeleting}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No low stock items</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                        <div className="bg-white/10 p-6 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">🛍️ Merchandise Inventory</h2>
                                <button
                                    onClick={() => setActiveTab('manage')}
                                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
                                >
                                    Add New Item
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-left text-purple-300">
                                        <tr>
                                            <th className="p-2">ID</th>
                                            <th className="p-2">Item Name</th>
                                            <th className="p-2">Shop</th>
                                            <th className="p-2">Quantity</th>
                                            <th className="p-2">Price</th>
                                            <th className="p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {merchandise.map((item) => (
                                            <tr key={item.merchandiseID} className="border-t border-white/10 hover:bg-white/5">
                                                <td className="p-2">{item.merchandiseID}</td>
                                                <td className="p-2">{item.itemName}</td>
                                                <td className="p-2">{item.giftShopName || '—'}</td>
                                                <td className="p-2">
                                                    <span className={
                                                        item.quantity < 10 ? 'text-red-400' : 
                                                        item.quantity < 30 ? 'text-yellow-400' : 
                                                        'text-green-400'
                                                    }>
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="p-2">${parseFloat(item.price).toFixed(2)}</td>
                                                <td className="p-2">
                                                    <button 
                                                        onClick={() => handleEditItem(item)}
                                                        className="text-blue-400 hover:text-blue-300 mr-3"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteItem(item.merchandiseID)}
                                                        className="text-red-400 hover:text-red-300"
                                                        disabled={isDeleting}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="bg-white/10 p-6 rounded-xl">
                            <h2 className="text-2xl font-semibold mb-4">📦 Merchandise Orders</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-left text-purple-300">
                                        <tr>
                                            <th className="p-2">ID</th>
                                            <th className="p-2">Item</th>
                                            <th className="p-2">Quantity</th>
                                            <th className="p-2">Expected Arrival</th>
                                            <th className="p-2">Status</th>
                                            <th className="p-2">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {merchReorders.map((order) => (
                                            <tr key={order.reorderID} className="border-t border-white/10 hover:bg-white/5">
                                                <td className="p-2">{order.reorderID}</td>
                                                <td className="p-2">{order.itemName}</td>
                                                <td className="p-2">{order.quantityOrdered}</td>
                                                <td className="p-2">{order.expectedArrivalDate ? new Date(order.expectedArrivalDate).toLocaleDateString() : '—'}</td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        order.status === 'pending' ? 'bg-yellow-900/50 text-yellow-200' :
                                                        order.status === 'delivered' ? 'bg-green-900/50 text-green-200' :
                                                        'bg-blue-900/50 text-blue-200'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-2">{order.notes || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sales Reports Tab */}
                {activeTab === 'sales' && (
                    <div className="space-y-6">
                        <MerchandiseSalesChart salesData={salesData} />
                        
                        <div className="bg-white/10 p-4 rounded-xl mb-6">
                            <h2 className="text-lg mb-2 font-semibold">Filter Report</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <input 
                                    type="date" 
                                    placeholder="Start Date" 
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    className="w-full p-2 rounded bg-black/50 text-white border border-gray-700"
                                />
                                <input 
                                    type="date" 
                                    placeholder="End Date" 
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    className="w-full p-2 rounded bg-black/50 text-white border border-gray-700"
                                />
                                <select 
                                    value={filters.ticketType}
                                    onChange={(e) => setFilters({ ...filters, ticketType: e.target.value })}
                                    className="w-full p-2 rounded bg-black/50 text-white border border-gray-700"
                                >
                                    <option value="">All Ticket Types</option>
                                    <option value="General">General</option>
                                    <option value="Cosmic">Cosmic</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Visitor Name" 
                                    value={filters.visitorName}
                                    onChange={(e) => setFilters({ ...filters, visitorName: e.target.value })}
                                    className="w-full p-2 rounded bg-black/50 text-white border border-gray-700"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Min Total Spent" 
                                    value={filters.minSpent}
                                    onChange={(e) => setFilters({ ...filters, minSpent: e.target.value })}
                                    className="w-full p-2 rounded bg-black/50 text-white border border-gray-700"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Max Total Spent" 
                                    value={filters.maxSpent}
                                    onChange={(e) => setFilters({ ...filters, maxSpent: e.target.value })}
                                    className="w-full p-2 rounded bg-black/50 text-white border border-gray-700"
                                />
                                <select 
                                    value={filters.purchaseType}
                                    onChange={(e) => setFilters({ ...filters, purchaseType: e.target.value })}
                                    className="w-full p-2 rounded bg-black/50 text-white border border-gray-700"
                                >
                                    <option value="">All Purchases</option>
                                    <option value="tickets">Tickets Only</option>
                                    <option value="merchandise">Merchandise Only</option>
                                    <option value="both">Both</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Merchandise Item" 
                                    value={filters.merchandiseItem}
                                    onChange={(e) => setFilters({ ...filters, merchandiseItem: e.target.value })}
                                    className="w-full p-2 rounded bg-black/50 text-white border border-gray-700"
                                />
                            </div>
                            <button 
                                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition"
                                onClick={fetchFilteredReport}
                            >
                                Apply Filters
                            </button>
                        </div>
                        
                        <div className="bg-white/10 p-6 rounded-xl">
                            <h2 className="text-2xl font-semibold mb-4">Visitor Purchases Report</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-left text-purple-300">
                                        <tr>
                                            <th className="p-2">Visitor</th>
                                            <th className="p-2">Ticket Type</th>
                                            <th className="p-2">Merchandise</th>
                                            <th className="p-2">Total Spent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visitorPurchasesReport.map((v, idx) => (
                                            <tr key={idx} className="border-t border-white/10 hover:bg-white/5">
                                                <td className="p-2">{v.Visitor_Name}</td>
                                                <td className="p-2">{v.Ticket_Type || 'N/A'}</td>
                                                <td className="p-2">{v.Merchandise_Bought || 'N/A'}</td>
                                                <td className="p-2">${parseFloat(v.Merchandise_Total_Spent || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manage Inventory Tab */}
                {activeTab === 'manage' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/10 p-6 rounded-xl">
                            <AddMerchandiseForm />
                        </div>
                        
                        <div className="bg-white/10 p-6 rounded-xl">
                            <ReorderForm />
                        </div>
                        
                        <div className="bg-white/10 p-6 rounded-xl md:col-span-2">
                            <StockArrivalForm />
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                <EditMerchandiseModal 
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    item={currentItem}
                    onSave={handleSaveEdit}
                />
                
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = "/employee-login"
                        }}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
                    >
                        Logout
                    </button>
                </div>
            </section>
            <Footer />
        </>
    );
}