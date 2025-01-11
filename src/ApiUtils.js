import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api'; // Base URL for the API

// Function to retrieve token from localStorage
const getAuthToken = () => localStorage.getItem('access');

// Dynamic API helper functions with Authorization header
export const getItems = (resource, params = {}) => 
  axios.get(`${BASE_URL}/${resource}/`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,  // Only include the Authorization header if token exists
    },
    params: params,
  });

export const getItem = (resource, id) => 
  axios.get(`${BASE_URL}/${resource}/${id}/`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    }
  });

export const createItem = (resource, data, headers = {}) => {
  const response = axios.post(`${BASE_URL}/${resource}/`, data, {
    headers: {Authorization: `Bearer ${getAuthToken()}`, ...headers }
  });
  return response;
};

export const updateItem = (resource, id, data, headers = {} ) => {
  const response = axios.put(`${BASE_URL}/${resource}/${id}/`, data, {
    headers: {Authorization: `Bearer ${getAuthToken()}`, ...headers }
  });
  return response;
};

export const partialupdateItem = (resource, id, data) => 
  axios.patch(`${BASE_URL}/${resource}/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    }
  });

export const deleteItem = (resource, id) => 
  axios.delete(`${BASE_URL}/${resource}/${id}/`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    }
  });
