import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Auth() {
  const [activeTab, setActiveTab] = useState('signup');
  const [signupData, setSignupData] = useState({
    firstName: '', lastName: '', phone: '', email: '', address: '',
    dateOfBirth: '', accessibilityNeeds: false, gender: '',
    username: '', password: '', height: '', age: '', militaryStatus: false,
  });

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Optional: use .env for backend URL
  //const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://spaceland.onrender.com";
  const BACKEND_URL = "https://spaceland.onrender.com"; // Change this if backend is deployed

  console.log(BACKEND_URL);

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const payload = {
      FirstName: signupData.firstName,
      LastName: signupData.lastName,
      Phone: signupData.phone || null,
      Email: signupData.email,
      Address: signupData.address || null,
      DateOfBirth: signupData.dateOfBirth,
      AccessibilityNeeds: signupData.accessibilityNeeds ? 1 : 0,
      Gender: signupData.gender || null,
      Username: signupData.username,
      Password: signupData.password,
      Height: signupData.height || null,
      Age: signupData.age || null,
      MilitaryStatus: signupData.militaryStatus ? 1 : 0,
    };

    try {
      const res = await fetch(`https://spaceland.onrender.com`, {
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch(`${BACKEND_URL}/login-visitor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok && data.visitorID) {
        localStorage.setItem("visitorID", data.visitorID);
        setSuccessMessage("Login successful!");
        setTimeout(() => (window.location.href = "/portal"), 1000);
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again later.");
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <div className="max-w-3xl mx-auto">
          {/* 🔁 Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button onClick={() => setActiveTab('signup')} className={`px-6 py-2 font-semibold rounded-full ${activeTab === 'signup' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Sign Up</button>
            <button onClick={() => setActiveTab('login')} className={`px-6 py-2 font-semibold rounded-full ${activeTab === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Login</button>
          </div>

          {/* 📝 Signup Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="bg-white/10 p-6 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-2xl font-bold mb-4">🪐 Create Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name" value={signupData.firstName} onChange={handleSignupChange} className="input" required />
                <input name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={handleSignupChange} className="input" required />
                <input name="phone" placeholder="Phone" value={signupData.phone} onChange={handleSignupChange} className="input" />
                <input name="email" type="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} className="input" required />
                <input name="address" placeholder="Address" value={signupData.address} onChange={handleSignupChange} className="input" />
                <input name="dateOfBirth" type="date" value={signupData.dateOfBirth} onChange={handleSignupChange} className="input" required />
                <input name="height" type="number" placeholder="Height (cm)" value={signupData.height} onChange={handleSignupChange} className="input" />
                <input name="age" type="number" placeholder="Age" value={signupData.age} onChange={handleSignupChange} className="input" />
                <select name="gender" value={signupData.gender} onChange={handleSignupChange} className="input">
                  <option value="">Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <input name="username" placeholder="Username" value={signupData.username} onChange={handleSignupChange} className="input" required />
                <input name="password" type="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} className="input" required />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="accessibilityNeeds" checked={signupData.accessibilityNeeds} onChange={handleSignupChange} />
                  Accessibility
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="militaryStatus" checked={signupData.militaryStatus} onChange={handleSignupChange} />
                  Military Status
                </label>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg text-white font-bold hover:from-purple-700 hover:to-indigo-600">Sign Up</button>
            </form>
          )}

          {/* 🔐 Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="bg-white/10 p-6 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-2xl font-bold mb-4">🔐 Login</h3>
              <input name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange} className="input" required />
              <input name="password" type="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} className="input" required />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-600">Login</button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
///visitor login might not work anymore because we added these redundant functions
const registerVisitor = async (visitorData) => {
  try {
    const response = await fetch('https://spaceland.onrender.com/add-visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(visitorData)
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Registration Successful:', data);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

const loginVisitor = async (username, password) => {
  try {
    const response = await fetch('https://spaceland.onrender.com/login-visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Login Successful:', data);
      localStorage.setItem('visitorID', data.visitorID); // Save session
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

