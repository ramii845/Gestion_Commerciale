import React, { useState, useEffect } from "react";
import { addVente } from "../../services/venteService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import { toast } from "react-toastify";
import "../../css/AddVente.css";

const modelesParMarque = {
  Peugeot: ['LANDTREK', 'EXPERT', 'Boxer', 'Traveller', '208', '301', '2008', '308', '3008', '508', '5008', 'Rifter', 'Partner'],
  Citroen: ['C3 POPULAIRE', 'JUMPY FOURGON', 'Berlingo', 'BERLINGO VAN', 'C4 X', 'Jumper'],
  Opel: ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland', 'COMBO CARGO'],
  Autre: ['Autre']
};

const statuts = [
  'Prospection',
  'Devis',
  'Commande',
  'Facturation',
  'Livraison',
  'Blocage',
  'Relance'
];

const AddVente = () => {
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    matricule: '',
    nom_client: '',
    tel_client: '',
    commentaire: '',
    statut: '',
  });

  const [modeles, setModeles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const parsed = JSON.parse(jsonPayload);
        setFormData((prev) => ({ ...prev, user_id: parsed.user_id }));
      } catch {
        // ignore erreur décodage
      }
    }
  }, []);

  useEffect(() => {
    if (formData.marque && modelesParMarque[formData.marque]) {
      setModeles(modelesParMarque[formData.marque]);
      if (!modelesParMarque[formData.marque].includes(formData.modele)) {
        setFormData((prev) => ({ ...prev, modele: '' }));
      }
    } else {
      setModeles([]);
      setFormData((prev) => ({ ...prev, modele: '' }));
    }
  }, [formData.marque]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Pour tel_client, ne garder que les chiffres et limiter à 8 caractères
    if (name === "tel_client") {
      const numericValue = value.replace(/\D/g, '').slice(0, 8);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "matricule") {
      setFormData((prev) => ({ ...prev, [name]: value.slice(0, 9) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.marque || !formData.modele || !formData.matricule || !formData.nom_client || !formData.statut) {
      toast.warning("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (formData.matricule.length < 8 || formData.matricule.length > 9) {
      toast.warning("Le matricule doit contenir entre 8 et 9 caractères.");
      return;
    }

    if (formData.tel_client && formData.tel_client.length !== 8) {
      toast.warning("Le téléphone doit contenir exactement 8 chiffres.");
      return;
    }

    try {
      await addVente(formData);
      toast.success("Vente ajoutée avec succès !");
      navigate("/commerciale/ventes");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la vente.");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-vente-container" style={{ marginTop: "100px", padding: "20px" }}>
        <h2>Ajouter une vente</h2>
        <form onSubmit={handleSubmit} className="add-vente-form">

          <label>
            Marque*:
            <select name="marque" value={formData.marque} onChange={handleChange} required>
              <option value="">-- Sélectionnez une marque --</option>
              {Object.keys(modelesParMarque).map((marque) => (
                <option key={marque} value={marque}>{marque}</option>
              ))}
            </select>
          </label>

          <label>
            Modèle*:
            <select
              name="modele"
              value={formData.modele}
              onChange={handleChange}
              required
              disabled={modeles.length === 0}
            >
              <option value="">-- Sélectionnez un modèle --</option>
              {modeles.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label>
            Matricule*:
            <input
              type="text"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={9}
              placeholder="Ex: 1234TU56"
            />
          </label>

          <label>
            Nom du client*:
            <input
              type="text"
              name="nom_client"
              value={formData.nom_client}
              onChange={handleChange}
              required
              placeholder="Nom du client"
            />
          </label>

          <label>
            Téléphone du client:
            <input
              type="number"
              name="tel_client"
              value={formData.tel_client}
              onChange={handleChange}
              placeholder="8 chiffres"
              min="0"
              max="99999999"
            />
          </label>

          <label>
            Commentaire:
            <textarea
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              placeholder="Commentaire"
            />
          </label>

          <label>
            Statut*:
            <select name="statut" value={formData.statut} onChange={handleChange} required>
              <option value="">-- Sélectionnez un statut --</option>
              {statuts.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <button type="submit" style={{ marginTop: "15px" }}>Ajouter</button>
        </form>
      </div>
    </>
  );
};

export default AddVente;
