import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('Login'); // 'Login' or 'Sign Up'

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (mode === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">
          {mode === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please {mode === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
        </p>

        {mode === 'Sign Up' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition duration-300"
        >
          {mode}
        </button>

        <p className="mt-4 text-center text-sm">
          {mode === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setMode(mode === 'Sign Up' ? 'Login' : 'Sign Up')}
            className="text-blue-500 cursor-pointer underline"
          >
            {mode === 'Sign Up' ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
