import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';
const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false)


  const updateUserProfileData = async () => {
    try {

      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        setUserData(data.user)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {

      console.log(error)
      toast.error(error.message)

    }


  }

  const handleAddressChange = (key, value) => {
    setUserData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value,
      },
    }));
  };

  //  Fixed: Null check to prevent errors
  if (!userData) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10 space-y-6">
      {
        isEdit ? <label htmlFor='image'>
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
            <img
              className="w-10 absolute bottom-12 right-12"
              src={image ? image : assets.upload_icon}
              alt=""
            />
          </div>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" name='' id='image' hidden />
        </label>
          :
          <img
            src={userData.image || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
      }
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <div>
          {isEdit ? (
            <input
              type="text"
              value={userData.name || ''}
              onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
              className="border px-3 py-2 rounded-md w-full"
            />
          ) : (
            <p className="text-xl font-semibold">{userData.name}</p>
          )}
        </div>
      </div>

      <hr />

      {/* Contact Info */}
      <div>
        <p className="text-lg font-semibold text-gray-700 mb-2 underline">CONTACT INFORMATION</p>
        <div className="space-y-2">
          <div>
            <p className="font-medium">Email:</p>
            <p className="text-gray-700">{userData.email}</p>
          </div>

          <div>
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone || ''}
                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                className="border px-3 py-2 rounded-md w-full"
              />
            ) : (
              <p className="text-gray-700">{userData.phone}</p>
            )}
          </div>

          <div>
            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={userData.address?.line1 || ''}
                  onChange={e => handleAddressChange('line1', e.target.value)}
                  className="border px-3 py-2 rounded-md w-full"
                  placeholder="Address Line 1"
                />
                <input
                  type="text"
                  value={userData.address?.line2 || ''}
                  onChange={e => handleAddressChange('line2', e.target.value)}
                  className="border px-3 py-2 rounded-md w-full"
                  placeholder="Address Line 2"
                />
              </div>
            ) : (
              <p className="text-gray-700">
                {userData.address?.line1 || ''}<br />
                {userData.address?.line2 || ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className="text-lg font-semibold text-gray-700 mb-2 underline">BASIC INFORMATION</p>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                value={userData.gender || ''}
                onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                className="border px-3 py-2 rounded-md w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-700">{userData.gender || 'Not specified'}</p>
            )}
          </div>

          <div>
            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob || ''}
                onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                className="border px-3 py-2 rounded-md w-full"
              />
            ) : (
              <p className="text-gray-700">{userData.dob || 'Not specified'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-right">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
          >
            Save Information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;