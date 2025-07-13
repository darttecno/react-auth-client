import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const RequestListPaginated = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Cargar solicitudes paginadas
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(`/requests?page=${currentPage}&size=${pageSize}`);
        setRequests(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentPage, pageSize]);

  // Cargar todos los usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiFetch('/auth/users');
        setUsers(data); // Se espera que el backend devuelva un array de usuarios
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const getUsernameById = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : 'Desconocido';
  };

  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p>Error al cargar las solicitudes: {error.message}</p>;
  if (requests.length === 0) return <p>No hay solicitudes para mostrar.</p>;

  return (
    <div>
      <h1>Listado de Solicitudes (Paginado)</h1>

      <table className="table" border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Medicamento</th>
            <th>Descripción</th>
            <th>NO POS</th>
            <th>Fabricante</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.medication?.name || '-'}</td>
              <td>{request.medication?.description || '-'}</td>
              <td>
                {request.medication?.noPos === true
                  ? 'SI'
                  : request.medication?.noPos === false
                  ? 'NO'
                  : '-'}
              </td>
              <td>{request.medication?.manufacturer || '-'}</td>
              <td>{request.quantity}</td>
              <td>{request.status}</td>
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td>{getUsernameById(request.userId)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Anterior
        </button>
        <span style={{ margin: '0 1rem' }}>
          Página {currentPage + 1} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default RequestListPaginated;
