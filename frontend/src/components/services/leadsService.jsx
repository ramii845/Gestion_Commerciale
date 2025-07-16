// services/leadsService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/leads";

export const createLead = async (leadData) => {
  return await axios.post(`${API_BASE_URL}/`, leadData);
};

export const getAllLeads = async () => {
  return await axios.get(`${API_BASE_URL}/`);
};

export const getPaginatedLeads = async (page = 1, limit = 7, nom_client = "", besoin = "", affectation = "") => {
  return await axios.get(`${API_BASE_URL}/paginated`, {
    params: {
      page,
      limit,
      nom_client: nom_client || undefined,
      besoin: besoin || undefined,
      affectation: affectation || undefined
    }
  });
};

export const getLeadById = async (leadId) => {
  return await axios.get(`${API_BASE_URL}/${leadId}`);
};

export const getLeadsByUser = async (userId) => {
  return await axios.get(`${API_BASE_URL}/user/${userId}`);
};

export const updateLead = async (leadId, updatedLead) => {
  return await axios.put(`${API_BASE_URL}/${leadId}`, updatedLead);
};

export const deleteLead = async (leadId) => {
  return await axios.delete(`${API_BASE_URL}/${leadId}`);
};
