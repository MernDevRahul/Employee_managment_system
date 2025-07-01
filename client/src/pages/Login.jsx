import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  
  
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
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.post('/auth/login', { email, password, role },{ withCredentials: true });
      localStorage.setItem('token', res.data.token);
      await dispatch(fetchCurrentUser());
      if (role === 'manager') navigate('/manager');
      else navigate('/employee');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-96 space-y-4 transform transition-all duration-500 animate-slideIn"
        style={{ animation: 'slideIn 0.7s' }}
      >
        <div className="flex flex-col items-center mb-2">
          <FaUserCircle className="text-blue-500 text-5xl mb-2" />
          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 transition pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={0}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {errorMsg && (
          <div className="text-red-500 text-sm text-center">{errorMsg}</div>
        )}

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : null}
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      </form>
      <style>
        {`
          @keyframes slideIn {
            0% { opacity: 0; transform: translateY(40px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          @keyframes fadeIn {
            0% { opacity: 0;}
            100% { opacity: 1;}
          }
        `}
      </style>
    </div>
  );
}

export default Login;