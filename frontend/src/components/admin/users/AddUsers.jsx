import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { signup } from '../../services/authService';
import Navbar from '../../Navbar/Navbar';
import '../../css/addUser.css';

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    cin: '',
    motdepasse: '',
    motdepasse2: '',
    photoFile: null,
    role: 'Commerciale',
  });

  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm((prev) => ({ ...prev, photoFile: file }));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'iit2024G4');
    data.append('cloud_name', 'ditzf19gl');

    setUploading(true);
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/ditzf19gl/image/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      setUploading(false);
      if (json.secure_url) return json.secure_url;
      else throw new Error('Échec de l’upload');
    } catch (error) {
      setUploading(false);
      toast.error("Erreur lors de l’upload de la photo");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.motdepasse !== form.motdepasse2) {
      toast.warning('Les mots de passe ne correspondent pas');
      return;
    }

    let photoUrl = '';
    if (form.photoFile) {
      try {
        photoUrl = await uploadToCloudinary(form.photoFile);
      } catch {
        return;
      }
    }

    const userData = {
      nom: form.nom,
      cin: form.cin,
      motdepasse: form.motdepasse,
      role: form.role,
      photo: photoUrl,
    };

    try {
      await signup(userData);
      toast.success('Inscription réussie !', { autoClose: 2000 });
      setTimeout(() => navigate('/list'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l’inscription');
    }
  };

  return (
    <>
      <Navbar />
      <div className="adduser-container">
        <div className="adduser-form-wrapper">
          <form onSubmit={handleSubmit} className="adduser-form" encType="multipart/form-data">
            <div className="adduser-photo">
              <label htmlFor="photo-input" className="adduser-photo-label">
                <img
                  src={
                    form.photoFile
                      ? URL.createObjectURL(form.photoFile)
                      : 'https://res.cloudinary.com/ditzf19gl/image/upload/v1752069934/fokroapqqpmvxpzoydow.jpg'
                  }
                  alt="profil"
                  className="adduser-photo-preview"
                />
              </label>
              <input
                type="file"
                id="photo-input"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>

            <p className="adduser-title">Créer un compte</p>

            <div className="adduser-group">
              <label>Nom du propriétaire</label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="adduser-group">
              <label>CIN</label>
              <input
                type="number"
                name="cin"
                value={form.cin}
                onChange={handleChange}
                minLength={8}
                maxLength={8}
                required
              />
            </div>

            <div className="adduser-group">
              <label>Rôle</label>
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="Commerciale">Commerciale</option>
                <option value="Responsable Vente">Responsable Vente</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div className="adduser-group">
              <label>Mot de passe</label>
              <div className="adduser-password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="motdepasse"
                  value={form.motdepasse}
                  onChange={handleChange}
                  required
                />
                <i
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <div className="adduser-group">
              <label>Confirmer le mot de passe</label>
              <div className="adduser-password">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="motdepasse2"
                  value={form.motdepasse2}
                  onChange={handleChange}
                  required
                />
                <i
                  className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
            </div>

            <button className="adduser-button" type="submit" disabled={uploading}>
              {uploading ? 'Upload en cours...' : 'Ajouter'}
            </button>
                      <button
    className="submit-retour"
    type="button"
    onClick={() => navigate('/list')}
  >
    Retour
  </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default AddUser;
