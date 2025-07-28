import React, { useEffect, useState } from "react";
import { getPaginatedVentes } from "../../services/venteService";
import { getUsersPaginated } from "../../services/authService";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import "../../css/ListeVentes.css";

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
  } catch {
    return null;
  }
};

const ListeManVentes = () => {
  const [ventes, setVentes] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [filterStatut, setFilterStatut] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersPaginated(1, 1000);
        const usersData = res.data.users || res.data;

        const map = {};
        usersData.forEach((u) => {
          map[u.id || u._id] = {
            nom: u.nom,
            photo: u.photo
          };
        });

        setUsersMap(map);
      } catch {
        toast.error("Erreur chargement utilisateurs");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJWT(token);
      setUserId(decoded?.user_id || null);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchVentes = async () => {
      try {
        const res = await getPaginatedVentes(page, 14, filterStatut);
        setVentes(res.data.ventes);
        setTotalPages(res.data.total_pages);
      } catch {
        toast.error("Erreur chargement ventes");
      }
    };

    fetchVentes();
  }, [page, filterStatut, userId]);

  const onPrev = () => setPage((p) => Math.max(p - 1, 1));
  const onNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <>
      <Navbar />
      <div className="liste-ventes-container">
        <h2 style={{ textAlign: "center" }}>Mes ventes</h2>

        {/* Filtre par statut */}
        <div className="filter-container" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <select
            value={filterStatut}
            onChange={(e) => {
              setFilterStatut(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              backgroundColor: "#f8f8f8",
              fontSize: "14px",
              color: "#333",
              minWidth: "180px",
              textAlign: "center"
            }}
          >
            <option value="">Tous statuts</option>
            <option value="Prospection">Prospection</option>
            <option value="Devis">Devis</option>
            <option value="Commande">Commande</option>
            <option value="Facturation">Facturation</option>
            <option value="Livraison">Livraison</option>
            <option value="Blocage">Blocage</option>
            <option value="Relance">Relance</option>
          </select>
        </div>

        {/* Table des ventes */}
        <table className="liste-ventes-table">
          <thead>
            <tr>
              <th>Image</th>
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
            </tr>
          </thead>
          <tbody>
            {ventes.length > 0 ? (
              ventes.map((v) => (
                <tr key={v.id}>
                <td>
  {usersMap[v.user_id]?.photo ? (
    <img
      src={usersMap[v.user_id].photo.startsWith("http")
        ? usersMap[v.user_id].photo
        : `/uploads/${usersMap[v.user_id].photo}`
      }
      alt="utilisateur"
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        objectFit: "cover"
      }}
    />
  ) : (
    <div style={{
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: "#ccc"
    }} />
  )}
</td>
<td>{usersMap[v.user_id]?.nom || "Inconnu"}</td>
                  <td>{v.nom_client}</td>
                  <td>{v.tel_client}</td>
                  <td>{v.marque}</td>
                  <td>{v.modele}</td>
                  <td>{v.matricule || "-"}</td>
                  <td>{v.commentaire || "-"}</td>
                  <td>{v.statut || "-"}</td>
                  <td>
                    {v.date_creation
                      ? new Date(v.date_creation).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : "-"}
                  </td>
                  <td>
                    {v.date_modification
                      ? new Date(v.date_modification).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} style={{ textAlign: "center" }}>
                  Aucune vente trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
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

export default ListeManVentes;
