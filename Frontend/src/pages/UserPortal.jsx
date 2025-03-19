// src/pages/UserPortal.jsx
import Header from '../components/Header';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import {useState} from "react";
import {useEffect} from "react";
 
//this function is based on Mark's Auth function in "Frontend\src\pages\Auth.jsx".
export default function UserPortal() {

  const [activeTab, setActiveTab] = useState("userInfo");
  const [editFormActive, setEditFormActive] = useState(false);
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
  const [pastPurchasesState, setPastPurchasesState] = useState(null);
  const [editData, setEditData] = useState({
    firstName: '', lastName: '', phone: '', email: '', address: '',
    dateOfBirth: '', accessibilityNeeds: false, gender: '',
    username: '', password: '', height: '', age: '', militaryStatus: false,
  });

  //this object is meant to emulate what the purchaseObject should return
  let testPastPurchaseObject = 
  [
    {
      transactionID: 1,
      ticketID: 123,
      VisitorID: 125,
      transactionDate: "July 25, 2024",
      quantity: 2,
      totalAmount: 45
    },
    {
      transactionID: 2,
      ticketID: 3,
      VisitorID: 15,
      transactionDate: "August 19, 2025",
      quantity: 2,
      totalAmount: 45
    },
    {
      transactionID: 3,
      ticketID: 3,
      VisitorID: 5,
      transactionDate: "September 3, 2024",
      quantity: 5,
      totalAmount: 45
    }
  ];

  const sentData = {visitorID: localStorage.getItem("visitorID")};

  //for when the page loads
  useEffect(() => 
    {
      async function fetchVisitorData()
      {
        setError('');
        setSuccessMessage('');

        //console.log(sentData);
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

      //past purchases will be retrieved from the server here
      // async function fetchPurchaseData()
      // {
      //   setError('');
      //   setSuccessMessage('');

      //   console.log(sentData);
      //   try {
      //     let res = await fetch
      //     (
      //       `http://localhost:3000/portal/userinfo`, //UPDATE TO ROUTE
      //       {
      //         method: "POST",
      //         headers: { "Content-Type": "application/json" },
      //         body: JSON.stringify(sentData)
      //       }
      //     );
      //     console.log("status is " + res.status);

      //     let tempOutput = await res.json();
      //     console.log(tempOutput);
      //   } 
      //   catch (err) 
      //   {
      //     console.error("Retrieval error:", err);
      //     setError("Retrieval failed. Please try again later.");
      //   }
      // }
      
      setPastPurchasesState(testPastPurchaseObject);//CHANGE TO tempOutput
      fetchVisitorData();
    },
    []
  
  
  
  );

  //the following two functions will assist with making edits to the personal information
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const payload = {
      FirstName: editData.firstName,
      LastName: editData.lastName,
      Phone: editData.phone || null,
      Email: editData.email,
      Address: editData.address || null,
      DateOfBirth: editData.dateOfBirth,
      AccessibilityNeeds: editData.accessibilityNeeds ? 1 : 0,
      Gender: editData.gender || null,
      Username: editData.username,
      Password: editData.password,
      Height: editData.height || null,
      Age: editData.age || null,
      MilitaryStatus: editData.militaryStatus ? 1 : 0,
    };
    try {
      const res = await fetch(`http://localhost:3000/add-visitor`, {//CHANGE MADE:KEVIN
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Signup Response:", data);

      if (res.ok) {
        localStorage.setItem("visitorID", data.VisitorID || data.visitorID);
        setSuccessMessage("Signup successful!");
        setTimeout(() => (window.location.href = "/portal"), 1500);
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Signup failed. Please check your internet connection or try again later.");
    }
  };

  let arrOfPurchases = [];
  //testPastPurchaseObject should be replaced with the actually received object
  // for (let curr of testPastPurchaseObject)
  // {
  //   let testObject = 
  //   {
  //     transactionID: curr.transactionID,
  //     ticketID: curr.ticketID,
  //     VisitorID: curr.VisitorID,
  //     transactionDate: curr.transactionDate,
  //     quantity: curr.quantity,
  //     totalAmount: curr.totalAmount
  //   }
  //   arrOfPurchases.push
  //   (
  //     testObject
  //   );
  // }
  //console.log(testPastPurchaseObject[0]);
  // console.log(pastPurchasesState);
  // setPastPurchasesState
  // (
  //   (previous) =>
  //   {
  //     return {previous};
  //   }
  // );

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
        {activeTab === 'userInfo' && (!editFormActive) && (
          // typescript from Mark (Frontend\src\pages\SupervisorPortal.jsx)
          <div>
            {/*the button is based on the tab buttons on this page, which were from the auth file*/}
            <button
            className="px-6 py-2 font-semibold rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
            onClick={() => setEditFormActive(true)}
            >
              Edit
            </button>
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

        {(activeTab === 'userInfo') && (editFormActive) && 
        (
          //the following form is based on the signup form in "Frontend\src\pages\Auth.jsx"
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 space-y-6">
            <h3 className="text-2xl font-bold mb-4">Edit User Information</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="firstName" placeholder={"First Name: " + userInfo.FirstName} value={editData.firstName} onChange={handleEditChange} className="input" required />
                <input name="lastName" placeholder={"Last Name: " + userInfo.LastName} value={editData.lastName} onChange={handleEditChange} className="input" required />
                <input name="phone" placeholder={"Phone Number: " + userInfo.Phone} value={editData.phone} onChange={handleEditChange} className="input" />
                <input name="email" type="email" placeholder={"Email: " + userInfo.Email} value={editData.email} onChange={handleEditChange} className="input" required />
                <input name="address" placeholder={"Address: " + userInfo.Address} value={editData.address} onChange={handleEditChange} className="input" />
                <input name="dateOfBirth" type="date" placeholder={"Date of Birth: " + userInfo.DateOfBirth} value={editData.dateOfBirth} onChange={handleEditChange} className="input" required />
                <input name="height" type="number" placeholder={"Height: " + userInfo.Height + " cm"} value={editData.height} onChange={handleEditChange} className="input" />
                <input name="age" type="number" placeholder={"Age: " + userInfo.Age} value={editData.age} onChange={handleEditChange} className="input" />
                <select name="gender" value={editData.gender} onChange={handleEditChange} className="input">
                  <option value="">{"Gender: " + userInfo.Gender}</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <input name="username" placeholder={"Username: " + userInfo.Username} value={editData.username} onChange={handleEditChange} className="input" required />
                <input name="password" type="password" placeholder="Password" value={editData.password} onChange={handleEditChange} className="input" required />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="accessibilityNeeds" checked={editData.accessibilityNeeds} onChange={handleEditChange} />
                  Accessibility
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="militaryStatus" checked={editData.militaryStatus} onChange={handleEditChange} />
                  Military Status
                </label>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}
              <div className="grid grid-cols-2">
                <button
                className="col-span-2 px-6 py-2 font-semibold rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
                onClick={() => setEditFormActive(false)}
                >
                  Cancel
                </button>
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg text-white font-bold hover:from-purple-700 hover:to-indigo-600">Submit Edits</button>
            </form>
          </div>
        )
      }


      {/*Past Purchases*/}
      {activeTab === 'pastPurchases' && (
        <div>
          <div className="gap-4 border border-gray-700 p-4 rounded-lg bg-white/5">
            <div className="grid grid-cols-5 border border-gray-700 rounded-lg bg-white/5">
              <p className="border border-gray-700 rounded-lg bg-white/5"><strong>Ticket ID</strong></p>
              <p className="border border-gray-700 rounded-lg bg-white/5"><strong>Visitor ID</strong></p>
              <p className="border border-gray-700 rounded-lg bg-white/5"><strong>Transaction Date</strong></p>
              <p className="border border-gray-700 rounded-lg bg-white/5"><strong>Quantity</strong></p>
              <p className="border border-gray-700 rounded-lg bg-white/5"><strong>Total Amount</strong></p>
            </div>
            {pastPurchasesState.map
              ((purchase) => 
                (
                  <div key={purchase.transactionID} className="grid grid-cols-5 border border-gray-700 rounded-lg bg-white/5">
                    <p className="border border-gray-700 rounded-lg bg-white/5">{purchase.ticketID}</p>
                    <p className="border border-gray-700 rounded-lg bg-white/5">{purchase.VisitorID}</p>
                    <p className="border border-gray-700 rounded-lg bg-white/5">{purchase.transactionDate}</p>
                    <p className="border border-gray-700 rounded-lg bg-white/5">{purchase.quantity}</p>
                    <p className="border border-gray-700 rounded-lg bg-white/5">{purchase.totalAmount}</p>
                  </div>
                )
              )
            }
          </div>
        </div>
      )}
      </section>
      <Footer />
    </>
  );
}