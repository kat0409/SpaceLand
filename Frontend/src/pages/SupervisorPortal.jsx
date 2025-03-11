import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SupervisorPortal() {
  const [supervisorData, setSupervisorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const supervisorID = localStorage.getItem('supervisorID'); // ← You must store this during login

  useEffect(() => {
    const fetchSupervisorInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/supervisor-info?supervisorID=${supervisorID}`);
        const data = await response.json();
        setSupervisorData(data);
      } catch (error) {
        console.error('Error fetching supervisor info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (supervisorID) {
      fetchSupervisorInfo();
    } else {
      setLoading(false);
    }
  }, [supervisorID]);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">🛰 Supervisor Dashboard</h2>

          {loading ? (
            <p className="text-gray-400">Loading supervisor data...</p>
          ) : !supervisorData ? (
            <p className="text-red-500">No supervisor info found.</p>
          ) : (
            <div className="bg-white/10 p-6 rounded-2xl border border-white/10 space-y-4">
              <p><strong>Supervisor ID:</strong> {supervisorData.SupervisorID}</p>
              <p><strong>Name:</strong> {supervisorData.firstName} {supervisorData.lastName}</p>
              <p><strong>Email:</strong> {supervisorData.email}</p>
              <p><strong>Department:</strong> {supervisorData.departmentName}</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}