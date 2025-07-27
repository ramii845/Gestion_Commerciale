import axios from "axios";

const API_BASE_URL = "http://localhost:8000/ventes";

// ✅ Ajouter une vente
export const addVente = async (formData) => {
  return await axios.post(`${API_BASE_URL}/`, formData);
};

// ✅ Obtenir toutes les ventes
export const getAllVentes = async () => {
  return await axios.get(`${API_BASE_URL}/`);
};

// ✅ Obtenir une vente par ID
export const getVenteById = async (venteId) => {
  return await axios.get(`${API_BASE_URL}/${venteId}`);
};

// ✅ Supprimer une vente
export const deleteVente = async (venteId) => {
  return await axios.delete(`${API_BASE_URL}/${venteId}`);
};

// ✅ Modifier une vente
export const updateVente = async (venteId, updatedVente) => {
  return await axios.put(`${API_BASE_URL}/${venteId}`, updatedVente);
};

// ✅ Pagination + recherche
export const getPaginatedVentes = async (
  page = 1,
  limit = 14,
  nom_client = "",
  matricule = ""
) => {
  return await axios.get(`${API_BASE_URL}/paginated`, {
    params: {
      page,
      limit,
      nom_client: nom_client || undefined,
      matricule: matricule || undefined
    }
  });
};


// services/venteService.js
export const getHistogrammeVentes = async () => {
  const res = await axios.get(`${API_BASE_URL}/getHistogrammeVentes`);
  return res.data;
};

