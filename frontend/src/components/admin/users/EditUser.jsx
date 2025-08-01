import React, { useState, useEffect,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserbyId, updateUser } from "../../services/authService";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import'../../css/EditUser.css'

const uploadToCloudinary = async (file, setUploading) => {
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
    if (json.secure_url) {
      return json.secure_url;
    } else {
      throw new Error("Échec de l’upload");
    }
  } catch (error) {
    setUploading(false);
    toast.error("Erreur lors de l’upload de la photo");
    throw error;
  }
};

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const fileInputRef = useRef();

  const [form, setForm] = useState({
    nom: "",
    cin: "",
    role: "",
    photo: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserbyId(id);
        const user = response.data;
        setForm({
          nom: user.nom || "",
          cin: user.cin || "",
          role: user.role || "user",
          photo: user.photo || "",
        });
      } catch (error) {
        toast.error("Erreur lors du chargement de l'utilisateur");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadToCloudinary(file, setUploading);
        setForm({ ...form, photo: imageUrl });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, cin, role, photo } = form;

    if (!nom || !cin || !role) {
      toast.error("Tous les champs obligatoires doivent être remplis");
      return;
    }

    // ** On envoie motdepasse vide car backend l'attend **
    const payload = {
      nom,
      cin,
      role,
      photo: photo || "",
      motdepasse: "", 
    };

    try {
      await updateUser(id, payload);
      toast.success("Utilisateur mis à jour avec succès");
      navigate("/list");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="edit-container">
      <h2 className="edit-title">Modifier un utilisateur</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Nom"
          required
        />
        <input
          type="text"
          name="cin"
          value={form.cin}
          onChange={handleChange}
          placeholder="CIN"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
 
          <option value="Commerciale">Commerciale</option>
          <option value="Responsable Vente">Responsable Vente</option>
          <option value="Manager">Manager</option>
        </select>

        <div>
            <label>Photo</label>
            {/* input file caché */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            {/* Bouton personnalisé */}
            <button
              type="button"
              className="custom-file-button"
              onClick={() => fileInputRef.current.click()}
            >
              {form.photo ? "Choisir une autre photo" : "Choisir une image"}
            </button>

            {uploading && <p className="uploading-text">Chargement...</p>}
            {form.photo && (
              <img
                src={form.photo}
                alt="Photo utilisateur"
                className="edit-preview"
              />
            )}
          </div>
        <button type="submit" className="edit-button" disabled={uploading}>
          Enregistrer
        </button>
                           <button
    className="submit-retourr"
    type="button"
    onClick={() => navigate('/list')}
  >
    Retour
  </button>
      </form>
    </div>
    </>
  );
};

export default EditUser;
