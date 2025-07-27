import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

import { getHistogrammeLeads } from "../services/leadsService";
import { getHistogrammePromesses } from "../services/promesseService";
import { getHistogrammeVentes } from "../services/venteService";

import "../css/Dashboard.css";

const COLORS = ["#2563EB", "#10B981", "#F59E0B"];

const moisNoms = [
  "Tous", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export default function Dashboard() {
  const [leadsHistogram, setLeadsHistogram] = useState([]);
  const [promessesHistogram, setPromessesHistogram] = useState([]);
  const [ventesHistogram, setVentesHistogram] = useState([]);

  // Nouvel état pour stocker le mois sélectionné (0 = Tous)
  const [moisSelectionne, setMoisSelectionne] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leads = await getHistogrammeLeads();
        const promesses = await getHistogrammePromesses();
        const ventes = await getHistogrammeVentes();

        setLeadsHistogram(leads);
        setPromessesHistogram(promesses);
        setVentesHistogram(ventes);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, []);

  // Fonction pour filtrer et sommer les données par utilisateur et par mois sélectionné
  const getTotalPerUserFiltered = (histogram, mois) => {
    return histogram.map(user => {
      const total = mois === 0
        ? user.data.reduce((sum, item) => sum + item.total, 0)
        : user.data
            .filter(item => item.month === mois)
            .reduce((sum, item) => sum + item.total, 0);
      return { nom: user.nom, total };
    });
  };

  // Somme totale filtrée par mois
  const totalFromHistogramFiltered = (histogram, mois) => {
    return histogram.reduce((acc, user) => {
      const userTotal = mois === 0
        ? user.data.reduce((s, item) => s + item.total, 0)
        : user.data
            .filter(item => item.month === mois)
            .reduce((s, item) => s + item.total, 0);
      return acc + userTotal;
    }, 0);
  };

  // Données filtrées selon le mois sélectionné
  const leadsPerUser = getTotalPerUserFiltered(leadsHistogram, moisSelectionne);
  const promessesPerUser = getTotalPerUserFiltered(promessesHistogram, moisSelectionne);
  const ventesPerUser = getTotalPerUserFiltered(ventesHistogram, moisSelectionne);

  const pieData = [
    { name: "Leads", value: totalFromHistogramFiltered(leadsHistogram, moisSelectionne) },
    { name: "Promesses", value: totalFromHistogramFiltered(promessesHistogram, moisSelectionne) },
    { name: "Ventes", value: totalFromHistogramFiltered(ventesHistogram, moisSelectionne) },
  ];

  const formatMonth = (monthNumber) => moisNoms[monthNumber] || monthNumber;

  // Tooltip personnalisé pour histogrammes
  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p><strong>Mois :</strong> {formatMonth(label)}</p>
          <p><strong>Total :</strong> {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Tableau de Bord</h1>

      {/* Sélecteur de mois */}
      <div className="month-selector">
        <label htmlFor="mois">Filtrer par mois : </label>
        <select
          id="mois"
          value={moisSelectionne}
          onChange={(e) => setMoisSelectionne(Number(e.target.value))}
        >
          {moisNoms.map((mois, index) => (
            <option key={mois} value={index}>
              {mois}
            </option>
          ))}
        </select>
      </div>

      {/* Résumé global avec filtres */}
      <div className="summary-grid">
        {[ 
          { name: "Leads", total: pieData[0].value, perUser: leadsPerUser },
          { name: "Promesses", total: pieData[1].value, perUser: promessesPerUser },
          { name: "Ventes", total: pieData[2].value, perUser: ventesPerUser }
        ].map((item, index) => (
          <div key={item.name} className={`summary-card card-${index}`}>
            <h2 className="summary-title">Total {item.name}</h2>
            <p className="summary-value">{item.total}</p>
            <div className="summary-users-list">
              {item.perUser.map(user => (
                <p key={user.nom} className="user-total">
                  {user.nom} : {user.total}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Diagramme circulaire */}
      <div className="chart-section">
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value} />
        </PieChart>
      </div>

      {/* Histogrammes par utilisateur (pour leads uniquement ici, filtrage mois possible) */}
      <h2 className="section-title">📈 Histogrammes par Utilisateur (Leads)</h2>
      <div className="charts-container">
        {leadsHistogram.map((userData, idx) => {
          // Filtrer les données du graphique selon mois sélectionné
          const filteredData = moisSelectionne === 0
            ? userData.data
            : userData.data.filter(item => item.month === moisSelectionne);
          return (
            <div key={idx} className="user-chart">
              <h3 className="user-name">{userData.nom}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonth}
                    label={{ value: "Mois", position: "insideBottom", offset: -5 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{ value: "Total", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={renderCustomTooltip} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="total" name="Total Leads" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}
