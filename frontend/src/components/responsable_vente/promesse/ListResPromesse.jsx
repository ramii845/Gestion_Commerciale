import React, { useEffect, useState } from "react";
import { getPaginatedPromesses } from "../../services/promesseService";
import { getUsersPaginated } from "../../services/authService";
import { toast } from "react-toastify";
import '../../css/ListPromesses.css';
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";

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
          map[u.id || u._id] = u.nom;
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
      const res = await getPaginatedPromesses(page, 7, "", "", filterMatricule);
      setPromesses(res.data.promesses);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      toast.error("Erreur chargement promesses");
    }
  };

  fetchPromesses();
}, [page, filterMatricule]);
  // Pagination controls
  const onPrev = () => setPage(p => Math.max(p - 1, 1));
  const onNext = () => setPage(p => Math.min(p + 1, totalPages));

  return (
    <>
      <Navbar />
      <div className="list-promesse-container" >
        <div className="list-promesse-header" >
          <h2 className="list-promesse-title">Liste des promesses</h2>
             <button onClick={() => navigate('/add-promesse-res')}>Ajouter</button>
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
        </div>

        <table>
  <thead>
  <tr>
    <th>Commercial</th>
    <th>Marque</th>
    <th>Modèle</th>
    <th>Matricule</th>
    <th>Promesse</th>
    <th>Société</th>
    <th>Service concerné</th>
    <th>Frais</th>
  </tr>
</thead>

          <tbody>
            {promesses.length > 0 ? (
              promesses.map((promesse) => (
                <tr key={promesse.id || promesse._id}>
                  <td>{usersMap[promesse.user_id] || "Inconnu"}</td>
                  <td>{promesse.marque}</td>
                  <td>{promesse.modele}</td>
                  <td>{promesse.matricule}</td>
                  <td>{promesse.promesse}</td>
          <td>{promesse.societe || '-'}</td>
           <td>{promesse.service_concerne || '-'}</td>
                 <td>{promesse.frais} DT</td>

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
