import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

const [rideMaintenanceReport, setRideMaintenanceReport] = useState([]);

const supervisorID = localStorage.getItem('supervisorID');

