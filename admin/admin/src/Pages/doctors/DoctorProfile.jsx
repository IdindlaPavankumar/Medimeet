import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../Context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const {
    dToken,
    profileData,
    setProfileData,
    getProfileData,
    backendUrl,
  } = useContext(DoctorContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
        about: profileData.about,
      };

      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-profile',
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setProfileData((prev) => ({
      ...prev,
      available: !prev.available,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  return (
    profileData && (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Image */}
          <div className="flex-shrink-0">
            <img
              src={profileData.image}
              alt="Doctor"
              className="w-40 h-40 object-cover rounded-full border border-gray-300 shadow-sm"
            />
          </div>

          {/* Doctor Info */}
          <div className="flex-1 space-y-3">
            <p className="text-2xl font-bold text-gray-800">{profileData.name}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <p className="text-gray-600 font-medium">
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full font-semibold w-fit">
                {profileData.experience} yrs experience
              </button>
            </div>

            {/* About */}
            <div>
              <p className="text-gray-700 font-semibold mb-1">About:</p>
              {isEdit ? (
                <textarea
                  name="about"
                  value={profileData.about}
                  onChange={handleChange}
                  className="w-full border rounded p-2 text-sm"
                />
              ) : (
                <p className="text-gray-600">{profileData.about}</p>
              )}
            </div>

            {/* Fees */}
            <p className="text-gray-800 font-medium">
              Appointment Fee:{' '}
              <span className="text-green-600 font-semibold">
                {isEdit ? (
                  <input
                    type="number"
                    name="fees"
                    value={profileData.fees}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 text-sm w-24"
                  />
                ) : (
                  `₹${profileData.fees}`
                )}
              </span>
            </p>

            {/* Address */}
            <div>
              <p className="text-gray-700 font-semibold mb-1">Address:</p>
              {isEdit ? (
                <>
                  <input
                    type="text"
                    name="line1"
                    value={profileData.address?.line1 || ''}
                    onChange={handleAddressChange}
                    className="w-full border rounded p-2 text-sm mb-2"
                  />
                  <input
                    type="text"
                    name="line2"
                    value={profileData.address?.line2 || ''}
                    onChange={handleAddressChange}
                    className="w-full border rounded p-2 text-sm"
                  />
                </>
              ) : (
                <>
                  <p className="text-gray-600">{profileData.address?.line1}</p>
                  <p className="text-gray-600">{profileData.address?.line2}</p>
                </>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="available"
                checked={profileData.available}
                onChange={handleCheckboxChange}
                className="accent-green-600"
              />
              <label htmlFor="available" className="text-gray-700 font-medium">
                Available
              </label>
            </div>

            {/* Action Buttons */}
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="mt-4 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
