import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signin } from '../services/authService';
import { toast, ToastContainer } from 'react-toastify';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/AuthForm.css'; // Ton fichier CSS

const Login = () => {
  const navigate = useNavigate();
  const [cin, setCin] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!/^\d{8}$/.test(cin)) {
      toast.error('Le CIN doit contenir exactement 8 chiffres.');
      return;
    }

  try {
  const res = await signin({ cin, motdepasse });
  const result = res.data;

  localStorage.setItem('token', result.token);

  const tokenPayload = JSON.parse(atob(result.token.split('.')[1]));
  const role = tokenPayload.role;

  toast.success('Connexion réussie !', { autoClose: 2000 });

  setTimeout(() => {
    if (role === 'Manager') navigate('/ManagerPage');
    if (role === 'Responsable Vente') navigate('/responsable');
    if (role === 'Commerciale') navigate('/commerciale');
  }, 1500);

} catch (err) {
  toast.error("Connexion échouée : veuillez vérifier vos identifiants.");
}
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form-container">
        <h2 className="auth-title">Connexion</h2>

        {/* Champ CIN */}
        <div className="input-group">
          <label>CIN</label>
          <div className="input-wrapper">
            <i className="fas fa-id-card icon-left"></i>
            <input
              type="number"
              value={cin}
              onChange={(e) => setCin(e.target.value.slice(0, 8))}
              required
            />
          </div>
        </div>

        {/* Champ mot de passe avec icône affichage */}
        <div className="input-group">
          <label>Mot de passe</label>
          <div className="input-wrapper" style={{ position: 'relative' }}>
            <i className="fas fa-lock icon-left"></i>
            <input
              type={showPassword ? 'text' : 'password'}
              value={motdepasse}
              onChange={(e) => setMotdepasse(e.target.value)}
              required
              style={{ paddingRight: '2.5rem' }}
            />
            <i
              onClick={() => setShowPassword(prev => !prev)}
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} icon-toggle`}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
                fontSize: '1.1rem'
              }}
              aria-label="Afficher ou masquer le mot de passe"
            />
          </div>
        </div>

        {/* Bouton */}
        <button type="submit" className="button1">Se connecter</button>

       
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
