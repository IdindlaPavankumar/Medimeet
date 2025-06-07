import React from 'react';
import { assets } from '../assets/assets';

const Header = () => {
    return (
        <div className="flex flex-col-reverse md:flex-row items-center justify-between bg-blue-500 text-white rounded-lg p-6 md:p-10 gap-10 m-4 md:m-10">
            {/* Left side */}
            <div className="flex-1 space-y-6 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold leading-snug">
                    Book Appointment <br />
                    With Trusted Doctors
                </h1>

                <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
                    <img
                        src={assets.group_profiles}
                        alt="Group Profiles"
                        className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                    <p className="text-sm md:text-base">
                        Simply browse through our extensive list of trusted doctors,
                        <br className="hidden md:block" />
                        schedule your appointment hassle-free.
                    </p>
                </div>

                <a
                    href="#speciality"
                    className="inline-flex items-center gap-2 text-blue-500 bg-white hover:bg-gray-100 font-medium px-5 py-3 rounded-full transition-all duration-300 w-fit mx-auto md:mx-0"
                >
                    Book Appointment
                    <img src={assets.arrow_icon} alt="Arrow Icon" className="w-4 h-4" />
                </a>
            </div>

            {/* Right side */}
            <div className="flex-1 flex justify-center">
                <img
                    src={assets.header_img}
                    alt="Header Visual"
                    className="max-w-[90%] md:max-w-full h-auto object-contain relative top-10"
                />
            </div>
        </div>
    );
};

export default Header;
