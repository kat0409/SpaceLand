// src/pages/UserPortal.jsx
import Header from '../components/Header';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import {useState} from "react";
import {useEffect} from "react";
 
//this function is based on Mark's Auth function in "Frontend\src\pages\Auth.jsx".
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
  const sentData = {visitorID: localStorage.getItem("visitorID")};

  useEffect(() => 
    {
      async function fetchData()
      {
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
          //console.log("status is " + res.status);

          let tempOutput = await res.json();
          console.log(tempOutput);
          //console.log(tempOutput);

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
          );
        } 
        catch (err) 
        {
          console.error("Retrieval error:", err);
          setError("Retrieval failed. Please try again later.");
        }
      }
      fetchData();
    },
    []
  );

  return (
    <>
      <HeaderLoggedIn/>
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <p className="text-4xl font-bold mb-6 text-center">🌌 Welcome to Your Portal</p>
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => {setActiveTab('userInfo');}} className={`px-6 py-2 font-semibold rounded-full ${activeTab === 'userInfo' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            User Info
          </button>
          <button onClick={() => setActiveTab('pastPurchases')} className={`px-6 py-2 font-semibold rounded-full ${activeTab === 'pastPurchases' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            Past Purchases
          </button>
        </div>

        {/*User Info*/}
        {activeTab === 'userInfo' && (
          // typescript from Mark (Frontend\src\pages\SupervisorPortal.jsx)
          <div>
            <h1 className="text-2xl font-bold p-4">Personal Information</h1>
            <div className="grid grid-cols-3 gap-4 border border-gray-700 p-4 rounded-lg bg-white/5">
              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>First Name: </strong>{userInfo.FirstName}</p>
              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Last Name: </strong>{userInfo.LastName}</p>
              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Age: </strong>{userInfo.Age}</p>

              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Date of Birth: </strong>{userInfo.DateOfBirth}</p>
              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Gender: </strong>{userInfo.Gender}</p>
              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Height: </strong>{userInfo.Height}</p>

              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Address: </strong>{userInfo.Address}</p>
              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Phone: </strong>{userInfo.Phone}</p>
            </div>
            <h1 className="text-2xl font-bold p-4">Park-related Information</h1>
            <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded-lg bg-white/5">
              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Username: </strong>{userInfo.Username}</p>
              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Visitor ID: </strong>{userInfo.VisitorID}</p>

              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Accessibility Needs: </strong>{userInfo.AccessibilityNeeds ? "Yes" : "No"}</p>
              <p className="border border-gray-700 p-4 rounded-lg bg-white/5"><strong>Military Status: </strong>{userInfo.MilitaryStatus  ? "Yes" : "No"}</p>
            </div>
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