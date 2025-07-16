// services/promesseService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/promesses";

export const createPromesse = async (promesseData) => {
  return await axios.post(`${API_BASE_URL}/`, promesseData);
};

export const getAllPromesses = async () => {
  return await axios.get(`${API_BASE_URL}/`);
};

export const getPaginatedPromesses = async (
  page = 1, limit = 7, marque = "", modele = "", matricule = "", societe = "", service_concerne = ""
) => {
  return await axios.get(`${API_BASE_URL}/paginated`, {
    params: {
      page,
      limit,
      marque: marque || undefined,
      modele: modele || undefined,
      matricule: matricule || undefined,
      societe: societe || undefined,
      service_concerne: service_concerne || undefined
    }
  });
};

export const getPromesseById = async (id) => {
  return await axios.get(`${API_BASE_URL}/${id}`);
};

export const getPromessesByUser = async (userId) => {
  return await axios.get(`${API_BASE_URL}/user/${userId}`);
};

export const updatePromesse = async (id, data) => {
  return await axios.put(`${API_BASE_URL}/${id}`, data);
};

export const deletePromesse = async (id) => {
  return await axios.delete(`${API_BASE_URL}/${id}`);
};
