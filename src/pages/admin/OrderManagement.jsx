import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus, fetchUsersByRole, assignDriverToOrder as assignDriverToOrderAPI } from '../../api/auth'; // Import assignDriverToOrder API function
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faUser } from '@fortawesome/free-solid-svg-icons'; // Import faUser icon
import Swal from 'sweetalert2';
import { Table, Form, Button } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

const OrderManagement = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const [moderators, setModerators] = useState([]); // State to store moderators
    const [moderatorsLoading, setModeratorsLoading] = useState(true);
    const [moderatorsError, setModeratorsError] = useState(null);

    const fetchOrderData = async () => {
        setOrdersLoading(true);
        setOrdersError(null);
        try {
            const data = await fetchOrders(token);
            setOrders(data);
        } catch (err) {
            setOrdersError(err.message || 'Error al cargar los pedidos.');
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchModeratorsData = async () => {
        setModeratorsLoading(true);
        setModeratorsError(null);
        try {
            const data = await fetchUsersByRole(token, 'moderator');
            setModerators(data);
        } catch (err) {
            setModeratorsError(err.message || 'Error al cargar los repartidores.');
        } finally {
            setModeratorsLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(token, orderId, newStatus);
            Swal.fire('Estado actualizado', `El estado del pedido ${orderId} ha sido actualizado a ${newStatus}.`, 'success');
            fetchOrderData(); // Recargar los pedidos
        } catch (err) {
            Swal.fire('Error', err.message || 'Error al actualizar el estado.', 'error');
        }
    };

    const handleAssignDriver = async (orderId, driverId) => {
        try {
            await assignDriverToOrderAPI(token, orderId, driverId); // Use the imported API function
            Swal.fire('Repartidor asignado', `Se ha asignado el repartidor al pedido ${orderId}.`, 'success');
            fetchOrderData(); // Recargar los pedidos
        } catch (err) {
            Swal.fire('Error', err.message || 'Error al asignar el repartidor.', 'error');
        }
    };

    useEffect(() => {
        fetchOrderData();
        fetchModeratorsData(); // Fetch moderators on component mount
    }, [token]);

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="mb-4 text-danger">Lista de Pedidos</h2>
                {ordersLoading ? (
                    <p>Cargando pedidos...</p>
                ) : ordersError ? (
                    <p className="text-danger">Error al cargar los pedidos: {ordersError}</p>
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
                                    <th>Repartidor</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.numero_pedido}</td>
                                        <td>{new Date(order.fecha_pedido).toLocaleString()}</td>
                                        <td>{order.nombre_cliente}</td>
                                        <td>{order.direccion_entrega}</td>
                                        <td>
                                            <Form.Select
                                                value={order.estado}
                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="En camino">En camino</option>
                                                <option value="Entregado">Entregado</option>
                                            </Form.Select>
                                        </td>
                                        <td>
                                            {!moderatorsLoading && !moderatorsError ? (
                                                <Form.Select
                                                    value={order.repartidor_asignado || ''} // Use repartidor_asignado to store the ID
                                                    onChange={(e) => handleAssignDriver(order.id, e.target.value)}
                                                >
                                                    <option value="">Sin Asignar</option>
                                                    {moderators.map(moderator => (
                                                        <option key={moderator.id} value={moderator.id}>
                                                            {moderator.name} ({moderator.username})
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            ) : moderatorsLoading ? (
                                                <small className="text-muted">Cargando repartidores...</small>
                                            ) : (
                                                <small className="text-danger">Error al cargar repartidores.</small>
                                            )}
                                        </td>
                                        <td>
                                            {order.estado !== 'Entregado' && (
                                                <Button variant="success" size="sm" className="mt-2" onClick={() => handleUpdateOrderStatus(order.id, 'Entregado')}>
                                                    <FontAwesomeIcon icon={faCheckCircle} /> Marcar Entregado
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
                {orders && orders.length === 0 && !ordersLoading && <p>No hay pedidos.</p>}
            </div>
        </div>
    );
};

export default OrderManagement;