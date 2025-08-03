import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { getHistogrammeLeads } from "../services/leadsService";
import"../css/Dashboard.css";
import Navbar from "../Navbar/Navbar";
import SidebarMenuCommercial from "../commerciales/SidebarMenuCommercial";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2025);
  const yearsRange = Array.from({ length: 6 }, (_, i) => 2025+ i); // 2020 à 2025
  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsData = await getHistogrammeLeads();
        setLeads(leadsData);
      } catch (error) {
        console.error("Erreur lors du chargement des leads :", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar/>
      <SidebarMenuCommercial/>
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Tableau de bord</h2>

      <div className="dashboard-filter">
        <label htmlFor="year-select" className="dashboard-label">
          Sélectionner une année :
        </label>
        <select
          id="year-select"
          className="dashboard-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {yearsRange.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {leads.map((entry, idx) => {
        const userData = months.map((monthLabel, index) => {
          const item = entry.data.find(d => d.month === index + 1 && d.year === selectedYear);
          let affected = 0;
          let not_affected = 0;

          if (item && item.affectations) {
            item.affectations.forEach(a => {
              if (a.type.toLowerCase() === "affecté") affected = a.total;
              else if (a.type.toLowerCase() === "non affecté") not_affected = a.total;
            });
          }

          return {
            month: monthLabel,
            affected,
            not_affected,
          };
        });

        const maxYValue = Math.max(...userData.map(d => d.affected + d.not_affected), 10);

        return (
          <div key={idx} className="dashboard-chart-container">
            <h4 className="dashboard-chart-title">{entry.nom}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userData} barSize={20} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, maxYValue]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="not_affected" fill="#ff4d4f" name="Non affectés" />
                <Bar dataKey="affected" fill="#52c41a" name="Affectés" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
    </>
  );
};

export default Dashboard;
