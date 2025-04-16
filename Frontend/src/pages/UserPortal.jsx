// src/pages/UserPortal.jsx
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState, useContext } from "react";
import { AuthContext } from '../components/AuthProvider';

export default function UserPortal() {
  const { auth, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'https://spacelandmark.onrender.com';
  const visitorID = localStorage.getItem('VisitorID');

  useEffect(() => {
    if (!visitorID) {
      setLoading(false);
      return;
    }

    fetch(`${BACKEND_URL}/account-info?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => {
        setUserData(data[0]);
        setFormData(data[0]);
      })
      .catch(err => console.error("Error fetching account info:", err));

    fetch(`${BACKEND_URL}/purchase-history?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => setPurchases(data || []))
      .catch(err => console.error("Error fetching purchase history:", err));

    fetch(`${BACKEND_URL}/ticket-history?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => {
        setTickets(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching ticket history:", err);
        setLoading(false);
      });
  }, []);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    try {
      // Validate form data before sending
      if (formData.FirstName && formData.FirstName.length < 2) {
        alert("First name must be at least 2 characters");
        return;
      }
      if (formData.LastName && formData.LastName.length < 2) {
        alert("Last name must be at least 2 characters");
        return;
      }
      if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
        alert("Please enter a valid email address");
        return;
      }
      if (formData.Phone && !/^\+?[\d\s-]{10,}$/.test(formData.Phone)) {
        alert("Please enter a valid phone number");
        return;
      }
      if (formData.Height && (isNaN(formData.Height) || formData.Height < 50 || formData.Height > 250)) {
        alert("Height must be between 50 and 250 cm");
        return;
      }

      // Parse and validate the date
      let dateToSend = null;
      if (formData.DateOfBirth) {
        // Handle different date formats (MM/DD/YYYY or YYYY-MM-DD)
        const dateStr = formData.DateOfBirth;
        let parsedDate;
        
        if (dateStr.includes('/')) {
          // Convert MM/DD/YYYY to YYYY-MM-DD
          const [month, day, year] = dateStr.split('/');
          parsedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
          parsedDate = dateStr;
        }

        // Validate the date
        const testDate = new Date(parsedDate);
        if (isNaN(testDate.getTime())) {
          alert("Please enter a valid date in MM/DD/YYYY format");
          return;
        }
        dateToSend = parsedDate;
      }

      const adjustedFormData = {
        ...formData,
        DateOfBirth: dateToSend
      };

      const res = await fetch(`${BACKEND_URL}/update-visitor`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          visitorID, 
          ...adjustedFormData,
          // Convert boolean values to 1/0 for MySQL
          MilitaryStatus: adjustedFormData.MilitaryStatus ? 1 : 0,
          AccessibilityNeeds: adjustedFormData.AccessibilityNeeds ? 1 : 0
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Fetch the updated data from the server
        const updatedDataRes = await fetch(`${BACKEND_URL}/account-info?visitorID=${visitorID}`);
        const updatedData = await updatedDataRes.json();
        
        if (updatedData && updatedData[0]) {
          // Format the date properly in the response data
          const formattedData = {
            ...updatedData[0],
            DateOfBirth: updatedData[0].DateOfBirth ? updatedData[0].DateOfBirth.split('T')[0] : null
          };
          setUserData(formattedData);
          setFormData(formattedData);
          setEditMode(false);
          alert("Account info updated successfully!");
        } else {
          alert("Update successful but failed to fetch updated data. Please refresh the page.");
        }
      } else {
        alert(data.error || "Update failed. Please check your input and try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating. Please check the date format (MM/DD/YYYY) and try again.");
    }
  };

  // Format the display date correctly
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const [year, month, day] = dateString.split('T')[0].split('-');
      return new Date(year, month - 1, day).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    } catch (err) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <h2 className="text-4xl font-bold mb-6">🌌 Welcome to Your Portal</h2>
        <p className="text-gray-400 mb-10">View or update your passes, perks, and cosmic stats.</p>

        {loading ? (
          <div className="text-center text-purple-400 text-xl">Loading your data...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Account Info */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold mb-4">👤 Account Info</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                >
                  {editMode ? "Cancel" : "Edit Info"}
                </button>
              </div>
              {editMode ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-purple-300">First Name*</label>
                    <input
                      name="FirstName"
                      type="text"
                      value={formData.FirstName || ""}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 rounded bg-black text-white border border-white/10 focus:ring-2 ring-purple-500"
                      required
                      minLength={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-300">Last Name*</label>
                    <input
                      name="LastName"
                      type="text"
                      value={formData.LastName || ""}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 rounded bg-black text-white border border-white/10 focus:ring-2 ring-purple-500"
                      required
                      minLength={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-300">Email*</label>
                    <input
                      name="Email"
                      type="email"
                      value={formData.Email || ""}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 rounded bg-black text-white border border-white/10 focus:ring-2 ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-300">Phone*</label>
                    <input
                      name="Phone"
                      type="tel"
                      value={formData.Phone || ""}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 rounded bg-black text-white border border-white/10 focus:ring-2 ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-300">Address</label>
                    <input
                      name="Address"
                      type="text"
                      value={formData.Address || ""}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 rounded bg-black text-white border border-white/10 focus:ring-2 ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-300">Date of Birth</label>
                    <input
                      name="DateOfBirth"
                      type="date"
                      value={formData.DateOfBirth || ""}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 rounded bg-black text-white border border-white/10 focus:ring-2 ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-300">Gender</label>
                    <select
                      name="Gender"
                      value={formData.Gender || ""}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 rounded bg-black text-white border border-white/10 focus:ring-2 ring-purple-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-purple-300">Height (cm)</label>
                    <input
                      name="Height"
                      type="number"
                      min="50"
                      max="250"
                      value={formData.Height || ""}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 rounded bg-black text-white border border-white/10 focus:ring-2 ring-purple-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="MilitaryStatus"
                      checked={formData.MilitaryStatus || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, MilitaryStatus: e.target.checked }))}
                      className="rounded bg-black text-purple-500 focus:ring-purple-500"
                    />
                    <label className="text-sm text-purple-300">Military Status</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="AccessibilityNeeds"
                      checked={formData.AccessibilityNeeds || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, AccessibilityNeeds: e.target.checked }))}
                      className="rounded bg-black text-purple-500 focus:ring-purple-500"
                    />
                    <label className="text-sm text-purple-300">Accessibility Needs</label>
                  </div>
                  <button
                    onClick={handleUpdateSubmit}
                    className="col-span-full mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="bg-white/10 p-6 rounded-xl border border-white/10 grid md:grid-cols-2 gap-4 text-gray-300">
                  <p>
                    <span className="text-purple-300 font-semibold">First Name:</span> {userData.FirstName}<br />
                    <span className="text-purple-300 font-semibold">Last Name:</span> {userData.LastName}<br />
                    <span className="text-purple-300 font-semibold">Phone:</span> {userData.Phone}<br />
                    <span className="text-purple-300 font-semibold">Email:</span> {userData.Email}<br />
                    <span className="text-purple-300 font-semibold">Address:</span> {userData.Address}
                  </p>
                  <p>
                    <span className="text-purple-300 font-semibold">Date of Birth:</span> {formatDate(userData.DateOfBirth)}<br />
                    <span className="text-purple-300 font-semibold">Gender:</span> {userData.Gender}<br />
                    <span className="text-purple-300 font-semibold">Height:</span> {userData.Height} cm<br />
                    <span className="text-purple-300 font-semibold">Age:</span> {userData.Age}<br />
                    <span className="text-purple-300 font-semibold">Military Status:</span> {userData.MilitaryStatus ? 'Yes' : 'No'}<br />
                    <span className="text-purple-300 font-semibold">Accessibility Needs:</span> {userData.AccessibilityNeeds ? 'Yes' : 'No'}
                  </p>
                </div>
              )}
            </div>

            {/* Ticket History */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
              <h3 className="text-3xl font-bold mb-4">🎟️ Ticket History</h3>
              {tickets.length > 0 ? (
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-purple-300">
                      <tr>
                        <td>Ticket ID</td>
                        <td>Date</td>
                        <td>Package Details</td>
                        <td>Ticket Price</td>
                        <td>Quantity</td>
                        <td>Meal Plan</td>
                        <td>Total</td>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t, i) => (
                        <tr key={i} className="border-t border-white/10">
                          <td>#{t.ticketID || `TKT-${i+1000}`}</td>
                          <td>{new Date(t.transactionDate).toLocaleDateString()}</td>
                          <td>
                            {t.ticketType} Pass
                            {t.mealPlanName && <span className="block text-xs text-purple-400">+ {t.mealPlanName}</span>}
                          </td>
                          <td>${Number(t.ticketPricePerUnit).toFixed(2)}</td>
                          <td>{t.quantity}</td>
                          <td>
                            {t.mealPlanPrice ? (
                              <>${Number(t.mealPlanPrice).toFixed(2)}</>
                            ) : (
                              <span className="text-gray-500">No meal plan</span>
                            )}
                          </td>
                          <td>${Number(t.grandTotal).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No ticket purchases found.</p>
              )}
            </div>

           {/* Merchandise Purchases */}
           <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
              <h3 className="text-3xl font-bold mb-4">🛍️ Merchandise Purchases</h3>
              {purchases && purchases.length > 0 ? (
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-purple-300">
                      <tr>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Item</th>
                        <th className="text-left p-2">Shop</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-left p-2">Price</th>
                        <th className="text-left p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((tx, idx) => (
                        <tr key={idx} className="border-t border-white/10">
                          <td className="p-2">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                          <td className="p-2">{tx.itemName}</td>
                          <td className="p-2">{tx.giftShopName}</td>
                          <td className="p-2">{tx.quantity}</td>
                          <td className="p-2">${parseFloat(tx.price).toFixed(2)}</td>
                          <td className="p-2">${parseFloat(tx.totalAmount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 p-6 bg-white/10 rounded-xl border border-white/10">No merchandise purchases found.</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              logout();
              window.location.href = "/auth";
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