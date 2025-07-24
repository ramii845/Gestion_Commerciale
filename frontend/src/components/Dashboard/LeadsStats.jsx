import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getHistogrammeLeads } from "../services/leadsService";

const LeadsStats = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupère les données JSON de l'API
        const data = await getHistogrammeLeads();

        // Traite les données pour chaque utilisateur
        const processed = data.map(({ nom, data: userData }) => ({
          nom,
          data: userData
            .map(({ year, month, total }) => ({
              year,
              month,
              total,
              label: `${month.toString().padStart(2, "0")}/${year}`, // format mm/yyyy pour axe X
            }))
            .sort(
              (a, b) =>
                new Date(`${a.year}-${a.month}`) - new Date(`${b.year}-${b.month}`)
            ),
        }));

        setChartData(processed);
      } catch (error) {
        console.error("Erreur chargement histogramme:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Chargement de l'histogramme...</p>;
  if (!chartData.length) return <p>Aucune donnée disponible.</p>;

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#8884d8",
  ];

  return (
    <div style={{ width: "100%", marginTop: 50 }}>
      <h2>Histogramme des leads affectés par utilisateur</h2>
      {chartData.map(({ nom, data }, index) => (
        <div key={nom} style={{ marginBottom: 60, height: 300 }}>
          <h3>{nom}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill={colors[index % colors.length]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default LeadsStats;
