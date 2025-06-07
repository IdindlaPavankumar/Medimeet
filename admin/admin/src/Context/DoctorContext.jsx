import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
export const DoctorContext = createContext()


const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    //  get appointments function
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // appointment complete function

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + "/api/doctor/complete-appointment", { appointmentId }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message || "Appointment Completed!")
                getAppointments()
                console.log(data)

            } else {
                toast.error(error.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    // cancel the appointment function
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                console.log(data)
            } else {
                toast.error(error.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    // dashboard get overall data  function
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(error.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    // getProfile data function
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments,
        getAppointments,
        completeAppointment, cancelAppointment,
        dashData, setDashData, getDashData,
        profileData, setProfileData, getProfileData,
    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider;
