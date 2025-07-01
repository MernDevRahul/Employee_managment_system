import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.MODE === "PROD" ? process.env.PROD_URL : process.env.DEV_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  return config;
});

export default instance;