import React, { useEffect, useState } from 'react';
import { getPaginatedLeads } from '../../services/leadsService';
import { getUserbyId } from '../../services/authService';
import { toast } from 'react-toastify';
import '../../css/ListLeads.css';
import Navbar from '../../Navbar/Navbar';

const ListLeads = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDate, setFilterDate] = useState("");

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
    <Navbar/>
    <div className="leads-container">
      <h2 className="leads-title">Liste des Leads</h2>

      <div className="filter-bar">
        <label>Filtrer par date de création :</label>
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
           <span>
  {lead.date_creation
    ? new Date(lead.date_creation).toLocaleDateString("fr-FR")
    : "-"}
</span>
            <span>
  {lead.date_traitement
    ? new Date(lead.date_traitement).toLocaleDateString("fr-FR")
    : "-"}
</span>

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

export default ListLeads;
