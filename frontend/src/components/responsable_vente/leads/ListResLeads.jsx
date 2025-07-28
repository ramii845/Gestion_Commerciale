import React, { useEffect, useState } from "react";
import { getPaginatedLeads } from "../../services/leadsService";
import { getUsersPaginated } from "../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import '../../css/ListLeads.css'


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

const ListeResLeads = () => {
  const [leads, setLeads] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [filterNomClient, setFilterNomClient] = useState("");
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
          map[u.id || u._id] = {
            nom: u.nom,
            photo: u.photo
          };
        });
        setUsersMap(map);
      } catch (error) {
        toast.error("Erreur chargement utilisateurs");
      }
    };
    fetchUsers();
  }, []);

  // Décodage token JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJWT(token);
      setUserId(decoded?.user_id || null);
    }
  }, []);

useEffect(() => {
  const fetchLeads = async () => {
    try {
      const res = await getPaginatedLeads(
        page,
        8,
        filterNomClient,
        "", // besoin
        "", // affectation
        "", // date_creation
        ""  // <- ici on envoie une chaîne vide à la place du userId
      );

      setLeads(res.data.leads);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      toast.error("Erreur chargement des leads");
    }
  };

  fetchLeads();
}, [page, filterNomClient]);

  const onPrev = () => setPage((p) => Math.max(p - 1, 1));
  const onNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <>
      <Navbar />
      <div className="liste-leads-container">
        <div className="liste-leads-header">
          <h2 className="titleLeads">Mes Leads</h2>
          <button className="btn-ajout-leads" onClick={() => navigate("/add-lead-res")}>
            Ajouter
          </button>
        </div>

        <div className="filter-container-nom">
          <input
            type="text"
            placeholder="Filtrer par nom du client"
            value={filterNomClient}
            onChange={(e) => {
              setPage(1);
              setFilterNomClient(e.target.value);
            }}
          />
        </div>

        <table className="liste-leads-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Commercial</th>
              <th>Date Création</th>
              <th>Nom Client</th>
              <th>Téléphone</th>
              <th>Marque</th>
              <th>Besoin</th>
              <th>Date Traitement</th>
              <th>Affectation</th>
              <th>Relance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.id}>
                              <td>
  {usersMap[lead.user_id]?.photo ? (
    <img
      src={usersMap[lead.user_id].photo.startsWith("http")
        ? usersMap[lead.user_id].photo
        : `/uploads/${usersMap[lead.user_id].photo}`
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
<td>{usersMap[lead.user_id]?.nom || "Inconnu"}</td>
           <td>{lead.date_creation ? new Date(lead.date_creation).toLocaleString("fr-FR", {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}) : "-"}</td>
                  <td>{lead.nom_client}</td>
                  <td>{lead.telephone}</td>
                  <td>{lead.marque}</td> 
                  <td>{lead.besoin}</td>
            <td>

               {lead.date_traitement 
    ? new Date(lead.date_traitement).toLocaleString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-"}
            </td>
                  <td>{lead.affectation}</td>
                <td>
  {lead.relance
    ? new Date(lead.relance).toLocaleString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-"}
</td>
                  <td>
                    <button name="btn5" onClick={() => navigate(`/edit-lead-res/${lead.id}`)}>Modifier</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="empty-row">
                  Aucun lead trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={onPrev} disabled={page === 1}>←</button>
          <span>{page} / {totalPages}</span>
          <button onClick={onNext} disabled={page === totalPages}>→</button>
        </div>
      </div>
    </>
  );
};

export default ListeResLeads;
