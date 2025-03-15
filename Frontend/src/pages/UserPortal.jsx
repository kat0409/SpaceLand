// src/pages/UserPortal.jsx
import Header from '../components/Header';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import {useState} from "react";

//this function is based on Mark's Auth function in "Frontend\src\pages\Auth.jsx".
export default function UserPortal() {
  const [activeTab, setActiveTab] = useState("userInfo");
  // const [error, setError] = useState('');
  // const [successMessage, setSuccessMessage] = useState('');
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
  const sentData = {visitorID: localStorage.getItem("visitorID")};

  const handleUserInfoClick = async (e) => {
    setError('');
    setSuccessMessage('');

    console.log(sentData);
    try {
      let res = await fetch
      (
        `http://localhost:3000/portal/userinfo`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sentData)
        }
      );
      console.log("status is " + res.status);

      let tempOutput = await res.json();
      console.log(tempOutput);

      setUserInfo
      (
        {
          VisitorID: tempOutput.VisitorID,
          FirstName: tempOutput.FirstName,
          LastName: tempOutput.LastName,
          Phone: tempOutput.Phone,
          Email: tempOutput.Email,
          Address: tempOutput.Address,
          DateOfBirth: tempOutput.DateOfBirth,
          AccessibilityNeeds: tempOutput.AccessibilityNeeds,
          Gender: tempOutput.Gender,
          Username: tempOutput.Username,
          Password: tempOutput.Password,
          Height: tempOutput.Height, 
          Age: tempOutput.Age,
          MilitaryStatus: tempOutput.MilitaryStatus
        }
      )

      // return tempOutput;

    } 
    catch (err) 
    {
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
          <div>
            <p className="text-2xl font-bold mb-4 text-center">User Info</p>
            <p>{userInfo.AccessibilityNeeds}</p>
            <p>{userInfo.Address}</p>
            <p>{userInfo.Age}</p>
            <p>{userInfo.DateOfBirth}</p>
            <p>{userInfo.Email}</p>
            <p>{userInfo.FirstName}</p>
            <p>{userInfo.Gender}</p>
            <p>{userInfo.Height}</p>
            <p>{userInfo.LastName}</p>
            <p>{userInfo.MilitaryStatus}</p>
            <p>{userInfo.Password}</p>
            <p>{userInfo.Phone}</p>
            <p>{userInfo.Username}</p>
            <p>{userInfo.VisitorID}</p>
          </div>
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