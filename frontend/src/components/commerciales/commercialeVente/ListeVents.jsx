import React, { useEffect, useState } from "react";
import { getPaginatedVentes, addVente, updateVente } from "../../services/venteService";
import { getUsersPaginated } from "../../services/authService";
import { addObjectif, getObjectifByUser } from "../../services/objectifService";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import "../../css/ListeVentes.css";
import { FaEdit } from "react-icons/fa";
import SidebarMenuCommercial from "../SidebarMenuCommercial";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  Peugeot: ['LANDTREK', ,'Landtrek Simple Cabine','Landtrek double Cabine','EXPERT', 'Boxer', 'Traveller', '208', '301', '2008', '308', '3008', '508', '5008', 'Rifter', 'Partner'],
  Citroen: ['C3 POPULAIRE', 'JUMPY FOURGON', 'Berlingo', 'BERLINGO VAN', 'C4 X', 'Jumper'],
  Opel: ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland', 'COMBO CARGO'],
};
const ListeVentes = () => {
  const [ventes, setVentes] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [filterStatut, setFilterStatut] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newVente, setNewVente] = useState(null);
  const [modelesDisponibles, setModelesDisponibles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [objectif, setObjectif] = useState({
    peugeot: "",
    citroen: "",
    opel: ""
  });
  const [objectifExistant, setObjectifExistant] = useState(null);
   const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersPaginated(1, 1000);
        const usersData = res.data.users || res.data;
        const map = {};
        usersData.forEach((u) => {
  map[u.id || u._id] = {
    nom: u.nom,
    photo: u.photo,
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
      // Appel API avec filtre statut et pagination
      const res = await getPaginatedVentes(page, 14, filterStatut, "");
      // Filtrer côté client uniquement pour user_id
      const filtered = res.data.ventes.filter((v) => v.user_id === userId);
      setVentes(filtered);
      setTotalPages(res.data.total_pages);
    } catch {
      toast.error("Erreur chargement ventes");
    }
  };

  useEffect(() => {
    if (userId) fetchVentes();
  }, [page, filterStatut, userId]);

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

  const handleEdit = (id) => setEditingId(id);
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
      accesoire:"",
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
  const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "iit2024G4");
  data.append("cloud_name", "ditzf19gl");
  setUploading(true);
  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/ditzf19gl/image/upload", {
      method: "POST",
      body: data,
    });
    const json = await res.json();
    setUploading(false);
    if (json.secure_url) return json.secure_url;
    else throw new Error("Échec de l’upload");
  } catch (error) {
    setUploading(false);
    toast.error("Erreur lors de l’upload de la photo");
    throw error;
  }
};
const exportToExcel = () => {
  if (ventes.length === 0) return;
  const data = ventes.map(v => ({
    Commercial: usersMap[v.user_id]?.nom || "Inconnu",
    Client: v.nom_client,
    Téléphone: v.tel_client,
    Marque: v.marque,
    Modèle: v.modele,
    Matricule: v.matricule,
    Matriculation: v.matriculation,
    Commentaire: v.commentaire || "",
    Accessoire: v.accesoire || "",
    Statut: v.statut || "",
    "Date création": v.date_creation ? new Date(v.date_creation).toLocaleString("fr-FR") : "",
    "Date modification": v.date_modification ? new Date(v.date_modification).toLocaleString("fr-FR") : ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ventes");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "ventes.xlsx");
};

  const onPrev = () => setPage((p) => Math.max(p - 1, 1));
  const onNext = () => setPage((p) => Math.min(p + 1, totalPages));
 useEffect(() => {
  if (userId) {
    const fetchObjectif = async () => {
      try {
        const res = await getObjectifByUser(userId);
        if (res.data?.objectifs?.length > 0) {
          const obj = res.data.objectifs[0]; // prendre le premier objectif
          setObjectifExistant(obj);
          setObjectif({
            peugeot: obj.peugeot,
            citroen: obj.citroen,
            opel: obj.opel,
            realise_peugeot: obj.realise_peugeot,
            realise_citroen: obj.realise_citroen,
            realise_opel: obj.realise_opel,
          });
        } else {
          setObjectifExistant(null); // aucun objectif trouvé
        }
      } catch (error) {
        console.log("Pas encore d’objectif pour cet utilisateur");
        setObjectifExistant(null);
      } finally {
        setLoading(false); // ⚠️ IMPORTANT
      }
    };
    fetchObjectif();
  }
}, [userId]);



const handleObjectifChange = (e) => {
  const { name, value } = e.target;
  setObjectif((prev) => ({ ...prev, [name]: Number(value) }));
};

const handleSaveObjectif = async () => {
  try {
    await addObjectif({ ...objectif, user_id: userId });
    toast.success("Objectif ajouté avec succès !");
    setObjectifExistant({ ...objectif, user_id: userId });
    setObjectif({ peugeot: "", citroen: "", opel: ""});
  } catch (err) {
    toast.error("Erreur lors de l’ajout de l’objectif");
  }
};

  return (
    <>
      <Navbar />
      <SidebarMenuCommercial/>
      <div className="objectif-container">
        <div className="objectif-box">
          <h3 className="objectif-title">🎯 Mon Objectif</h3>

        {loading ? (
  <p>Chargement...</p>
) : !objectifExistant ? (
  <>
    <div className="objectif-inputs">
      {["peugeot", "citroen", "opel"].map((marque) => (
        <div key={marque} className="objectif-field">
          <label>{marque.charAt(0).toUpperCase() + marque.slice(1)} :</label>
          <input
            type="number"
            name={marque}
            value={objectif[marque] || ""}
            onChange={handleObjectifChange}
            placeholder="0"
          />
        </div>
      ))}
    </div>
    <button className="objectif-btn" onClick={handleSaveObjectif}>
      Enregistrer
    </button>
  </>
) : (
  <table className="objectif-table">
    <thead>
      <tr>
        <th>Marque</th>
        <th>Objectif fixé</th>
      </tr>
    </thead>
    <tbody>
      {["peugeot", "citroen", "opel"].map((marque) => (
        <tr key={marque}>
          <td>{marque.charAt(0).toUpperCase() + marque.slice(1)}</td>
          <td>{objectifExistant[marque]}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

        </div>
      </div>
      <div className="liste-ventes-container">
        <div className="liste-ventes-header" style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ textAlign: "center", flexGrow: 1 }}>Mes ventes</h2>
          <button className="btn-ajout-ventes" onClick={handleAddRow}>Ajouter</button>
           <button className="btn-export" onClick={exportToExcel}>Exporter</button>
        </div>

        {/* Filtre par statut */}
        <div className="filter-container" style={{ marginBottom: "1rem" }}>
          <select
            value={filterStatut}
            onChange={(e) => {
              setFilterStatut(e.target.value);
              setPage(1);
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
              <th>Accessoire</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {newVente && (
              <tr>
               <td>
  {usersMap[newVente.user_id]?.photo ? (
    <img
      src={usersMap[newVente.user_id].photo}
      alt="photo utilisateur"
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        objectFit: "cover"
      }}
    />
  ) : (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "#ccc"
      }}
    />
  )}
</td>
      <td>{usersMap[newVente.user_id]?.nom || "Inconnu"}</td>
                <td>
                  <input name="nom_client" value={newVente.nom_client} onChange={(e) => handleChange(e, "new")} />
                </td>
                <td>
                  <input name="tel_client" type="number" min="19999999" max="99999999" value={newVente.tel_client} onChange={(e) => handleChange(e, "new")} />
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
                    disabled={newVente.statut !== "Livraison"}
                  />
                </td>
                <td>
                  <input
                    name="matriculation"
                    value={newVente.matriculation}
                    onChange={(e) => handleChange(e, "new")}
                    disabled={newVente.statut !== "Livraison"}
                  />
                </td>
                <td>
  <input 
    type="file" 
    accept="image/*"
    onChange={async (e) => {
      if (e.target.files && e.target.files[0]) {
        const url = await uploadToCloudinary(e.target.files[0]);
        handleChange({ target: { name: "commentaire", value: url } }, "new");
      }
    }}
  />
  {newVente.commentaire && (
    <img src={newVente.commentaire} alt="aperçu" style={{ width: 50, height: 50, objectFit: "cover" }} />
  )}
</td>

                <td>
  <select name="accesoire" value={newVente.accesoire} onChange={(e) => handleChange(e, "new")}>
    <option value="">--</option>
    <option value="Avec accessoire">Avec accessoire</option>
    <option value="Sans accessoire">Sans accessoire</option>
  </select>
</td>

                <td>
                  <select name="statut" value={newVente.statut} onChange={(e) => handleChange(e, "new")}>
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
                  <button className="anuuler" onClick={handleCancel}>Annuler</button>
                </td>
              </tr>
            )}

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
      alt="Commercial"
      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
    />
  ) : (
    <div style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#ccc"
    }} />
  )}
</td>
                     <td>{usersMap[v.user_id]?.nom || "Inconnu"}</td>
                  {editingId === v.id ? (
                    <>
                      <td><input name="nom_client" value={v.nom_client} onChange={(e) => handleChange(e, v.id)} /></td>
                      <td><input name="tel_client" type="number" min="19999999" max="99999999" value={v.tel_client} onChange={(e) => handleChange(e, v.id)} /></td>
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
                      <td><input name="matricule" value={v.matricule} onChange={(e) => handleChange(e, v.id)} disabled={v.statut !== "Commande"} /></td>
                      <td><input name="matriculation" value={v.matriculation} onChange={(e) => handleChange(e, v.id)} disabled={v.statut !== "Commande"} /></td>
                <td>
  <input 
    type="file" 
    accept="image/*"
    onChange={async (e) => {
      if (e.target.files && e.target.files[0]) {
        const url = await uploadToCloudinary(e.target.files[0]);
        handleChange({ target: { name: "commentaire", value: url } }, v.id);
      }
    }}
  />
  {v.commentaire && (
    <img src={v.commentaire} alt="aperçu" style={{ width: 50, height: 50, objectFit: "cover" }} />
  )}
</td>

                      <td>
  <select name="accesoire" value={v.accesoire} onChange={(e) => handleChange(e, v.id)}>
    <option value="">--</option>
    <option value="Avec accessoire">Avec accessoire</option>
    <option value="Sans accessoire">Sans accessoire</option>
  </select>
</td>

                      <td>
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
    <td style={{ textAlign: "center" }}>
  {v.commentaire ? (
    <a
      href={v.commentaire}
      target="_blank"
      rel="noopener noreferrer"
      title="Image commentaire"
      className="doc-link"
      style={{ display: "block" }}
    >
    Image

    </a>
  ) : (
    "-"
  )}
</td>

                      <td>{v.accesoire || "-"}</td>
                      <td className={getStatutClass(v.statut)}>{v.statut || "-"}</td>
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
                <td colSpan={13} className="empty-row">Aucune vente trouvée.</td>
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

export default ListeVentes;
