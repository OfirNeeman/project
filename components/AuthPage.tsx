import React, { useState } from 'react';
import { User } from '../types';

// הגדרת כתובת ה-IP של המחשב שלך
const API_BASE_URL = 'http://192.168.1.149:4000';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      // שימוש במשתנה API_BASE_URL במקום localhost
      const endpoint = isLogin ? '/login' : '/signup';
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong.');
      } else {
        localStorage.setItem('token', data.token);
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-stone-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-stone-800">
          AI Fashion Stylist
        </h1>
        <p className="text-center text-stone-600 mb-6">Your personal style journey starts here.</p>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`w-1/2 py-3 text-center font-semibold transition-colors ${isLogin ? 'text-pink-600 border-b-2 border-pink-600' : 'text-stone-500'}`}
          >
            Log In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`w-1/2 py-3 text-center font-semibold transition-colors ${!isLogin ? 'text-pink-600 border-b-2 border-pink-600' : 'text-stone-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-stone-700">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full py-3 px-4 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors">
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};