import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../Context/AdminContext';
import { assets } from '../assets/assets';

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext);
    const navigate = useNavigate();

    //  Proper logout function
    const handleLogout = () => {
        setAToken('');
        localStorage.removeItem('aToken'); // Clear token from storage (if used)
        navigate('/admin-login'); // Redirect to login page
    };

    return (
        <div className="flex flex-row sm:flex-row items-center justify-between bg-gray-100 px-4 sm:px-4 py-3 sm:py-4 rounded-md gap-3 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                <img
                    src={assets.admin_logo}
                    alt="Admin Logo"
                    className="h-10 w-auto object-contain"
                />
                <p className="text-base sm:text-lg font-semibold text-gray-800 border border-indigo-600 rounded-full px-3 sm:px-4 py-1 inline-block">
                    {aToken ? 'Admin' : 'Doctor'}
                </p>
            </div>

            {/*  onClick assigned correctly to a function */}
            <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white text-sm sm:text-base px-5 py-2 rounded-full hover:bg-indigo-700 transition duration-200 shadow"
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;
