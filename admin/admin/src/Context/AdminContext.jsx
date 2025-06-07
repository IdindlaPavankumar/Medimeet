import { createContext, useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const [aToken, setATokenState] = useState(localStorage.getItem("aToken") || '');
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState([false])

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/all-doctors',
                {},
                { headers: { aToken } }
            );
            console.log("Doctors Response Data:", data); // Add this
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Error fetching doctors:", error);
        }
    }
    //  This function handles both state and localStorage
    const setAToken = (token) => {
        setATokenState(token);
        if (token) {
            localStorage.setItem("aToken", token);
        } else {
            localStorage.removeItem("aToken");
        }
    };

    //  Safe backend URL handling
    const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || '';
    const backendUrl = rawBackendUrl.endsWith('/')
        ? rawBackendUrl.slice(0, -1)
        : rawBackendUrl;

    console.log("Backend URL:", backendUrl);

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    // cancel the appointment function

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }
    // dashboard function
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    const value = {
        aToken,
        setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments, getAllAppointments,
        cancelAppointment, dashData, setDashData,
        getDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
