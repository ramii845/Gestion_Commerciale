import { useEffect, useState } from "react";
import {
  getUsersPaginated,
  deleteUser,
  getUserbyId
} from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "../../css/ListUsers.css";
import Navbar from "../../Navbar/Navbar";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchNom, setSearchNom] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await getUsersPaginated(page, 7, searchNom);
      setUsers(res.data.users);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      toast.error("Erreur lors du chargement des utilisateurs");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchNom]);

const handleDelete = (id) => {
  confirmAlert({
    title: 'Suppression',
    message: 'Voulez-vous vraiment supprimer cet utilisateur ?',
    buttons: [
      {
        label: 'Oui',
        onClick: async () => {
          try {
            await deleteUser(id);
            toast.success('Utilisateur supprimé !');
            fetchUsers();
          } catch {
            toast.error('Erreur lors de la suppression !');
          }
        },
        style: {
          backgroundColor: '#28a745',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '6px',
          border: 'none',
          fontWeight: '500',
          fontSize: '15px',
          cursor: 'pointer'
        }
      },
      {
        label: 'Non',
        onClick: () => {},
        style: {
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '6px',
          border: 'none',
          fontWeight: '500',
          fontSize: '15px',
          cursor: 'pointer'
        }
      }
    ],
    closeOnEscape: true,
    closeOnClickOutside: true
  });
};

  return (
    <>
   <Navbar/>
    <div className="user-list-container">
      <ToastContainer />
      <h2 className="title">Liste des utilisateurs</h2>

      <div className="user-list-actions">
        <button className="btn add" onClick={() => navigate("/add-user")}>
          ➕ Ajouter
        </button>

        <input
          type="text"
          placeholder="🔍 Rechercher par nom..."
          value={searchNom}
          onChange={(e) => {
            setPage(1);
            setSearchNom(e.target.value);
          }}
        />
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>CIN</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-msg">Aucun utilisateur trouvé</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.cin}</td>
                <td>{user.role}</td>
              
                <td>
                  <button
                    className="btn edit"
                    onClick={() => navigate(`/edit-user/${user.id}`)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ◀
        </button>
        <span>Page {page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          ▶
        </button>
      </div>
    </div>
    </>
  );
};

export default ListUsers;
