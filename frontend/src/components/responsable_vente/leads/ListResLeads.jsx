import React, { useEffect, useState } from 'react';
import { getPaginatedLeads } from '../../services/leadsService';
import { getUserbyId } from '../../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import '../../css/ListLeads.css';

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

const ListResLeads = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, [page, filterDate]);

  const fetchLeads = async () => {
    try {
      const res = await getPaginatedLeads(page, 7, "", "", "", filterDate);
      const allLeads = res.data.leads;

      const leadsWithCommerciale = await Promise.all(
        allLeads.map(async (lead) => {
          try {
            const userRes = await getUserbyId(lead.user_id);
            return {
              ...lead,
              commerciale: userRes.data.nom || "Inconnu"
            };
          } catch {
            return {
              ...lead,
              commerciale: "Inconnu"
            };
          }
        })
      );

      setLeads(leadsWithCommerciale);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      toast.error("Erreur lors du chargement des leads");
    }
  };

  return (
    <>
      <Navbar />
      <div className="leads-container" style={{ marginTop: '80px' }}>
        <h2 className="leads-title">Liste des Leads</h2>

        <button
          onClick={() => navigate('/add-lead-res')}
          style={{ marginBottom: '1rem' }}
        >
          Ajouter un lead
        </button>

        <div className="filter-bar">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => {
              setPage(1);
              setFilterDate(e.target.value);
            }}
          />
        </div>

        <div className="leads-table">
          <div className="leads-header">
            <span>Commerciale</span>
            <span>Nom Client</span>
            <span>Date Création</span>
            <span>Date Traitement</span>
            <span>Besoin</span>
            <span>Affectation</span>
            <span>Relance</span>
          </div>

          {leads.map((lead, index) => (
            <div className="leads-row" key={index}>
              <span>{lead.commerciale}</span>
              <span>{lead.nom_client}</span>
              <span>{lead.date_creation ? new Date(lead.date_creation).toLocaleDateString("fr-FR") : "-"}</span>
              <span>{lead.date_traitement ? new Date(lead.date_traitement).toLocaleDateString("fr-FR") : "-"}</span>
              <span>{lead.besoin}</span>
              <span>{lead.affectation}</span>
              <span>{lead.relance}</span>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>←</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>→</button>
        </div>
      </div>
    </>
  );
};

export default ListResLeads;
