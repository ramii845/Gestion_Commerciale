import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/commercialeHome.css';
import Navbar from '../Navbar/Navbar';

const ResponsableHome = () => {
  const navigate = useNavigate();

  return (
    <> 
    <Navbar/>
   
    <div className="commerciale-container">
      <h2 className="commerciale-title">Espace Responsable Vente</h2>
      <div className="commerciale-blocks">
        <div
          className="commerciale-card"
          onClick={() => navigate('/responsable/ventes')}
          role="button"
          tabIndex={0}
        >
          <i className="fas fa-shopping-cart card-icon"></i>
          <h3>Gestion des Ventes</h3>
        </div>

        <div
          className="commerciale-card"
          onClick={() => navigate('/responsable/leads')}
          role="button"
          tabIndex={0}
        >
          <i className="fas fa-user-plus card-icon"></i>
          <h3>Gestion des Leads</h3>
        </div>

        <div
          className="commerciale-card"
          onClick={() => navigate('/responsable/promesses')}
          role="button"
          tabIndex={0}
          
        >
          <i className="fas fa-file-signature card-icon"></i>
          <h3>Traitement des Promesses</h3>
        </div>
      </div>
    </div>
     </>
  );
};

export default ResponsableHome;
