import React, { useEffect, useState } from "react";
import { getPaginatedPromesses } from "../../services/promesseService";
import { getUsersPaginated } from "../../services/authService";
import { toast } from "react-toastify";
import '../../css/ListPromesses.css';
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import { FaEdit } from "react-icons/fa";
import SidebarMenuResponsable from "../SidebarMenuResponsable";

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

const ListResPromesse = () => {
  const [promesses, setPromesses] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [filterMatricule, setFilterMatricule] = useState("");
  const [filterMois, setFilterMois] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
   const navigate = useNavigate();

  // Charger utilisateurs au montage (pas besoin à chaque page)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await getUsersPaginated(1, 1000);
        const usersData = usersResponse.data.users || usersResponse.data;
        const map = {};
             usersData.forEach((u) => {
          map[u.id || u._id] = {
            nom: u.nom,
            photo: u.photo // ou u.image selon ton backend
          };
        });
        setUsersMap(map);
      } catch (error) {
        toast.error("Erreur chargement utilisateurs");
      }
    };
    fetchUsers();
  }, []);

  // Charger userId du token au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJWT(token);
      setUserId(decoded?.user_id || null);
    }
  }, []);

  // Charger promesses à chaque changement page ou filtre ou userId
 useEffect(() => {
  const fetchPromesses = async () => {
    try {
      const res = await getPaginatedPromesses(page, 7, "", "", filterMatricule, "", "", filterMois);
      setPromesses(res.data.promesses);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      toast.error("Erreur chargement promesses");
    }
  };

  fetchPromesses();
}, [page, filterMatricule,filterMois]);
  // Pagination controls
  const onPrev = () => setPage(p => Math.max(p - 1, 1));
  const onNext = () => setPage(p => Math.min(p + 1, totalPages));

  return (
    <>
      <Navbar />
        <SidebarMenuResponsable/>
      <div className="list-promesse-container" >
        <div className="list-promesse-header" >
          <h2 className="list-promesse-title">Liste des promesses</h2>
             <button className="ajouter" onClick={() => navigate('/add-promesse-res')}>Ajouter</button>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label htmlFor="filterMatricule" style={{ marginRight: 10, fontWeight: "600" }}></label>
          <input
            type="text"
            id="filterMatricule"
            value={filterMatricule}
            onChange={e => { setPage(1); setFilterMatricule(e.target.value); }}
            placeholder="matricule"
            style={{ padding: 6, width: 200 }}
          />
                 <select className="filterMois"
    value={filterMois || ""}
    onChange={(e) => setFilterMois(e.target.value ? parseInt(e.target.value) : "")}
    style={{ padding: 6, marginLeft: 10 }}
  >
    <option value="">-- Tous les mois --</option>
    {[...Array(12).keys()].map((m) => (
      <option key={m+1} value={m+1}>{m+1}</option>
    ))}
  </select>
        </div>

        <table>
  <thead>
  <tr>
    <th>Image</th>
    <th>Commercial</th>
    <th>Marque</th>
    <th>Modèle</th>
    <th>Matricule</th>
    <th>Promesse</th>
    <th>Société</th>
    <th>Service concerné</th>
    <th>Frais</th>
    <th>Actions</th>
  </tr>
</thead>

          <tbody>
            {promesses.length > 0 ? (
              promesses.map((promesse) => (
                <tr key={promesse.id || promesse._id}>
                  <td>
    {usersMap[promesse.user_id]?.photo ? (
      <img
        src={usersMap[promesse.user_id].photo}
        alt="photo utilisateur"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />
    ) : (
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "#ccc"
      }} />
    )}
  </td>
                   <td>{usersMap[promesse.user_id]?.nom || "Inconnu"}</td>
                  <td>{promesse.marque}</td>
                  <td>{promesse.modele}</td>
                  <td>{promesse.matricule}</td>
                  <td>{promesse.promesse}</td>
          <td>{promesse.societe || '-'}</td>
           <td>{promesse.service_concerne || '-'}</td>
                 <td>{promesse.frais} DT</td>
                   <button className="btnEdit"
            onClick={() => navigate(`/edit-res-promesse/${promesse.id || promesse._id}`)}
          >
            <FaEdit/>
          </button>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                  Aucune promesse trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination" >
          <button onClick={onPrev} disabled={page === 1}>←</button>
          <span>{page} / {totalPages}</span>
          <button onClick={onNext} disabled={page === totalPages}>→</button>
        </div>
      </div>
    </>
  );
};

export default ListResPromesse;
