import React, { useContext, useState } from 'react';
import { AdminContext } from '../Context/AdminContext';
import { DoctorContext } from '../Context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { backendUrl, setAToken } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint =
        role === 'Admin'
          ? `${backendUrl}/api/admin/login`
          : `${backendUrl}/api/doctor/login`;

      const { data } = await axios.post(endpoint, { email, password });

      if (data.success) {
        toast.success(`${role} login successful!`);

        if (role === 'Admin') {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          navigate('/admin-dashboard')
        } else {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          navigate('/doctors-dashboard')
        }

        console.log(`${role} Token:`, data.token);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Login error. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            {role} Login
          </h2>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm">
            {role === 'Admin' ? (
              <>
                Doctor Login?{' '}
                <span
                  className="text-indigo-600 cursor-pointer"
                  onClick={() => setRole('Doctor')}
                >
                  Click here
                </span>
              </>
            ) : (
              <>
                Admin Login?{' '}
                <span
                  className="text-indigo-600 cursor-pointer"
                  onClick={() => setRole('Admin')}
                >
                  Click here
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
