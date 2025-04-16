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
import TransactionSummaryReport from '../components/TransactionSummaryReport';
import BestWorstSellerReport from "../components/BestWorstSellerReport";

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
    const [showAlerts, setShowAlerts] = useState(true);
    const {logout} = useContext(AuthContext);
    /*const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        ticketType: '',
        visitorName:'',
        minSpent: '',
        maxSpent: '',
        purchaseType: '',
        merchandiseItem: ''
    });*/
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        transactionType: "",
        bestOnly: "0"
    });
    const [notification, setNotification] = useState({ message: '', type: '' });

    /*const fetchFilteredReport = () => {
        const params = new URLSearchParams(filters);
        fetch(`${BACKEND_URL}/supervisor/merchandise/visitor-purchases?${params.toString()}`)
            .then(res => res.json())
            .then(data => setVisitorPurchasesReport(data))
            .catch(err => console.error('Filtered report error:', err));
    };*/

    useEffect(() => {
        fetch(`${BACKEND_URL}/weather-alert`)
            .then(res => res.json())
            .then(data => {
                const unresolved = data.filter(alert => alert.isResolved === 0);
                setWeatherAlerts(unresolved);
            })
            .catch(err => console.error("Failed to fetch weather alerts:", err));
    }, []);

    const fetchFilteredReport = async () => {
        try {
            const params = new URLSearchParams();
        
            if (filters.startDate) params.append("startDate", filters.startDate);
            if (filters.endDate) params.append("endDate", filters.endDate);
            if (filters.transactionType) params.append("transactionType", filters.transactionType);
            if (filters.bestOnly) params.append("bestOnly", filters.bestOnly);
        
            const response = await fetch(`https://spacelandmark.onrender.com/supervisor/merchandise/sales-report?${params.toString()}`);
            const data = await response.json();
        
        if (!Array.isArray(data)) {
            console.error("Unexpected sales data:", data);
            return;
        }

            setSalesData(data); 
        } catch (error) {
            console.error("Error fetching sales report:", error);
        }
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

    const toggleAlerts = () => {
        setShowAlerts(!showAlerts);
    };
    
    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                const response = await fetch(`${BACKEND_URL}/supervisor/merchandise/delete-item?merchandiseID=${itemId}`, {
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
        /*fetch(`${BACKEND_URL}/supervisor/merchandise/sales-data`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSalesData(data);
                } else {
                    console.error("Unexpected sales data:", data);
                }
            })
            .catch(err => console.error("Error fetching sales data:", err));*/
            
        fetchFilteredReport();
    }, []);

    useEffect(() => {
        fetchFilteredReport();
    },[filters]);

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

                {/* Low Stock Alerts - Enhanced Collapsible */}
                {lowStockItems.length > 0 && (
                    <div className={`mb-6 transition-all duration-300 ease-in-out ${showAlerts ? 'opacity-100' : 'opacity-90'}`}>
                        <div 
                            className={`border border-red-500/50 rounded-lg overflow-hidden transition-all duration-300 ${showAlerts ? 'bg-red-900/50' : 'bg-red-950/30'}`}
                        >
                            {/* Alert Header - Always Visible */}
                            <div 
                                className="flex justify-between items-center cursor-pointer p-3 hover:bg-red-800/30"
                                onClick={toggleAlerts}
                            >
                                <div className="flex items-center">
                                    <span className="text-red-300 mr-2">
                                        {/* Alert Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <strong className="font-bold text-red-200">Low Stock Alert!</strong>
                                    <span className="text-red-300 text-sm ml-2">({lowStockItems.length} items)</span>
                                </div>
                                
                                <div className="flex items-center">
                                    <span className="text-xs text-red-300 mr-2">{showAlerts ? 'Click to collapse' : 'Click to expand'}</span>
                                    <button className="text-red-200 hover:text-white focus:outline-none transition-transform duration-300" style={{ transform: showAlerts ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Alert Content - Collapsible */}
                            <div 
                                className="overflow-hidden transition-all duration-300 ease-in-out"
                                style={{ 
                                    maxHeight: showAlerts ? '500px' : '0',
                                    opacity: showAlerts ? 1 : 0,
                                    padding: showAlerts ? '0.75rem 1rem 1rem' : '0 1rem'
                                }}
                            >
                                <ul className="space-y-2 text-red-200">
                                    {lowStockItems.map((item) => (
                                        <li key={item.notificationID} className="flex items-center">
                                            <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                                            <span>{item.itemName}: Only {item.stockLevel} left — {item.message}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3 pt-3 border-t border-red-500/30">
                                    <span className="text-xs text-red-300/70">Items below critical threshold require immediate attention</span>
                                </div>
                            </div>
                        </div>
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
                        <InventoryOverviewChart inventoryData={merchandise} />
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
                                                    <button onClick={() => handleEditItem(item)} className="text-blue-400 hover:underline mr-2">Edit</button>
                                                    <button onClick={() => handleDeleteItem(item.merchandiseID)} className="text-red-400 hover:underline">Delete</button>
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
                        <TransactionSummaryReport />
                        <BestWorstSellerReport />
                        <div className="bg-white/10 p-6 rounded-xl">
                            <div className="flex items-center justify-center p-8">
                                <div className="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-xl font-semibold mb-2">Advanced Sales Reports</h3>
                                    <p className="text-gray-400 mb-4">This feature is currently under development.</p>
                                    <p className="text-gray-400 text-sm">Please refer to the summary reports above for sales information.</p>
                                </div>
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