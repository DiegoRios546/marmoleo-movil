import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Table, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { fetchAssignedOrders, updateOrderStatusByModerator } from '../../api/auth'; // Importa las funciones de la API

const AssignedOrders = () => {
    const { auth, token } = useAuth();
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAssignedOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAssignedOrders(token);
                setAssignedOrders(data);
            } catch (err) {
                setError(err.message || 'Error al cargar los pedidos asignados.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadAssignedOrders();
        }
    }, [token, auth?.id]);

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatusByModerator(token, orderId, newStatus);

            // Actualizar el estado en la interfaz de usuario
            setAssignedOrders(assignedOrders.map(order =>
                order.id === orderId ? { ...order, estado: newStatus } : order
            ));

            Swal.fire('Estado actualizado', `El estado del pedido ${orderId} ha sido actualizado a ${newStatus}.`, 'success');
        } catch (err) {
            console.error("Error updating order status:", err);
            Swal.fire('Error', err.message || 'Error al actualizar el estado del pedido.', 'error');
        }
    };

    const getButtonStyle = (currentState, targetState) => {
        const inactiveStyle = { backgroundColor: 'white', color: 'black', borderColor: '#ccc' };
        const activeStyle = { backgroundColor: 'red', color: 'white', borderColor: 'darkred' };

        if (currentState === targetState) {
            return activeStyle;
        } else {
            return inactiveStyle;
        }
    };

    if (loading) {
        return <p>Cargando pedidos asignados...</p>;
    }

    if (error) {
        return <p className="text-danger">Error al cargar los pedidos asignados: {error}</p>;
    }

    return (
        <div>
            <h2>Pedidos Asignados</h2>
            {assignedOrders.length === 0 ? (
                <p>No hay pedidos asignados actualmente.</p>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Número de Pedido</th>
                                <th>Fecha del Pedido</th>
                                <th>Nombre del Cliente</th>
                                <th>Dirección de Entrega</th>
                                <th>Estado</th>
                                <th>Fecha Entrega Estimada</th>
                                <th>Comentarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedOrders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.numero_pedido}</td>
                                    <td>{new Date(order.fecha_pedido).toLocaleString()}</td>
                                    <td>{order.nombre_cliente}</td>
                                    <td>{order.direccion_entrega}</td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <Button
                                                style={getButtonStyle(order.estado, 'Pendiente')}
                                                onClick={() => handleUpdateOrderStatus(order.id, 'Pendiente')}
                                                size="sm"
                                            >
                                                Pendiente
                                            </Button>
                                            <Button
                                                style={getButtonStyle(order.estado, 'En camino')}
                                                onClick={() => handleUpdateOrderStatus(order.id, 'En camino')}
                                                size="sm"
                                            >
                                                En camino
                                            </Button>
                                            <Button
                                                style={getButtonStyle(order.estado, 'Entregado')}
                                                onClick={() => handleUpdateOrderStatus(order.id, 'Entregado')}
                                                size="sm"
                                            >
                                                Entregado
                                            </Button>
                                        </div>
                                    </td>
                                    <td>{order.fecha_entrega_estimada ? new Date(order.fecha_entrega_estimada).toLocaleDateString() : '-'}</td>
                                    <td>{order.comentarios}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default AssignedOrders;