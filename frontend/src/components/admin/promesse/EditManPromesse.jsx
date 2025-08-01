import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPromesseById, updatePromesse } from "../../services/promesseService";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import "../../css/AddPromesse.css"; // même style que l'ajout

const modelesParMarque = {
  Peugeot: ['LANDTREK', 'EXPERT', 'Boxer', 'Traveller', '208', '301', '2008', '308', '3008', '508', '5008', 'Rifter', 'Partner'],
  Citroen: ['C3 POPULAIRE', 'JUMPY FOURGON', 'Berlingo', 'BERLINGO VAN', 'C4 X', 'Jumper'],
  Opel: ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland', 'COMBO CARGO'],
  Honda: ['Honda City LX', 'Honda Jazz', 'Honda HR-V EX', 'Honda ZRV', 'Honda Civic', 'Honda Accord', 'Honda CR-V', 'Honda Civic'],
  Autre: ['Autre']
};

const EditManPromesse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchPromesse = async () => {
      try {
        const res = await getPromesseById(id);
        const data = res.data;
        setForm({
          ...data,
          frais: data.frais ?? "", // éviter null
        });
      } catch (error) {
        toast.error("Erreur lors du chargement de la promesse");
        navigate("/manager/promesses");
      }
    };
    fetchPromesse();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Uppercase automatique pour le matricule
    if (name === "matricule") {
      setForm(prev => ({ ...prev, [name]: value.toUpperCase() }));
      return;
    }

    // Réinitialiser modèle si la marque change
    if (name === "marque") {
      setForm(prev => ({ ...prev, marque: value, modele: "" }));
      return;
    }

    // Convertir les frais en float
    if (name === "frais") {
      setForm(prev => ({ ...prev, [name]: parseFloat(value) || "" }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple
    if (!form.marque || !form.modele || !form.matricule || !form.promesse) {
      toast.warning("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);
      await updatePromesse(id, form);
      toast.success("Promesse mise à jour avec succès !");
      navigate("/manager/promesses");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-promesse-container">
        <h2>Modifier la Promesse</h2>
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
            <select name="societe" value={form.societe} onChange={handleChange} required>
              <option value="">-- Sélectionnez une société --</option>
              <option value="STAFIM">STAFIM</option>
              <option value="AUTO-LION">AUTO-LION</option>
            </select>
          </div>

          <div className="form-group">
            <label>Service Concerné</label>
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
              name="frais"
              min="0"
              step="0.01"
              value={form.frais}
              onChange={handleChange}
            />
          </div>

          <div className="button-wrapper">
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Chargement..." : "Modifier"}
            </button>
            <button
              className="submit-retour"
              type="button"
              onClick={() => navigate("/manager/promesses")}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditManPromesse;
