import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/ResetPasswordPage.css';
import Navbar from '../Navbar/Navbar';



const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [matricule, setMatricule] = useState('');
  const [nouveau_motdepasse, setNouveauMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');

  // Etats pour afficher/masquer les mots de passe
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nouveau_motdepasse !== confirmation) {
      toast.warning("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
    const res = await resetPassword({
  cin: matricule,
  nouveau_motdepasse,
});

      if (res.data.message.includes("succès")) {
        toast.success("Mot de passe réinitialisé avec succès.");
        setTimeout(() => navigate("/list"), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors de la réinitialisation.");
      console.error(err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form-container">
        <h2 className="text-xl font-bold text-center mb-6">Réinitialiser le mot de passe</h2>

        <div className="input-group">
          <label className="text-sm font-semibold">CIN</label>
          <div className="input-wrapper">
             <i className="fas fa-id-card icon-left"></i>
            <input
              type="number"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="text-sm font-semibold">Nouveau mot de passe</label>
          <div className="input-wrapper" style={{ position: 'relative' }}>
           <i className="fas fa-lock icon-left"></i>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={nouveau_motdepasse}
              onChange={(e) => setNouveauMotDePasse(e.target.value)}
              required
              style={{ paddingRight: '2.5rem' }}
            />
            <i
              className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={() => setShowNewPassword(!showNewPassword)}
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
              aria-label={showNewPassword ? "Masquer mot de passe" : "Afficher mot de passe"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setShowNewPassword(!showNewPassword); }}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="text-sm font-semibold">Confirmer le mot de passe</label>
          <div className="input-wrapper" style={{ position: 'relative' }}>
 <i className="fas fa-lock icon-left"></i>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
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
              onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setShowConfirmPassword(!showConfirmPassword); }}
            />
          </div>
        </div>

        <button className="button1" type="submit">
          Réinitialiser
        </button>
       <button className="button2" type="button" onClick={() => navigate('/list')}>
      Retour
    </button>


       
      </form>
        <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </>
  );
};

export default ResetPasswordPage;
