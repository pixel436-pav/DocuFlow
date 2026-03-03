import axios from "axios";

// custom instance with configuration
const api = axios.create({
  baseURL: 'http://localhost:3001'
});

api.interceptors.request.use((config) => {
   // check the browser's local memo for the saved token
  const token = localStorage.getItem('token');
  
  // if you see the token then take it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Let req leave 
  return config;
})

export default api;