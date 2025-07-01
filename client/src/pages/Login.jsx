import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  
  
  useEffect(()=>{

    const token = localStorage.getItem('token');
    if (token) {
       // If token exists, fetch current user data
      dispatch(fetchCurrentUser());
    }
    if(user?.role=="admin"){
      navigate("/admin")
    }
    if(user?.role=="manager"){
      navigate("/manager")
    }
    if(user?.role=="employee"){
      navigate("/employee")
    }
  },[user])


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password, role },{ withCredentials: true });
      localStorage.setItem('token', res.data.token);
      await dispatch(fetchCurrentUser());

      // Navigate based on role
      if (role === 'manager') navigate('/manager');
      else navigate('/employee');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      </form>
    </div>
  );
}

export default Login;