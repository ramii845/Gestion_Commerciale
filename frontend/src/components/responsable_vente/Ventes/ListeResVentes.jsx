import React, { useEffect, useState } from "react";
import { getPaginatedVentes, addVente, updateVente } from "../../services/venteService";
import { getUsersPaginated } from "../../services/authService";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import "../../css/ListeVentes.css";
import { FaEdit } from "react-icons/fa";
import SidebarMenuResponsable from "../SidebarMenuResponsable";

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const getStatutClass = (statut) => {
  if (!statut) return "";
  return `statut-${statut.toLowerCase()}`;
};
const modelesParMarque = {
  Peugeot: ['LANDTREK', 'EXPERT', 'Boxer', 'Traveller', '208', '301', '2008', '308', '3008', '508', '5008', 'Rifter', 'Partner'],
  Citroen: ['C3 POPULAIRE', 'JUMPY FOURGON', 'Berlingo', 'BERLINGO VAN', 'C4 X', 'Jumper'],
  Opel: ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland', 'COMBO CARGO'],
  Autre: ['Autre']
};

const ListResPromesse = () => {
  const [ventes, setVentes] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [filterMatricule, setFilterMatricule] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newVente, setNewVente] = useState(null);
  const [modelesDisponibles, setModelesDisponibles] = useState([]);
  const [filterStatut, setFilterStatut] = useState("");



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersPaginated(1, 1000);
        const usersData = res.data.users || res.data;
        const map = {};
            usersData.forEach((u) => {
          map[u.id || u._id] = {
            nom: u.nom,
            photo: u.photo // ou u.image selon ton backend
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

const fetchVentes = async () => {
  try {
    const res = await getPaginatedVentes(page, 14, filterStatut, filterMatricule);
    setVentes(res.data.ventes);
    setTotalPages(res.data.total_pages);
  } catch {
    toast.error("Erreur chargement ventes");
  }
};

useEffect(() => {
  fetchVentes();
}, [page, filterMatricule, filterStatut]);



  useEffect(() => {
    if (userId) fetchVentes();
  }, [page, filterMatricule, userId]);

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    if (id === "new") {
      setNewVente((prev) => ({ ...prev, [name]: value }));
    } else {
      setVentes((prev) =>
        prev.map((v) => (v.id === id ? { ...v, [name]: value } : v))
      );
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewVente(null);
  };

  const handleSave = async (id) => {
    try {
      const venteToUpdate = ventes.find((v) => v.id === id);
      await updateVente(id, { ...venteToUpdate, date_modification: new Date().toISOString() });
      toast.success("Vente modifiée");
      setEditingId(null);
      fetchVentes();
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleAddRow = () => {
    setNewVente({
      marque: "",
      modele: "",
      matricule: "",
      matriculation: "",
      nom_client: "",
      tel_client: "",
      commentaire: "",
      statut: "",
      date_creation: new Date().toISOString(),
      user_id: userId
    });
  };
  useEffect(() => {
  if (editingId) {
    const vente = ventes.find(v => v.id === editingId);
    if (vente?.marque && modelesParMarque[vente.marque]) {
      setModelesDisponibles(modelesParMarque[vente.marque]);
    } else {
      setModelesDisponibles([]);
    }
  } else if (newVente?.marque && modelesParMarque[newVente.marque]) {
    setModelesDisponibles(modelesParMarque[newVente.marque]);
  } else {
    setModelesDisponibles([]);
  }
}, [newVente?.marque, editingId, ventes]);


  const handleAdd = async () => {
    try {
      await addVente(newVente);
      toast.success("Vente ajoutée");
      setNewVente(null);
      fetchVentes();
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const onPrev = () => setPage((p) => Math.max(p - 1, 1));
  const onNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <>
      <Navbar />
      <SidebarMenuResponsable/>
      <div className="liste-ventes-container">
        <div className="liste-ventes-header">
          <h2 style={{ textAlign: "center", flexGrow: 1 }}>Mes ventes</h2>
          <button className="btn-ajout-ventes" onClick={handleAddRow}>
            Ajouter
          </button>
        </div>

        <div className="filter-container">
           <select
    value={filterStatut}
    onChange={(e) => {
      setFilterStatut(e.target.value);
      setPage(1); // Remet la pagination à la page 1 quand on filtre
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
              <th>Matriculation</th>
              <th>Commentaire</th>
              <th>Statut</th>
              <th>Date création</th>
              <th>Date modification</th>
              <th>Action</th>
            </tr>
          </thead>
         <tbody>
  {newVente && (
    <tr>
      <td>{usersMap[newVente.user_id]}</td>
      <td>
        <input name="nom_client" value={newVente.nom_client} onChange={(e) => handleChange(e, "new")} />
      </td>
      <td>
        <input name="tel_client" type="number"  min="19999999" max="99999999" minLength={8} maxLength={8} value={newVente.tel_client} onChange={(e) => handleChange(e, "new")} />
      </td>
      <td>
    <select name="marque" value={newVente.marque} onChange={(e) => handleChange(e, "new")}>
  <option value="">--</option>
  {Object.keys(modelesParMarque).map((marque) => (
    <option key={marque} value={marque}>{marque}</option>
  ))}
</select>

      </td>
      <td>
      <select name="modele" value={newVente.modele} onChange={(e) => handleChange(e, "new")}>
  <option value="">--</option>
  {modelesDisponibles.map((modele) => (
    <option key={modele} value={modele}>{modele}</option>
  ))}
</select>

      </td>
      <td>
        <input
          name="matricule"
          value={newVente.matricule}
          onChange={(e) => handleChange(e, "new")}
          disabled={newVente.statut !== "Commande"}
        />
      </td>
      <td>
        <input
          name="matriculation"
          value={newVente.matriculation}
          onChange={(e) => handleChange(e, "new")}
          disabled={newVente.statut !== "Commande"}
        />
      </td>
      <td>
        <input name="commentaire" value={newVente.commentaire} onChange={(e) => handleChange(e, "new")} />
      </td>
      
      <td >
        <select name="statut" value={newVente.statut} onChange={(e) => handleChange(e, "new")}>
          <option value="">--</option>
          <option>Prospection</option>
          <option>Devis</option>
          <option>Commande</option>
          <option>Facturation</option>
          <option>Livraison</option>
          <option>Blocage</option>
          <option>Relance</option>
        </select>
      </td>
      <td>-</td>
      <td>-</td>
      <td>
        <button className="enregister" onClick={handleAdd}>Enregistrer</button>
        <button  className="anuuler"onClick={handleCancel}>Annuler</button>
      </td>
    </tr>
  )}
  {ventes.length > 0 ? (
    ventes.map((v) => (
      <tr key={v.id} >
          <td>
    {usersMap[v.user_id]?.photo ? (
      <img
        src={usersMap[v.user_id].photo}
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
                   <td>{usersMap[v.user_id]?.nom || "Inconnu"}</td>
        {editingId === v.id ? (
          <>
            <td>
              <input name="nom_client" value={v.nom_client} onChange={(e) => handleChange(e, v.id)} />
            </td>
            <td>
              <input name="tel_client" type="number"  min="19999999" max="99999999" minLength={8} maxLength={8} value={v.tel_client} onChange={(e) => handleChange(e, v.id)} />
            </td>
            <td>
             <select name="marque" value={v.marque} onChange={(e) => handleChange(e, v.id)}>
  <option value="">--</option>
  {Object.keys(modelesParMarque).map((marque) => (
    <option key={marque} value={marque}>{marque}</option>
  ))}
</select>

            </td>
            <td>
             <select name="modele" value={v.modele} onChange={(e) => handleChange(e, v.id)}>
  <option value="">--</option>
  {modelesDisponibles.map((modele) => (
    <option key={modele} value={modele}>{modele}</option>
  ))}
</select>

            </td>
            <td>
              <input
                name="matricule"
                value={v.matricule}
                onChange={(e) => handleChange(e, v.id)}
                disabled={v.statut !== "Livraison"}
              />
            </td>
            <td>
              <input
                name="matriculation"
                value={v.matriculation}
                onChange={(e) => handleChange(e, v.id)}
                disabled={v.statut !== "Livraison"}
              />
            </td>
            <td>
              <input name="commentaire" value={v.commentaire} onChange={(e) => handleChange(e, v.id)} />
            </td>
            <td className={getStatutClass(v.statut)}>
              <select name="statut" value={v.statut} onChange={(e) => handleChange(e, v.id)}>
                <option value="">--</option>
                <option>Prospection</option>
                <option>Devis</option>
                <option>Commande</option>
                <option>Facturation</option>
                <option>Livraison</option>
                <option>Blocage</option>
                <option>Relance</option>
              </select>
            </td>
            <td>
              {v.date_creation
                ? new Date(v.date_creation).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
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
                    minute: "2-digit",
                  })
                : "-"}
            </td>
            <td>
              <button className="enregister" onClick={() => handleSave(v.id)}>Enregistrer</button>
              <button className="anuuler" onClick={handleCancel}>Annuler</button>
            </td>
          </>
        ) : (
          <>
            <td>{v.nom_client}</td>
            <td>{v.tel_client}</td>
            <td>{v.marque}</td>
            <td>{v.modele}</td>
            <td>{v.matricule}</td>
            <td>{v.matriculation}</td>
            <td>{v.commentaire || "-"}</td>
            <td className={getStatutClass(v.statut)}>{v.statut || "-"}</td>  {/* <-- ici */}
            <td>
              {v.date_creation
                ? new Date(v.date_creation).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
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
                    minute: "2-digit",
                  })
                : "-"}
            </td>
            <td>
                       <button className="btn-modf" onClick={() => handleEdit(v.id)} title="Modifier">
              <FaEdit/>
            </button>
            </td>
          </>
        )}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={13} className="empty-row">
        Aucune vente trouvée.
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

export default ListResPromesse;
