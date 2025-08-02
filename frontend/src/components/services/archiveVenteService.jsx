import axios from "axios";

const API_BASE_URL = "http://localhost:8000/archives";

// ✅ Obtenir toutes les archives
export const getAllArchives = async () => {
  return await axios.get(`${API_BASE_URL}/`);
};

// ✅ Supprimer définitivement une archive
export const deleteArchive = async (archiveId) => {
  return await axios.delete(`${API_BASE_URL}/${archiveId}`);
};

// ✅ Pagination + recherche pour les archives
export const getPaginatedArchives = async (
  page = 1,
  limit = 14,
  statut = "",
  matricule = "",
  matriculation = "",
  nom_client = ""
) => {
  return await axios.get(`${API_BASE_URL}/paginated`, {
    params: {
      page,
      limit,
      statut: statut || undefined,
      matricule: matricule || undefined,
      matriculation: matriculation || undefined,
      nom_client: nom_client || undefined,
    }
  });
};
