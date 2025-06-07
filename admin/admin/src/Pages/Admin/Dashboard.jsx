import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../Context/AdminContext';
import { assets } from '../../assets/assets';

const Dashboard = () => {
  const { aToken, getDashData, dashData, cancelAppointment } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto mt-2 sm:mt-4">
        {/* Card Template */}
        {[
          {
            title: 'Doctors',
            count: dashData.doctors || 0,
            color: 'text-blue-600',
            icon: assets.doctor_icon,
          },
          {
            title: 'Appointments',
            count: dashData.appointments || 0,
            color: 'text-green-600',
            icon: assets.appointment_icon,
          },
          {
            title: 'Patients',
            count: dashData.patients || 0,
            color: 'text-purple-600',
            icon: assets.patients_icon,
          },
        ].map(({ title, count, color, icon }, idx) => (
          <div
            key={idx}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4 sm:gap-6"
          >
            <img src={icon} alt={title} className="w-14 h-14 sm:w-20 sm:h-20" />
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">{title}</h2>
              <p className={`text-3xl sm:text-4xl font-extrabold ${color}`}>{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mt-8 sm:mt-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <img src={assets.list_icon} alt="List" className="w-6 h-6" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Latest Appointments</h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {dashData.latestAppointments?.map((item, index) => {
            const doc = JSON.parse(item.docData);

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
              >
                {/* Doctor Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">Dr. {doc.name}</p>
                    <p className="text-sm text-gray-500">
                      Booking on{' '}
                      {new Date(item.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Cancel Icon or Status */}
                {item.cancelled ? (
                  <p className="text-sm text-red-500 font-medium">Cancelled</p>
                ) : (
                  <img
                    src={assets.cancel_icon}
                    alt="Cancel"
                    onClick={() => cancelAppointment(item._id)}
                    className="w-7 h-7 sm:w-6 sm:h-6 cursor-pointer hover:scale-110 transition"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
