import axios from "axios";

const API_BASE_URL = "http://localhost:8000/users";

// ✅ Créer un utilisateur (register)
export const signup = async (formData) => {
  return await axios.post(`${API_BASE_URL}/register/`, formData);
};

// ✅ Connexion
export const signin = async (user) => {
  return await axios.post(`${API_BASE_URL}/login/`, user);
};

// ❌ Pas d'endpoint logout dans FastAPI, on le fait côté frontend
export const logout = () => {
  localStorage.removeItem("token");
  return { message: "Déconnexion réussie" };
};

// ✅ Réinitialiser mot de passe via CIN
export const resetPassword = async (data) => {
  return await axios.post(`${API_BASE_URL}/reset-password/`, data);
};

// ✅ Modifier un utilisateur
export const updateUser = async (userId, updatedUserData) => {
  return await axios.put(`${API_BASE_URL}/${userId}`, updatedUserData);
};

// ✅ Obtenir un utilisateur par ID
export const getUserbyId = async (userId) => {
  return await axios.get(`${API_BASE_URL}/${userId}`);
};

// ✅ Supprimer un utilisateur
export const deleteUser = async (userId) => {
  return await axios.delete(`${API_BASE_URL}/${userId}`);
};

// ✅ Liste paginée + recherche
export const getUsersPaginated = async (
  page = 1,
  limit = 7,
  nom = ""
) => {
  return await axios.get(`${API_BASE_URL}/paginated`, {
    params: {
      page,
      limit,
      nom: nom || undefined
    }
  });
};
