import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { createPromesse } from "../../services/promesseService";
import '../../css/AddPromesse.css';
import Navbar from "../../Navbar/Navbar";
import SidebarMenuAdmin from "../SidebarMenuAdmin";

const 
AddManPromesse = () => {
  const navigate = useNavigate();

  const modelesParMarque = {
    Peugeot: ['LANDTREK', 'EXPERT', 'Boxer', 'Traveller', '208', '301', '2008', '308', '3008', '508', '5008', 'Rifter', 'Partner'],
    Citroen: ['C3 POPULAIRE', 'JUMPY FOURGON', 'Berlingo', 'BERLINGO VAN', 'C4 X', 'Jumper'],
    Opel: ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland', 'COMBO CARGO'],
    Honda:['Honda City LX','Honda Jazz','Honda HR-V EX','Honda ZRV','Honda Civic','Honda Accord','Honda CR-V','Honda Civic'],
    Autre: ['Autre']
  };

 const [form, setForm] = useState({
  marque: "",
  modele: "",
  matricule: "",
  promesse: "",
  societe: "",
  service_concerne: "",
  frais: ""
});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Pour matricule on peut appliquer une mise en majuscule et format simple
    if (name === "matricule") {
      let val = value.toUpperCase();
      // Optionnel : ici tu peux ajouter un filtre de format spécifique
      setForm(prev => ({ ...prev, [name]: val }));
      return;
    }

    // Si on change marque, on reset modele
    if (name === "marque") {
      setForm(prev => ({ ...prev, marque: value, modele: "" }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple
    if (!form.marque) {
      toast.warning("Veuillez sélectionner une marque");
      return;
    }
    if (!form.modele) {
      toast.warning("Veuillez sélectionner un modèle");
      return;
    }
    if (!form.matricule) {
      toast.warning("Veuillez saisir un matricule");
      return;
    }
    if (!form.promesse) {
      toast.warning("Veuillez saisir une promesse");
      return;
    }
   if (form.frais && isNaN(parseFloat(form.frais))) {
  toast.warning("Le montant des frais doit être un nombre");
  return;
}


    setLoading(true);

    // Préparation des données
    // Ajouter user_id depuis token localStorage si besoin, ou backend peut gérer ça
    const token = localStorage.getItem("token");
    let userId = null;
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
        userId = JSON.parse(jsonPayload).user_id;
      } catch {
        // ignore erreur
      }
    }

    try {
     await createPromesse({
  marque: form.marque,
  modele: form.modele,
  matricule: form.matricule,
  promesse: form.promesse,
  societe: form.societe,
  service_concerne: form.service_concerne,
  frais: form.frais ? parseFloat(form.frais) : undefined,
  user_id: userId,
});

      toast.success("Promesse créée avec succès !");
      setTimeout(() => navigate("/manager/promesses"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de la création de la promesse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
       <SidebarMenuAdmin/>
    <div className="add-promesse-container" >
      <h2>Ajouter une promesse</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Marque</label>
          <select name="marque" value={form.marque} onChange={handleChange} required>
            <option value="">-- Sélectionnez une marque --</option>
            {Object.keys(modelesParMarque).map((marque) => (
              <option key={marque} value={marque}>{marque}</option>
            ))}
          </select>
        </div>

        {form.marque && (
          <div className="form-group">
            <label>Modèle</label>
            <select name="modele" value={form.modele} onChange={handleChange} required>
              <option value="">-- Sélectionnez un modèle --</option>
              {modelesParMarque[form.marque].map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Matricule</label>
          <input
            type="text"
            name="matricule"
            value={form.matricule}
            onChange={handleChange}
            placeholder="Ex: 0000TU000"
            required
          />
        </div>

        <div className="form-group">
          <label>Promesse</label>
          <input
            type="text"
            name="promesse"
            value={form.promesse}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
  <label>Société</label>
<select
  name="societe"
  value={form.societe}
  onChange={handleChange}
  required
>
  <option value="">-- Sélectionnez une société --</option>
  <option value="STAFIM">STAFIM</option>
  <option value="AUTO-LION">AUTO-LION</option>
</select>

</div>

<div className="form-group">
  <label>Service concerné</label>
  <input
    type="text"
    name="service_concerne"
    value={form.service_concerne}
    onChange={handleChange}
    required
  />
</div>

        <div className="form-group">
          <label>Frais (DT)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="frais"
            value={form.frais}
            onChange={handleChange}
          />
        </div>

       <div className="button-wrapper">
  <button className="submit-btn" type="submit">Ajouter la promesse</button>
    <button
    className="submit-retour"
    type="button"
    onClick={() => navigate("/manager/promesses")}
  >
    Retour
  </button>
</div>

      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </>
  );
};




export default 
AddManPromesse;
