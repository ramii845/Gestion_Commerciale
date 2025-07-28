import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserbyId } from "../services/authService";
import "./Navbar.css";

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

const Navbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.user_id) {
        setRole(decoded.role);
        getUserbyId(decoded.user_id)
          .then((res) => {
            setNom(res.data.nom);
            setPhoto(res.data.photo);
          })
          .catch((err) => console.error("Erreur récupération nom :", err));
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="https://res.cloudinary.com/ditzf19gl/image/upload/v1752510721/ggijjta8xizgcx8lbgvu.png"
          alt="Logo"
          className="navbar-logo"

        />
        <div className="navbar-company-info">
          <strong>STE AUTO LION</strong><br />
          Agent officiel Peugeot<br />
          Route de Gabès Km 1.5 - Sfax
        </div>
      </div>
      <div className="navbar-linksa">
       <span
  name="ac"
  onClick={() => {
    if (role === "Commerciale") {
      navigate("/commerciale");
    }
    if (role === "Manager") {
      navigate("/ManagerPage");
    }
    if (role === "Responsable Vente") {
      navigate("/responsable");
    }
  }}
>
  Accueil
</span>
      </div>
      {/* CE CONTENEUR EST CRUCIAL POUR LE POSITIONNEMENT ET L'ESPACEMENT */}
      <div className="navbar-right-group">
        <div className="navbar-linksc">
        </div>
        <div className="navbar-user" ref={menuRef}>
          <span className="user-namee">{nom}</span>
          <img
            src={photo || "https://res.cloudinary.com/ditzf19gl/image/upload/v1752069664/euxgou6ysoifehj1lxxb.jpg"}
            alt="Profil"
            className="user-image"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="user-menu">
           
              <button onClick={handleLogout}>Déconnexion</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;