import React, { useEffect, useState } from "react";
import { getPaginatedArchives, deleteArchive } from "../../services/archiveVenteService";
import { getUsersPaginated } from "../../services/authService";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import "../../css/ListeVentes.css";
import { FaTrash } from "react-icons/fa";
import SidebarMenuAdmin from "../SidebarMenuAdmin";

const getStatutClass = (statut) => {
  if (!statut) return "";
  return `statut-${statut.toLowerCase()}`;
};

const ListeArchiveVentes = () => {
  const [ventes, setVentes] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [filterStatut, setFilterStatut] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [venteToDelete, setVenteToDelete] = useState(null);

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

  const fetchVentes = async () => {
    try {
      const res = await getPaginatedArchives(page, 14, filterStatut);
      setVentes(res.data.archives);
      setTotalPages(res.data.total_pages);
    } catch {
      toast.error("Erreur chargement ventes");
    }
  };

  useEffect(() => {
    fetchVentes();
  }, [page, filterStatut]);

  const onPrev = () => setPage((p) => Math.max(p - 1, 1));
  const onNext = () => setPage((p) => Math.min(p + 1, totalPages));

  const confirmDelete = (vente) => {
    setVenteToDelete(vente);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setVenteToDelete(null);
    setShowConfirm(false);
  };

  const handleDelete = async () => {
    if (!venteToDelete) return;
    try {
      await deleteArchive(venteToDelete.id);
      toast.success("Vente supprimée avec succès !");
      setVentes((prev) => prev.filter((v) => v.id !== venteToDelete.id));
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setVenteToDelete(null);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Navbar />
      <SidebarMenuAdmin />
      <div className="liste-ventes-container">
        <div className="liste-ventes-header">
          <h2 style={{ textAlign: "center", flexGrow: 1 }}>Liste Arrivées des Ventes</h2>
        </div>

        <div className="filter-container">
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
              <th>Accesoire</th>
              <th>Statut</th>
              <th>Date création</th>
              <th>Date modification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ventes.length > 0 ? (
              ventes.map((v) => (
                <tr key={v.id}>
                  <td>
                    {usersMap[v.user_id]?.photo ? (
                      <img
                        src={usersMap[v.user_id].photo}
                        alt="photo utilisateur"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: "#ccc",
                        }}
                      />
                    )}
                  </td>
                  <td>{usersMap[v.user_id]?.nom || "Inconnu"}</td>
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
                    <button
                      className="btnDelete"
                      onClick={() => confirmDelete(v)}
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
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

        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal-confirm">
              <h3>Confirmer la suppression</h3>
              <p>Voulez-vous vraiment supprimer cette vente ?</p>
              <div className="modal-buttons">
                <button className="btnCancel" onClick={cancelDelete}>
                  Annuler
                </button>
                <button className="btnConfirm" onClick={handleDelete}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

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

export default ListeArchiveVentes;
