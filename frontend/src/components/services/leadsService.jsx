// services/leadsService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/leads";

export const createLead = async (leadData) => {
  return await axios.post(`${API_BASE_URL}/`, leadData);
};

export const getAllLeads = async () => {
  return await axios.get(`${API_BASE_URL}/`);
};

export const getPaginatedLeads = async (
  page = 1,
  limit = 8,
  nom_client = "",
  besoin = "",
  affectation = "",
  date_creation = "",
  user_id = ""
) => {
  return await axios.get(`${API_BASE_URL}/paginated`, {
    params: {
      page,
      limit,
      nom_client: nom_client || undefined,
      besoin: besoin || undefined,
      affectation: affectation || undefined,
      date_creation: date_creation || undefined,
      user_id: user_id || undefined,  // IMPORTANT : passer user_id
    },
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

export const getHistogrammeLeads = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getHistogrammeLeads`);
    return response.data; // on retourne directement les données
  } catch (error) {
    console.error("Erreur lors de la récupération de l'histogramme des leads :", error);
    throw error;
  }
};
