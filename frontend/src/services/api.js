import axios from 'axios';

// Create a reusable Axios instance pointing to the backend API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
