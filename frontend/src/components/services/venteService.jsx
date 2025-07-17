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
  limit = 7,
  nom_client = ""
) => {
  return await axios.get(`${API_BASE_URL}/paginated`, {
    params: {
      page,
      limit,
      nom_client: nom_client || undefined
    }
  });
};
