import React, { useEffect, useState } from 'react';
import { getAuthenticatedUsers } from '../services/api';
import './AuthenticatedUsers.css'; // Asumiendo que crearás este archivo CSS

const AuthenticatedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAuthenticatedUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="authenticated-users-container">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="authenticated-users-container error">Error: {error}</div>;
  }

  return (
    <div className="authenticated-users-container">
      <h2>Usuarios Autenticados</h2>
      {users.length === 0 ? (
        <p>No hay usuarios autenticados.</p>
      ) : (
        <table className="authenticated-users-table">
          <thead>
            <tr>
              <th>ID de Usuario</th>
              <th>Nombre de Usuario</th>
              <th>Email</th>
              {/* Agrega más encabezados si la API devuelve más datos relevantes */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                {/* Agrega más celdas de datos aquí */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuthenticatedUsers;
