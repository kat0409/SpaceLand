// src/pages/Auth.jsx
import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaTransgender, FaArrowUp, FaUserShield } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Auth() {
  const [activeTab, setActiveTab] = useState('signup');
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    accessibilityNeeds: false,
    gender: '',
    username: '',
    password: '',
    height: '',
    age: '',
    militaryStatus: false,
  });

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const inputClass =
    'w-full p-2 rounded-md bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring focus:ring-purple-500';

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Form Data:', signupData);

    // Backend integration example (assuming /addVisitor endpoint exists)
    fetch('http://localhost:3001/addVisitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Signup response:', data);
        alert('Signup submitted successfully!');
      })
      .catch((err) => {
        console.error(err);
        alert('Error submitting signup.');
      });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login Credentials:', loginData);
    alert('Login submitted!');
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('signup')}
              className={`px-6 py-2 font-semibold rounded-full transition ${
                activeTab === 'signup'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`px-6 py-2 font-semibold rounded-full transition ${
                activeTab === 'login'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Login
            </button>
          </div>

          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="bg-white/10 p-6 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaUserShield /> Create Account
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="firstName" placeholder="First Name" value={signupData.firstName} onChange={handleSignupChange} className={inputClass} required />
                <input type="text" name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={handleSignupChange} className={inputClass} required />
                <input type="tel" name="phone" placeholder="Phone" value={signupData.phone} onChange={handleSignupChange} className={inputClass} />
                <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} className={inputClass} required />
                <input type="text" name="address" placeholder="Address" value={signupData.address} onChange={handleSignupChange} className={inputClass} />
                <input type="date" name="dateOfBirth" value={signupData.dateOfBirth} onChange={handleSignupChange} className={inputClass} />
                <input type="number" name="height" placeholder="Height (cm)" value={signupData.height} onChange={handleSignupChange} className={inputClass} />
                <input type="number" name="age" placeholder="Age" value={signupData.age} onChange={handleSignupChange} className={inputClass} />
                <select name="gender" value={signupData.gender} onChange={handleSignupChange} className={inputClass}>
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <input type="text" name="username" placeholder="Username" value={signupData.username} onChange={handleSignupChange} className={inputClass} required />
                <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} className={inputClass} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="accessibilityNeeds" checked={signupData.accessibilityNeeds} onChange={handleSignupChange} />
                  Accessibility Needs
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="militaryStatus" checked={signupData.militaryStatus} onChange={handleSignupChange} />
                  Military Status
                </label>
              </div>

              <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-600 transition">
                Sign Up
              </button>
            </form>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="bg-white/10 p-6 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaLock /> Login
              </h3>
              <div className="space-y-4">
                <input type="text" name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange} className={inputClass} required />
                <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} className={inputClass} required />
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-600 transition">
                Login
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}