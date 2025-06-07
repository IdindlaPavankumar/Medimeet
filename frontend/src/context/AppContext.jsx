// AppContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '₹';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [userData, setUserData] = useState(null);

    // Load list of doctors
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    // Load user profile with token
    const loadUserProfileData = async () => {
        try {
            const testToken = "YOUR_WORKING_POSTMAN_TOKEN_HERE";
            console.log('Loading user profile...');
            console.log('Token being sent:', token);
            console.log('Full URL:', backendUrl + '/api/user/get-profile');
            console.log('Backend URL from env:', import.meta.env.VITE_BACKEND_URL);

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
            console.log('Profile API Response:', data);

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Profile API Error:', error);
            if (error.response?.status === 401) {
                setToken(null);
                localStorage.removeItem('token');
                toast.error('Session expired. Please login again.');
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    // Sync token with localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            loadUserProfileData();
        } else {
            localStorage.removeItem('token');
            setUserData(null);
        }
    }, [token]);

    useEffect(() => {
        getDoctorsData();
    }, []);

    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
