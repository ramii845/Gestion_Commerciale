import React, { useState } from "react";
import { createLead } from "../../services/leadsService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import '../../css/AddLead.css';

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erreur décodage JWT :", e);
    return null;
  }
};

const AddManLead = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom_client: "",
    besoin: "",
    affectation: "Non Affecté",
    telephone: "",
    marque: "",
    date_creation: "",
    date_traitement: "",
    relance: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom_client || !formData.besoin || !formData.date_creation || !formData.date_traitement || !formData.marque || !formData.relance) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (new Date(formData.date_traitement) <= new Date(formData.date_creation)) {
      toast.warning("La date de traitement doit être postérieure à la date de création.");
      return;
    }

    if (new Date(formData.relance) <= new Date(formData.date_traitement)) {
      toast.warning("La date de relance doit être postérieure à la date de traitement.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = decodeJWT(token);
      const user_id = decoded?.user_id;

      if (!user_id) {
        toast.error("Utilisateur non authentifié");
        return;
      }

      await createLead({
        ...formData,
        user_id,
      });

      toast.success("Lead ajouté avec succès !");
      navigate("/responsable/leads");
    } catch (err) {
      toast.error("Erreur lors de l'ajout du lead.");
    }
  };

  return (
    <div className="add-lead-container">
      <h2>Ajouter un Lead</h2>
      <form onSubmit={handleSubmit}>
        <label>Date de création*</label>
        <input
          type="datetime-local"
          name="date_creation"
          value={formData.date_creation}
          onChange={handleChange}
          required
        />

        <label>Nom Client*</label>
        <input
          type="text"
          name="nom_client"
          value={formData.nom_client}
          onChange={handleChange}
          required
        />

        <label>Telephone*</label>
        <input
          type="number"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />

        <label>Marque*</label>
        <select
          name="marque"
          value={formData.marque}
          onChange={handleChange}
          required
        >
          <option value="">-- Choisir une marque --</option>
          <option value="Peugeot">Peugeot</option>
          <option value="Citroen">Citroen</option>
          <option value="Opel">Opel</option>
        </select>

        <label>Besoin*</label>
        <input
          type="text"
          name="besoin"
          value={formData.besoin}
          onChange={handleChange}
          required
        />

        <label>Date de traitement*</label>
        <input
          type="datetime-local"
          name="date_traitement"
          value={formData.date_traitement}
          onChange={handleChange}
          required
        />

        <label>Affectation</label>
        <select
          name="affectation"
          value={formData.affectation}
          onChange={handleChange}
        >
          <option value="Affecté">Affecté</option>
          <option value="Non Affecté">Non Affecté</option>
        </select>

        <label>Relance*</label>
        <input
          type="datetime-local"
          name="relance"
          value={formData.relance}
          onChange={handleChange}
          required
        />

        <button type="submit" style={{ marginTop: 20 }}>
          Ajouter
        </button>
            <button
    className="submit-retour"
    type="button"
    onClick={() => navigate('/responsable/leads')}
  >
    Retour
  </button>
      </form>
    </div>
  );
};

export default AddManLead;
