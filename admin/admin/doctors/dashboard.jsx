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
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-4">
        {/* Doctors Card */}
        <div className="bg-white p-8 hover:bg-blue-500 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 flex items-center gap-6 min-h-[100px]">
          <img src={assets.doctor_icon} alt="Doctors" className="w-20 h-20" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">Doctors</h2>
            <p className="text-4xl font-extrabold text-blue-600">{dashData.doctors || 0}</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="bg-white p-8 hover:bg-blue-500 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 flex items-center gap-6 min-h-[100px]">
          <img src={assets.appointment_icon} alt="Appointments" className="w-20 h-20" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">Appointments</h2>
            <p className="text-4xl font-extrabold text-green-600">{dashData.appointments || 0}</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className="bg-white p-8 hover:bg-blue-500 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 flex items-center gap-6 min-h-[100px]">
          <img src={assets.patients_icon} alt="Patients" className="w-20 h-20" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">Patients</h2>
            <p className="text-4xl font-extrabold text-purple-600">{dashData.patients || 0}</p>
          </div>
        </div>
      </div>

      {/* Latest Appointments Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <img src={assets.list_icon} alt="List" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Latest Appointments</h2>
        </div>

        <div className="space-y-4">
          {dashData.latestAppointments?.map((item, index) => {
            const doc = JSON.parse(item.docData);

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
              >
                {/* Doctor Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Dr. {doc.name}</p>
                    <p className="text-sm text-gray-500">
                      Booking on{' '}
                      {new Date(item.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
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
                    className="w-6 h-6 cursor-pointer hover:scale-110 transition"
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
