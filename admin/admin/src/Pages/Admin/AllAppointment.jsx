import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../Context/AdminContext';

const AllAppointment = () => {
  const { aToken, appointments, getAllAppointments } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl mx-auto ">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Appointments</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full min-w-[768px]">
          <thead className="bg-gray-100 text-sm text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Date & Time</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Fees</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {appointments.map((item, index) => {
              const user = typeof item.userData === 'string' ? JSON.parse(item.userData) : item.userData;
              const doctor = typeof item.docData === 'string' ? JSON.parse(item.docData) : item.docData;
              const age = user?.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 'N/A';

              const statusColor = item.cancelled
                ? 'bg-red-100 text-red-600'
                : item.completed
                  ? 'bg-blue-100 text-blue-600'
                  : item.payment
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600';

              const statusText = item.cancelled
                ? 'Cancelled'
                : item.completed
                  ? 'Completed'
                  : item.payment
                    ? 'Paid'
                    : 'Pending';

              return (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={user?.image}
                      onError={(e) => (e.target.src = '/default-user.png')}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span>{user?.name}</span>
                  </td>

                  <td className="px-4 py-3">{age}</td>
                  <td className="px-4 py-3">{item.slotDate.replace(/_/g, '/')} at {item.slotTime}</td>

                  <td className="px-4 py-3">
                    <p className="font-medium">{doctor?.name?.replace(/^'+|'+$/g, '')}</p>
                    <p className="text-xs text-gray-500">{doctor?.speciality}</p>
                  </td>

                  <td className="px-4 py-3 font-medium">₹{item.amount}</td>

                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}>
                      {statusText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {appointments.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointment;
