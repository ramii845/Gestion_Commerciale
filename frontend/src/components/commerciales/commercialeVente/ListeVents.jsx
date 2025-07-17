import React, { useEffect, useState } from "react";
import { getPaginatedVentes } from "../../services/venteService";
import { getUsersPaginated } from "../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import "../../css/ListeVentes.css";

// Fonction pour décoder le token JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erreur décodage JWT :", e);
    return null;
  }
};

// Associe un statut à une classe CSS
const getStatutClass = (statut) => {
  if (!statut) return "";
  return `statut-${statut.toLowerCase()}`;
};

const ListeVentes = () => {
  const [ventes, setVentes] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [filterMatricule, setFilterMatricule] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Récupération des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersPaginated(1, 1000);
        const usersData = res.data.users || res.data;
        const map = {};
        usersData.forEach((u) => {
          map[u.id || u._id] = u.nom;
        });
        setUsersMap(map);
      } catch (error) {
        toast.error("Erreur chargement utilisateurs");
      }
    };
    fetchUsers();
  }, []);

  // Décodage du token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJWT(token);
      setUserId(decoded?.user_id || null);
    }
  }, []);

  // Récupération des ventes
  useEffect(() => {
    if (!userId) return;

    const fetchVentes = async () => {
      try {
        const res = await getPaginatedVentes(page, 7, "");
        const filtered = res.data.ventes.filter(
          (v) =>
            v.user_id === userId &&
            v.matricule.toLowerCase().includes(filterMatricule.toLowerCase())
        );
        setVentes(filtered);
        setTotalPages(res.data.total_pages);
      } catch (error) {
        toast.error("Erreur chargement ventes");
      }
    };
    fetchVentes();
  }, [page, filterMatricule, userId]);

  const onPrev = () => setPage((p) => Math.max(p - 1, 1));
  const onNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <>
      <Navbar />
      <div className="liste-ventes-container">
        <div className="liste-ventes-header">
          <h2 style={{ textAlign: "center", flexGrow: 1 }}>Mes ventes</h2>
          <button style={{ alignSelf: "flex-start" }} onClick={() => navigate("/add-vente")}>
            Ajouter
          </button>
        </div>

        <div className="filter-container">
          <input
            type="text"
            placeholder="Filtrer par matricule"
            value={filterMatricule}
            onChange={(e) => {
              setPage(1);
              setFilterMatricule(e.target.value);
            }}
          />
        </div>

        <table className="liste-ventes-table">
          <thead>
            <tr>
              <th>Commercial</th>
              <th>Client</th>
              <th>Téléphone</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Matricule</th>
              <th>Commentaire</th>
              <th>Statut</th>
              <th>Date création</th>
              <th>Date modification</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ventes.length > 0 ? (
              ventes.map((v) => (
                <tr key={v.id} className={getStatutClass(v.statut)}>
                  <td>{usersMap[v.user_id] || "Inconnu"}</td>
                  <td>{v.nom_client}</td>
                  <td>{v.tel_client}</td>
                  <td>{v.marque}</td>
                  <td>{v.modele}</td>
                  <td>{v.matricule}</td>
                  <td>{v.commentaire || "-"}</td>
                  <td>{v.statut || "-"}</td>
                  <td>{v.date_creation ? new Date(v.date_creation).toLocaleDateString() : "-"}</td>
                  <td>{v.date_modification ? new Date(v.date_modification).toLocaleDateString() : "-"}</td>
                  <td>
                    <button onClick={() => navigate(`/edit-vente/${v.id}`)}>Modifier</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="empty-row">
                  Aucune vente trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={onPrev} disabled={page === 1}>
            ←
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button onClick={onNext} disabled={page === totalPages}>
            →
          </button>
        </div>
      </div>
    </>
  );
};

export default ListeVentes;
