// src/pages/UserPortal.jsx
import Header from '../components/Header';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import {useState} from "react";

export default function UserPortal() {
  const [activeTab, setActiveTab] = useState("userInfo");
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userInfo, setUserInfo] = useState
  (
    {
      VisitorID: null,
      FirstName: "",
      LastName: "",
      Phone: "",
      Email: "",
      Address: "",
      DateOfBirth: "",
      AccessibilityNeeds: "",
      Gender: "",
      Username: "",
      Password: "",
      Height: "", 
      Age: "",
      MilitaryStatus: ""
    }
  );

  const handleUserInfoClick = async (e) => {
    // setError('');
    // setSuccessMessage('');
    console.log("HERE");

    try {
      //const res = await fetch(`http://localhost:3000/add-visitor`, {//CHANGE MADE:KEVIN
      const res = await fetch(`http://localhost:3000/portal/userinfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      const data = await res.json();

      console.log("Here's the retrieved data:\n", data);

      // if (res.ok && data.visitorID) {
      //   localStorage.setItem("visitorID", data.visitorID);
      //   setSuccessMessage("Login successful!");
      //   setTimeout(() => (window.location.href = "/portal"), 1000);
      // } else {
      //   setError(data.error || "Invalid credentials.");
      // }
    } catch (err) {
      console.error("Retrieval error:", err);
      setError("Retrieval failed. Please try again later.");
    }
  };

  return (
    <>
      <HeaderLoggedIn />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <p className="text-4xl font-bold mb-6 text-center">🌌 Welcome to Your Portal</p>
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => {handleUserInfoClick(); setActiveTab('userInfo'); }} className={`px-6 py-2 font-semibold rounded-full ${activeTab === 'userInfo' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            User Info
          </button>
          <button onClick={() => setActiveTab('pastPurchases')} className={`px-6 py-2 font-semibold rounded-full ${activeTab === 'pastPurchases' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            Past Purchases
          </button>
        </div>

        {/*User Info*/}
        {activeTab === 'userInfo' && (
          <p className="text-2xl font-bold mb-4 text-center">User Info</p>
      )}

      {/*Past Purchases*/}
      {activeTab === 'pastPurchases' && (
        <h3 className="text-2xl font-bold mb-4">Past Purchases</h3>
      )}
      </section>
      <Footer />
    </>
  );
}