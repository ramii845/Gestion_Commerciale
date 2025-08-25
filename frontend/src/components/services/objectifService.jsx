import axios from "axios";

const API_BASE_URL = "http://localhost:8000/objectifs"; // adapte au backend

export const addObjectif = async (data) => {
  return await axios.post(`${API_BASE_URL}/`, data);
};

export const getObjectifByUser = async (userId) => {
  return await axios.get(`${API_BASE_URL}/user/${userId}`);
};
