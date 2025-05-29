// useClientAPI.js
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config.json";

export const useClientAPI = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_URL}/users/allClients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { users, fetchClients, error, loading };
};
