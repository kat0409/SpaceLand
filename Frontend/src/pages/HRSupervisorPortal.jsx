import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function HRSupervisorPortal() {
    const [employees, setEmployees] = useState([]);
    const [visitorRecords, setVisitorRecords] = useState([]);
    const [attendanceAndRevenueReport, setAttendanceAndRevenueReport] = useState([]);

    const supervisorID = localStorage.getItem('supervisorID');

    useEffect (() => {
        fetch(`${BACKEND_URL}/supervisor/HR/`)
    }, []);
}