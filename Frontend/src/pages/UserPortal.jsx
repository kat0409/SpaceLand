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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';
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
      const updateData = {
        visitorID,
        FirstName: formData.FirstName,
        LastName: formData.LastName
      };

      const res = await fetch(`${BACKEND_URL}/update-visitor`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Name updated successfully!");
        setUserData(prev => ({
          ...prev,
          FirstName: formData.FirstName,
          LastName: formData.LastName
        }));
        setEditMode(false);
      } else {
        alert(data.error || "Update failed.");
      }
    } catch (err) {
      console.error("Update error", err);
      alert("An error occurred.");
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
                  {["FirstName", "LastName"].map(field => (
                    <div key={field}>
                      <label className="text-sm text-purple-300">{field}:</label>
                      <input
                        name={field}
                        type="text"
                        value={formData[field] || ""}
                        onChange={handleUpdateChange}
                        className="w-full px-3 py-2 rounded bg-black text-white border border-white/10 focus:ring-2 ring-purple-500"
                      />
                    </div>
                  ))}
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
                    <span className="text-purple-300 font-semibold">Date of Birth:</span> {userData.DateOfBirth}<br />
                    <span className="text-purple-300 font-semibold">Gender:</span> {userData.Gender}<br />
                    <span className="text-purple-300 font-semibold">Height:</span> {userData.Height} cm<br />
                    <span className="text-purple-300 font-semibold">Age:</span> {userData.Age}<br />
                    <span className="text-purple-300 font-semibold">Military Status:</span> {userData.MilitaryStatus ? 'Yes' : 'No'}<br />
                    <span className="text-purple-300 font-semibold">Accessibility Needs:</span> {userData.AccessibilityNeeds ? 'Yes' : 'No'}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
              <h3 className="text-3xl font-bold mb-4">🎟️ Ticket History</h3>
              {tickets.length > 0 ? (
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-purple-300">
                      <tr>
                        <th>Date</th><th>Ticket Type</th><th>Quantity</th><th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t, i) => (
                        <tr key={i} className="border-t border-white/10">
                          <td>{new Date(t.transactionDate).toLocaleDateString()}</td>
                          <td>{t.ticketType}</td>
                          <td>{t.quantity}</td>
                          <td>${parseFloat(t.totalAmount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No ticket purchases found.</p>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
              <h3 className="text-3xl font-bold mb-4">🛍️ Merchandise Purchases</h3>
              {purchases.length > 0 ? (
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-purple-300">
                      <tr>
                        <th>Date</th><th>Item</th><th>Shop</th><th>Quantity</th><th>Price</th><th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((p, i) => (
                        <tr key={i} className="border-t border-white/10">
                          <td>{new Date(p.transactionDate).toLocaleDateString()}</td>
                          <td>{p.itemName}</td>
                          <td>{p.giftShopName}</td>
                          <td>{p.quantity}</td>
                          <td>${parseFloat(p.price).toFixed(2)}</td>
                          <td>${parseFloat(p.totalAmount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No merchandise purchases found.</p>
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
