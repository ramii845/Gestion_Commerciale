import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { signup } from '../../services/authService'; // adapter si besoin

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    cin: '',
    motdepasse: '',
    motdepasse2: '',
    photoFile: null,
    role: 'Commerciale',  // valeur par défaut
  });

  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Gestion des changements des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion du fichier photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm((prev) => ({ ...prev, photoFile: file }));
  };

  // Upload photo vers Cloudinary
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
      if (json.secure_url) {
        return json.secure_url;
      } else {
        throw new Error('Échec de l’upload');
      }
    } catch (error) {
      setUploading(false);
      toast.error("Erreur lors de l’upload de la photo");
      throw error;
    }
  };

  // Soumission formulaire
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
        return; // arrêt si échec upload
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
      toast.success('Inscription réussie ! Vous pouvez vous connecter.', { autoClose: 2000 });
      setTimeout(() => navigate('/list'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l’inscription', { autoClose: 3000 });
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
          <div className="photo-upload-container">
            <label htmlFor="photo-input" className="camera-icon-label" style={{ cursor: 'pointer' }}>
              <img
                src={form.photoFile ? URL.createObjectURL(form.photoFile) : 'https://res.cloudinary.com/ditzf19gl/image/upload/v1752069934/fokroapqqpmvxpzoydow.jpg'}
                alt="photo"
                className="camera-icon"
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }}
              />
            </label>
            <input
              type="file"
              id="photo-input"
              name="photo"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </div>

          <p className="text-xl font-bold mb-6">Créer un compte</p>

          <div className="input-group">
            <p className="text-sm font-semibold">Nom du propriétaire</p>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <p className="text-sm font-semibold">CIN</p>
            <input
              type="text"
              name="cin"
              placeholder="Exemple: 0000TU000"
              value={form.cin}
              onChange={handleChange}
              minLength={8}
              maxLength={9}
              required
            />
          </div>

          <div className="input-group">
            <p className="text-sm font-semibold">Rôle</p>
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
          </div>

          <div className="input-group">
            <p className="text-sm font-semibold">Mot de passe</p>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="motdepasse"
                value={form.motdepasse}
                onChange={handleChange}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <i
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#888',
                  fontSize: '1.1rem',
                  userSelect: 'none',
                }}
                aria-label={showPassword ? "Masquer mot de passe" : "Afficher mot de passe"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword); }}
              />
            </div>
          </div>

          <div className="input-group">
            <p className="text-sm font-semibold">Confirmer le mot de passe</p>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="motdepasse2"
                value={form.motdepasse2}
                onChange={handleChange}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <i
                className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#888',
                  fontSize: '1.1rem',
                  userSelect: 'none',
                }}
                aria-label={showConfirmPassword ? "Masquer mot de passe" : "Afficher mot de passe"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowConfirmPassword(!showConfirmPassword); }}
              />
            </div>
          </div>

          <button className="buttonRegister" type="submit" disabled={uploading}>
            {uploading ? 'Upload en cours...' : 'Ajouter'}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddUser;
