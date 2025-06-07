import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col-reverse md:flex-row items-center justify-between bg-blue-500 rounded-xl px-4 md:px-16  gap-10 text-white overflow-hidden m-4 md:m-10">

            {/* Left Side */}
            <div className="flex-1  text-center md:text-left space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold leading-loose tracking-wide">
                    Book Appointment <br />
                    With <span className="text-white tracking-wide">100+ Trusted Doctors</span>
                </h1>

                <button onClick={() => { navigate('/login') }} className="bg-white text-[#5a67f2] font-semibold px-6 py-3 mt-10 rounded-full shadow hover:bg-gray-100 transition-all duration-300">
                    Create account
                </button>
            </div>

            {/* Right Side */}
            <div className="flex-1 flex justify-center">
                <img
                    src={assets.appointment_img}
                    alt="Doctor"
                    className="w-[300px] md:w-[400px] object-contain"
                />
            </div>
        </div>
    )
}

export default Banner
