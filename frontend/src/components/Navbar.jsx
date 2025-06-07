import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };
// console.log(handleLogout)
  return (
    <div className="border-b border-b-gray-400">
      <div className="flex items-center justify-between px-4 py-4 md:px-10">
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="Logo"
          className="h-10 w-44 cursor-pointer"
        />

        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        <ul className="hidden md:flex items-center gap-6 font-medium text-sm">
          {['/', '/doctors', '/about', '/contact'].map((path, idx) => (
            <li key={idx} className="py-1">
              <NavLink to={path} className="hover:text-blue-600">
                {path === '/' ? 'HOME' : path.replace('/', '').toUpperCase()}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {token && userData ? (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={userData.image || assets.defaultProfilePic}
                    alt="profile"
                  />
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
                <div className="py-1">
                  <MenuItem>
                    {({ active }) => (
                      <p
                        onClick={() => navigate('/my-profile')}
                        className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                      >
                        My Profile
                      </p>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <p
                        onClick={() => navigate('/my-appointment')}
                        className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                      >
                        My Appointment
                      </p>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <p
                        onClick={handleLogout}
                        className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                      >
                        Logout
                      </p>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          ) : (
            <button
              onClick={() => navigate('/login?mode=login')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Account
            </button>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 text-center">
          <ul className="flex flex-col gap-3 font-medium text-sm">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">
              HOME
            </NavLink>
            <NavLink to="/doctors" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">
              ALL DOCTORS
            </NavLink>
            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">
              ABOUT
            </NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">
              CONTACT
            </NavLink>
          </ul>
          <div className="mt-4">
            {token && userData ? (
              <div className="flex flex-col gap-2">
                <p onClick={() => { navigate('/my-profile'); setMobileMenuOpen(false); }} className="cursor-pointer hover:text-blue-600">My Profile</p>
                <p onClick={() => { navigate('/my-appointment'); setMobileMenuOpen(false); }} className="cursor-pointer hover:text-blue-600">My Appointment</p>
                <p onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="cursor-pointer hover:text-blue-600">Logout</p>
              </div>
            ) : (
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
