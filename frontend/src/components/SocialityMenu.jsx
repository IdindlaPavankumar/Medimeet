import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
const SocialityMenu = () => {
  return (
    <div id='speciality' className='text-center px-4 py-10'>
      <h1 className="text-3xl font-bold text-gray-800 mb-3" >Find by Speciality</h1>
      <p className="text-gray-600 mb-8 text-sm md:text-base">Simply browse through our extensive list of trusted doctors,Schedule <br />your appointment hassle-free.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center">
        {specialityData.map((item, index) => (
          <Link onClick={()=>scrollTo(0,0)} key={index} to={`/doctors/${item.speciality}`} className="flex flex-col items-center p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg hover:scale-105">
            <img src={item.image} alt={item.speciality}  className="w-16 h-16 object-contain mb-2"/>
            <p className="text-sm font-medium text-gray-700">{item.speciality}</p>
          </Link>
        ))}

      </div>
    </div>
  )
}

export default SocialityMenu