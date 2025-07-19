import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/managerHome.css';
import Navbar from '../Navbar/Navbar';

const ManagerHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="manager-container">
        <h2 className="manager-title">Espace Manager</h2>
        <div className="manager-blocks">
          <div
            className="manager-card"
            onClick={() => navigate('/commerciale/ventes')}
            role="button"
            tabIndex={0}
          >
            <i className="fas fa-shopping-cart card-icon"></i>
            <h3>Gestion des Ventes</h3>
          </div>

          <div
            className="manager-card"
            onClick={() => navigate('/commerciale/leads')}
            role="button"
            tabIndex={0}
          >
            <i className="fas fa-user-plus card-icon"></i>
            <h3>Gestion des Leads</h3>
          </div>

          <div
            className="manager-card"
            onClick={() => navigate('/commerciale/promesses')}
            role="button"
            tabIndex={0}
          >
            <i className="fas fa-file-signature card-icon"></i>
            <h3>Traitement des Promesses</h3>
          </div>

          <div
            className="manager-card"
            onClick={() => navigate('/list')}
            role="button"
            tabIndex={0}
          >
            <i className="fas fa-users card-icon"></i>
            <h3>Gestion des Utilisateurs</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerHome;
