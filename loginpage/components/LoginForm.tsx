
import React, { useState } from 'react';
import type { MessageType } from '../types';
import { TruckIcon } from './icons';

interface LoginFormProps {
  onLogin: (email: string, password: string, company: string) => Promise<void>;
  isLoading: boolean;
  message: string;
  messageType: MessageType;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, message, messageType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(email, password, company);
  };
  
  const messageStyles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="w-full max-w-md">
      <div className="form-container rounded-2xl shadow-2xl p-8 border border-white/30 bg-white/95 backdrop-blur-sm">
        <div className="text-center mb-8">
          <TruckIcon className="text-6xl mb-4 truck-icon-anim inline-block" />
          <h1 className="text-3xl font-bold text-gray-900 mb-1">TruckForms</h1>
          <p className="text-gray-600">Digital Forms for Logistics</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="driver@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company">Company Code (Optional)</label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="ABC-LOGISTICS"
              autoComplete="organization"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-white font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg">
            {isLoading ? 'Signing In...' : 'Secure Sign In'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${messageStyles[messageType]}`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>New company? <a href="#signup" className="font-medium text-indigo-600 hover:text-indigo-500">Create Account</a></p>
          <p className="mt-2">
            <a href="#forgot" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot Password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
