import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import DashboardLayout from './DashboardLayout';

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    manager_id: ''
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch managers when component mounts
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get('/users?role=manager');
        setManagers(response.data);
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };
    fetchManagers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.password || !formData.role) {
        throw new Error('All fields are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Password validation
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };

      // Add manager_id only if role is employee and manager is selected
      if (formData.role === 'employee' && formData.manager_id) {
        submitData.manager_id = formData.manager_id;
      }

      const response = await axios.post('/auth/register', submitData);
      
      setMessage({ type: 'success', text: 'Employee created successfully!' });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        manager_id: ''
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create employee';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="max-w-2xl mx-auto p-6 overflow-hidden">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Employee</h2>
          
          {/* Message Display */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter employee's full name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter employee's email address"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password (min 6 characters)"
                required
                minLength={6}
              />
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Manager Assignment (only for employees) */}
            {formData.role === 'employee' && managers.length > 0 && (
              <div>
                <label htmlFor="manager_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Manager (Optional)
                </label>
                <select
                  id="manager_id"
                  name="manager_id"
                  value={formData.manager_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a manager (optional)</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {loading ? 'Creating Employee...' : 'Create Employee'}
              </button>
            </div>
          </form>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Important Notes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All fields marked with * are required</li>
              <li>• Email must be unique and valid</li>
              <li>• Password must be at least 6 characters long</li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default CreateEmployee;