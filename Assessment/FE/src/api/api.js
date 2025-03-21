import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8000/travel_request/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const fetchRequests = async () => {
  try {
    const res = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error('Error fetching requests', err);
    return [];
  }
};

export const updateStatus = async (requestId, status) => {
  try {
    await axios.put(
      `${API_BASE_URL}update_status/?id=${requestId}`,
      { status },
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    console.error('Error updating request status:', error);
  }
};

export const submitTravelRequest = async (tripData) => {
  try {
    await axios.post(API_BASE_URL, tripData, { headers: getAuthHeaders() });
  } catch (err) {
    console.error('Error submitting request', err);
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    return decoded.role === 'admin';
  }
  return false;
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.user_id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
