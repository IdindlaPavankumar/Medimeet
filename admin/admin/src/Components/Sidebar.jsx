import React, { useContext, useState } from 'react';
import { AdminContext } from '../Context/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Menu, X } from 'lucide-react'; // icon library (install with `npm i lucide-react`)
import { DoctorContext } from '../Context/DoctorContext';

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const{dToken}=useContext(DoctorContext)
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="md:hidden   p-4 flex justify-start items-start bg-white shadow">
                <button onClick={toggleSidebar} className="text-indigo-600">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed md:relative top-0 left-0  bg-white shadow-md p-6 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:block`}
            >
                <div>
                    {aToken && (
                        <ul className="space-y-4">
                            <NavLink
                                to="/admin-dashboard"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${isActive
                                        ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <img src={assets.home_icon} alt="Dashboard" className="h-5 w-5" />
                                <p>Dashboard</p>
                            </NavLink>

                            <NavLink
                                to="/all-appointment"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${isActive
                                        ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <img src={assets.appointment_icon} alt="Appointments" className="h-5 w-5" />
                                <p>Appointments</p>
                            </NavLink>

                            <NavLink
                                to="/add-doctor"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${isActive
                                        ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <img src={assets.add_icon} alt="Add Doctor" className="h-5 w-5" />
                                <p>Add Doctor</p>
                            </NavLink>

                            <NavLink
                                to="/doctors-lists"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${isActive
                                        ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <img src={assets.people_icon} alt="Doctors List" className="h-5 w-5" />
                                <p>Doctors List</p>
                            </NavLink>
                        </ul>
                    )}
                    {dToken && (
                        <ul className="space-y-4">
                            <NavLink
                                to="/doctors-dashboard"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${isActive
                                        ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <img src={assets.home_icon} alt="Dashboard" className="h-5 w-5" />
                                <p>Dashboard</p>
                            </NavLink>

                            <NavLink
                                to="/doctors-appointment"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${isActive
                                        ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <img src={assets.appointment_icon} alt="Appointments" className="h-5 w-5" />
                                <p>Appointments</p>
                            </NavLink>
                            <NavLink
                                to="/doctors-profile"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${isActive
                                        ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <img src={assets.people_icon} alt="Doctors List" className="h-5 w-5" />
                                <p>Doctors Profile</p>
                            </NavLink>
                        </ul>
                    )}
                    </div>
                </div>
            </>
            );
};
export default Sidebar;
