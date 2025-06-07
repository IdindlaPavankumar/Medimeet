import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminContext } from './Context/AdminContext';
import { DoctorContext } from './Context/DoctorContext';

import Login from './Pages/Login';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';

import Dashboard from './Pages/Admin/Dashboard';
import AddDoctor from './Pages/Admin/AddDoctor';
import AllAppointment from './Pages/Admin/AllAppointment';
import DoctorsLists from './Pages/Admin/DoctorsLists';

import DoctorDashboard from './Pages/doctors/DoctorDashboard';
import DoctorAppointments from './Pages/doctors/DoctorAppointments';
import DoctorProfile from './Pages/doctors/DoctorProfile';

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const location = useLocation();

  const isAuthenticated = aToken || dToken;
  const isLoginPage = location.pathname === '/admin-login';

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {isAuthenticated && !isLoginPage && <Navbar />}

      {isAuthenticated && !isLoginPage ? (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 bg-gray-50 p-6 overflow-y-auto w-full">
            <Routes>
              {/* Default Route: Redirect based on role */}
              <Route path="/" element={<Navigate to={aToken ? "/admin-dashboard" : "/doctors-dashboard"} />} />

              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/all-appointment" element={<AllAppointment />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/doctors-lists" element={<DoctorsLists />} />

              {/* Doctor Routes */}
              <Route path="/doctors-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctors-appointment" element={<DoctorAppointments />} />
              <Route path="/doctors-profile" element={<DoctorProfile />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/admin-login" element={<Login />} />
          <Route path="*" element={<Navigate to="/admin-login" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
