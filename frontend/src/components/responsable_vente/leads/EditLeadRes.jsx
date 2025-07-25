import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLeadById, updateLead } from "../../services/leadsService";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import "../../css/EditLead.css";

const EditLeadRes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom_client: "",
    telephone: "",
    marque: "",
    besoin: "",
    affectation: "",
    relance: "",
    date_traitement: "",
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await getLeadById(id);
        const lead = res.data || res;
        setFormData({
          ...lead,
          relance: lead.relance ? lead.relance.slice(0, 16) : "",
          date_traitement: lead.date_traitement ? lead.date_traitement.slice(0, 16) : "",
        });
      } catch (error) {
        toast.error("Erreur lors du chargement du lead");
      }
    };

    fetchLead();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLead(id, formData);
      toast.success("Lead mis à jour avec succès");
      navigate("/responsable/leads");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du lead");
    }
  };

  return (
    <>
      <Navbar />
      <div className="edit-lead-container">
        <h2 className="edit-lead-title">Modifier le Lead</h2>
        <form onSubmit={handleSubmit} className="edit-lead-form">
          <label>Nom Client</label>
          <input type="text" name="nom_client" value={formData.nom_client} onChange={handleChange} required />

          <label>Téléphone</label>
          <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required />

          <label>Marque</label>
          <input type="text" name="marque" value={formData.marque} onChange={handleChange} />

          <label>Besoin</label>
          <input type="text" name="besoin" value={formData.besoin} onChange={handleChange} />

          <label>Affectation</label>
          <input type="text" name="affectation" value={formData.affectation} onChange={handleChange} />

          <label>Relance</label>
          <input type="datetime-local" name="relance" value={formData.relance} onChange={handleChange} />

          <label>Date Traitement</label>
          <input type="datetime-local" name="date_traitement" value={formData.date_traitement} onChange={handleChange} />

          <div className="button-group">
            <button type="submit" className="submit-btn">Enregistrer</button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/responsable/leads")}>Annuler</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditLeadRes;
