import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../Context/DoctorContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'



const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  console.log(dToken)
  console.log(appointments)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  // const calculateAge = (dob) => {
  //   if (!dob) return 'N/A';
  //   const birthDate = new Date(dob);
  //   if (isNaN(birthDate)) return 'N/A'; // Invalid date check

  //   const today = new Date();
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const m = today.getMonth() - birthDate.getMonth();
  //   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age;
  // };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
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
              const age = user?.dob && user.dob !== 'Not Selected'
                ? new Date().getFullYear() - new Date(user.dob).getFullYear()
                : 'N/A';

              // console.log(age)
              console.log("User DOB:", user?.dob);


              // const statusColor = item.cancelled
              //   ? 'bg-red-100 text-red-600'
              //   : item.payment
              //     ? 'bg-green-100 text-green-600'
              //     : 'bg-yellow-100 text-yellow-600';

              // const statusText = item.cancelled
              //   ? 'Cancelled'
              //   : item.payment
              //     ? 'Paid'
              //     : 'Pending';

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
                  <td className="px-4 py-3">{item.slotDate.replace(/_/g, '-')} at {item.slotTime}</td>

                  <td className="px-4 py-3">
                    <div className=' flex items-center gap-3'>
                      <img src={doctor?.image} alt={doctor?.name} onError={(e) => (e.target.src = '/default-user.png')} className=" w-10 h-10  rounded-full object-cover border" />
                      <p className="font-medium ">{doctor?.name?.replace(/^'+|'+$/g, '')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 text-center">{doctor?.speciality}</p>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium">₹{item.amount}</td>

                  <td className="px-4 py-3">
                    {/* <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}>
                          {statusText}
                        </span> */}
                    {item.cancelled ? (
                      <p className="text-red-500 text-sm font-medium">Cancelled</p>
                    ) : item.isCompleted ? (
                      <p className="text-green-600 text-sm font-medium">Completed</p>
                    ) : (
                      <div className="flex gap-3 items-center">
                        <img
                          onClick={() => cancelAppointment(item._id)}
                          src={assets.cancel_icon}
                          alt="Cancel"
                          className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                          title="Cancel Appointment"
                        />
                        <img
                          onClick={() => completeAppointment(item._id)}
                          src={assets.tick_icon}
                          alt="Complete"
                          className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                          title="Mark as Completed"
                        />
                      </div>
                    )}


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
  )
}

export default DoctorAppointments