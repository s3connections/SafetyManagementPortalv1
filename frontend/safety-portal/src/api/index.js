import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Adjust port for your .NET backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Check if backend is running on:', error.config.baseURL);
    }
    return Promise.reject(error);
  }
);

export default api;
