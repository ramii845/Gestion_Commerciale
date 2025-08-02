// src/pages/ManagerHome.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/managerHome.css';
import Navbar from '../Navbar/Navbar';
import SidebarMenuAdmin from './SidebarMenuAdmin';

const ManagerHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        nom: payload.nom,
        photo: payload.photo,
      });
    } catch (error) {
      console.error('Token invalide');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <SidebarMenuAdmin />

      <div className="manager-home">
        {user && (
          <div className="admin-welcome">
            <img
              src={user.photo || '/default-profile.png'}
              alt={user.nom}
              className="admin-photo"
            />
            <h1 className="welcome-title">Bienvenue, {user.nom} !</h1>
            <p className="welcome-quote">
              « Le leadership, c’est l’art de faire faire quelque chose par quelqu’un parce qu’il a envie de le faire. »
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ManagerHome;
