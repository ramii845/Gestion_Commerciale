// components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const decodeToken = (token) => {
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
    return null;
  }
};

const ResponsableVenteRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token) : null;

  return decoded && decoded.role === "Responsable Vente" ? element : <Navigate to="/" />;
};

export default ResponsableVenteRoute;
