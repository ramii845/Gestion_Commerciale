import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPromesseById, updatePromesse } from "../../services/promesseService";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import "../../css/AddLead.css"; // tu peux réutiliser le même style
import SidebarMenuCommercial from "../SidebarMenuCommercial";

const EditPromesse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    marque: "",
    modele: "",
    matricule: "",
    promesse: "",
    societe: "",
    service_concerne: "",
    frais: 0,
  });

  useEffect(() => {
    const fetchPromesse = async () => {
      try {
        const res = await getPromesseById(id);
        setFormData(res.data);
      } catch (error) {
        toast.error("Erreur lors du chargement de la promesse");
        navigate("/list-promesse"); // redirection si erreur
      }
    };
    fetchPromesse();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "frais" ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePromesse(id, formData);
      toast.success("Promesse mise à jour avec succès !");
      navigate("/commerciale/promesses");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <>
      <Navbar />
       <SidebarMenuCommercial/>
      <div className="add-lead-container">
        <h2>Modifier la Promesse</h2>
        <form onSubmit={handleSubmit}>
          <label>Marque</label>
          <input type="text" name="marque" value={formData.marque} onChange={handleChange} disabled/>

          <label>Modèle</label>
          <input type="text" name="modele" value={formData.modele} onChange={handleChange} disabled />

          <label>Matricule</label>
          <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} disabled />

          <label>Promesse</label>
          <input type="text" name="promesse" value={formData.promesse} onChange={handleChange} disabled/>

          <label>Société</label>
          <input type="text" name="societe" value={formData.societe} onChange={handleChange} disabled/>

          <label>Service Concerné</label>
          <input type="text" name="service_concerne" value={formData.service_concerne} onChange={handleChange} disabled/>

          <label>Frais (DT)</label>
          <input type="number" step="0.01" name="frais" value={formData.frais} onChange={handleChange} />

          <button type="submit" style={{ marginTop: 20 }}>Modifier</button>
          <button
          className="submit-retourr"
            type="button"
            style={{ marginLeft: 10 }}
            onClick={() => navigate("/commerciale/promesses")}
          >
            Annuler
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPromesse;
