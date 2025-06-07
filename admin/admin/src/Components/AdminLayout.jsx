import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import Dashboard from '../Pages/Admin/Dashboard';

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen overflow-y-auto">
        <Dashboard/>
      </div>
    </div>
  );
};

export default AdminLayout;
