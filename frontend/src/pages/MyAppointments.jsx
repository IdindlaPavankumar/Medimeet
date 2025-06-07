import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  //  Converts "3_6-2025" → "03 Jun 2025"
 
const formatSlotDate = (slotDateStr) => {
  if (!slotDateStr || typeof slotDateStr !== 'string') {
    return 'Invalid date';
  }
  
  const parts = slotDateStr.split('_'); // ['7', '6', '2025']
  
  if (parts.length !== 3) {
    return 'Invalid date';
  }
  
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // monthIndex (0-based)
  const year = parseInt(parts[2]);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return 'Invalid date';
  }
  
  const date = new Date(year, month, day);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const initpay = (order, appointmentId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
        toast.success("Payment Successful!");
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            appointmentId
          }, { headers: { token } });

          if (data.success) {
            getUserAppointments();
            navigate('/my-appointment');
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment-razorpay`, { appointmentId }, { headers: { token } });
      if (data.success) {
        initpay(data.order, appointmentId);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  const safeParse = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  };

  return (
    <div className="min-h-[80vh] px-6 py-8 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Appointments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.length === 0 && <p>No appointments found.</p>}
        {appointments.map((item, index) => {
          const doc = typeof item.docData === 'string' ? safeParse(item.docData) : item.docData;
          return (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row gap-4">
              <div className="w-24 h-24 overflow-hidden rounded-full border">
                <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{doc.name}</h3>
                <p className="text-blue-600 text-sm">{doc.speciality}</p>
                <p className="mt-3 text-sm font-medium text-gray-600">Address:</p>
                <p className="text-sm text-gray-700">{doc.address?.line1}</p>
                <p className="text-sm text-gray-700">{doc.address?.line2}</p>
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-semibold">Date & Time:</span>{' '}
                  {formatSlotDate(item.slotDate)} | {item.slotTime}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!item.cancelled && item.payment && !item.isCompleted && (
                    <button className="px-4 py-2 bg-orange-500 text-white rounded text-sm">Paid</button>
                  )}
                  {!item.cancelled && !item.payment && !item.isCompleted && (
                    <button onClick={() => appointmentRazorpay(item._id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm">
                      Pay Online
                    </button>
                  )}
                  {!item.cancelled && !item.isCompleted && (
                    <button onClick={() => cancelAppointment(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
                      Cancel
                    </button>
                  )}
                  {item.cancelled && !item.isCompleted && (
                    <button className="py-2 px-4 border border-red-500 text-red-500 rounded text-sm">Appointment Cancelled</button>
                  )}
                  {item.isCompleted && (
                    <button className="py-2 px-4 border border-green-500 text-green-500 rounded text-sm">Completed</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;
