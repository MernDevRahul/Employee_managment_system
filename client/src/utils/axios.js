import axios from 'axios';

console.log(import.meta.env.VITE_MODE);
const instance = axios.create({
  
  baseURL: import.meta.env.VITE_MODE === "Production" 
    ? import.meta.env.VITE_PROD_URL 
    : import.meta.env.VITE_DEV_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  return config;
});

export default instance;