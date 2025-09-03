const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7139/api';

export const API_ENDPOINTS = {
  AUDITS: `${API_BASE_URL}/audit`,
  OBSERVATIONS: `${API_BASE_URL}/observation`,
  INCIDENTS: `${API_BASE_URL}/incident`, 
  PERMITS: `${API_BASE_URL}/permit`,
  INVESTIGATIONS: `${API_BASE_URL}/investigation`,
  USERS: `${API_BASE_URL}/user`,
  PLANTS: `${API_BASE_URL}/plant`,
  DEPARTMENTS: `${API_BASE_URL}/department`
};

export default API_BASE_URL;