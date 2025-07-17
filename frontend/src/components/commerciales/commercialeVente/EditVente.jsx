import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVenteById, updateVente } from "../../services/venteService";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import "../../css/EditVente.css";

const EditVente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vente, setVente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVente = async () => {
      try {
        const response = await getVenteById(id);
        setVente(response.data);
      } catch (err) {
        toast.error("Erreur lors du chargement de la vente.");
      } finally {
        setLoading(false);
      }
    };

    fetchVente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple avant soumission
    if (!vente.nom_client || !vente.statut) {
      toast.warning("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const updatedVente = {
        ...vente,
        date_modification: new Date().toISOString(),
      };
      await updateVente(id, updatedVente);
      toast.success("Vente mise à jour avec succès !");
      navigate("/commerciale/ventes");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const handleCancel = () => {
    navigate("/commerciale/ventes");
  };

  if (loading) return <p>Chargement...</p>;
  if (!vente) return <p>Aucune donnée.</p>;

  return (
    <>
      <Navbar />

      <div className="edit-vente-container">
        <h2>Modifier une vente</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Client <span className="required">*</span> :</label>
            <input
              type="text"
              name="nom_client"
              value={vente.nom_client || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Marque :</label>
            <input
              type="text"
              name="marque"
              value={vente.marque || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Modèle :</label>
            <input
              type="text"
              name="modele"
              value={vente.modele || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Matricule :</label>
            <input
              type="text"
              name="matricule"
              value={vente.matricule || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Statut <span className="required">*</span> :</label>
            <select
              name="statut"
              value={vente.statut || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner --</option>
              <option value="Prospection">Prospection</option>
              <option value="Devis">Devis</option>
              <option value="Commande">Commande</option>
              <option value="Facturation">Facturation</option>
              <option value="Livraison">Livraison</option>
              <option value="Blocage">Blocage</option>
              <option value="Relance">Relance</option>
            </select>
          </div>

          <div className="buttons-container">
            <button type="submit" className="btn btn-primary">Enregistrer</button>
  <button type="button" onClick={handleCancel} className="btn btn-cancel">Annuler</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditVente;
