import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../Context/AdminContext'
import { useEffect } from 'react'

const DoctorsLists = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)
  useEffect(() => {
    if (aToken) {
      // console.log("Calling getAllDoctors");
      getAllDoctors()
    }
  }, [aToken])
  // useEffect(() => {
  //   console.log("Doctors List:", doctors); //  log doctors when updated
  // }, [doctors]);
  return (
    <div className="  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Doctors</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-66 object-cover hover:bg-blue-500 transition-all duration-500"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Dr. {item.name}
              </h2>
              <p className="text-sm text-black-600 mb-3">{item.speciality}</p>

              <div className="flex items-center gap-2">
                <input
                onChange={()=>changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                  readOnly
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700">Available</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsLists;