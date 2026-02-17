import axios from "axios";

// custom instance with configuration
const api = axios.create({
  baseURL: 'http://localhost:3001/'
})

export default api;