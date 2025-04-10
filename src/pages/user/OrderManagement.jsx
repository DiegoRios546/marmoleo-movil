import React, { useState, useEffect } from 'react';
import { fetchUserOrders, updateOrderStatus, createOrder as createOrderAPI, updateOrder as updateOrderAPI, deleteOrder as deleteOrderAPI } from '../../api/auth'; // Import createOrder, updateOrder, deleteOrder API functions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import icons
import Swal from 'sweetalert2';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

const OrderManagement = () => {
    const auth = useAuth();
    const token = auth.token;
    const userId = auth.id;
    const userRole = auth.role;
    const username = auth.username;
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newOrder, setNewOrder] = useState({
        numero_pedido: '',
        fecha_pedido: new Date().toISOString().slice(0, 16), // Default to current date and time
        nombre_cliente: '',
        direccion_entrega: '',
        estado: 'Pendiente',
        fecha_entrega_estimada: '',
        comentarios: '',
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [originalOrder, setOriginalOrder] = useState(null); // To store the original order data

    const fetchOrderData = async () => {
        setOrdersLoading(true);
        setOrdersError(null);
        try {
            const data = await fetchUserOrders(token);
            setOrders(data);
        } catch (err) {
            setOrdersError(err.message || 'Error al cargar los pedidos.');
        } finally {
            setOrdersLoading(false);
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

    const handleCloseCreateModal = () => setShowCreateModal(false);
    const handleShowCreateModal = () => setShowCreateModal(true);

    const handleCreateOrderChange = (e) => {
        setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
    };

    const handleCreateOrderSubmit = async () => {
        try {
            const orderToCreate = { ...newOrder, user_id: userId }; // Add logged-in user's ID
            await createOrderAPI(token, orderToCreate);
            Swal.fire('Pedido creado', 'El pedido ha sido creado exitosamente.', 'success');
            fetchOrderData(); // Recargar los pedidos
            handleCloseCreateModal();
            setNewOrder({ // Reset the form
                numero_pedido: '',
                fecha_pedido: new Date().toISOString().slice(0, 16),
                nombre_cliente: '',
                direccion_entrega: '',
                estado: 'Pendiente',
                fecha_entrega_estimada: '',
                comentarios: '',
            });
        } catch (err) {
            Swal.fire('Error', err.message || 'Error al crear el pedido.', 'error');
        }
    };

    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowEditModal = (order) => {
        setEditingOrder(order);
        setOriginalOrder({ ...order }); // Store the original order data
        setShowEditModal(true);
    };

    const handleEditOrderChange = (e) => {
        setEditingOrder({ ...editingOrder, [e.target.name]: e.target.value });
    };

    const handleEditOrderSubmit = async () => {
        if (!editingOrder || !originalOrder) return;
        try {
            const updatedOrder = { ...editingOrder };
            // Preserve the original values of immutable fields
            updatedOrder.fecha_pedido = originalOrder.fecha_pedido;
            updatedOrder.estado = originalOrder.estado;
            updatedOrder.repartidor_asignado = originalOrder.repartidor_asignado;
            updatedOrder.user_id = originalOrder.user_id;

            await updateOrderAPI(token, editingOrder.id, updatedOrder);
            Swal.fire('Pedido actualizado', 'El pedido ha sido actualizado exitosamente.', 'success');
            fetchOrderData(); // Recargar los pedidos
            handleCloseEditModal();
            setEditingOrder(null);
            setOriginalOrder(null);
        } catch (err) {
            Swal.fire('Error', err.message || 'Error al actualizar el pedido.', 'error');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el pedido con ID ${orderId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteOrderAPI(token, orderId);
                    Swal.fire('Pedido eliminado', 'El pedido ha sido eliminado exitosamente.', 'success');
                    fetchOrderData(); // Recargar los pedidos
                } catch (err) {
                    Swal.fire('Error', err.message || 'Error al eliminar el pedido.', 'error');
                }
            }
        });
    };

    useEffect(() => {
        fetchOrderData();
    }, [token]);

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="mb-4 text-danger">Lista de Pedidos</h2>
                <Button variant="primary" className="mb-3" onClick={handleShowCreateModal}>
                    <FontAwesomeIcon icon={faPlus} /> Crear Nuevo Pedido
                </Button>

                <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Crear Nuevo Pedido</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Número de Pedido</Form.Label>
                                <Form.Control type="text" name="numero_pedido" value={newOrder.numero_pedido} onChange={handleCreateOrderChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha del Pedido</Form.Label>
                                <Form.Control type="datetime-local" name="fecha_pedido" value={newOrder.fecha_pedido} onChange={handleCreateOrderChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre del Cliente</Form.Label>
                                <Form.Control type="text" name="nombre_cliente" value={newOrder.nombre_cliente} onChange={handleCreateOrderChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Dirección de Entrega</Form.Label>
                                <Form.Control as="textarea" name="direccion_entrega" value={newOrder.direccion_entrega} onChange={handleCreateOrderChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Control as="select" name="estado" value={newOrder.estado} onChange={handleCreateOrderChange}>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En camino">En camino</option>
                                    <option value="Entregado">Entregado</option>
                                    <option value="Cancelado">Cancelado</option> {/* Added Cancelado as a possible state */}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Entrega Estimada</Form.Label>
                                <Form.Control type="date" name="fecha_entrega_estimada" value={newOrder.fecha_entrega_estimada} onChange={handleCreateOrderChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Comentarios</Form.Label>
                                <Form.Control as="textarea" name="comentarios" value={newOrder.comentarios} onChange={handleCreateOrderChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseCreateModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleCreateOrderSubmit}>
                            Crear Pedido
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Pedido</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {editingOrder && (
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>ID</Form.Label>
                                    <Form.Control type="text" value={editingOrder.id} readOnly />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número de Pedido</Form.Label>
                                    <Form.Control type="text" name="numero_pedido" value={editingOrder.numero_pedido} onChange={handleEditOrderChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha del Pedido</Form.Label>
                                    {/* Make this field read-only */}
                                    <Form.Control type="datetime-local" name="fecha_pedido" value={editingOrder.fecha_pedido ? new Date(editingOrder.fecha_pedido).toISOString().slice(0, 16) : ''} readOnly />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Cliente</Form.Label>
                                    <Form.Control type="text" name="nombre_cliente" value={editingOrder.nombre_cliente} onChange={handleEditOrderChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dirección de Entrega</Form.Label>
                                    <Form.Control as="textarea" name="direccion_entrega" value={editingOrder.direccion_entrega} onChange={handleEditOrderChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    {/* Make this field read-only for non-admin users */}
                                    <Form.Control as="select" name="estado" value={editingOrder.estado} onChange={handleEditOrderChange} disabled={userRole !== 'admin'}>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En camino">En camino</option>
                                        <option value="Entregado">Entregado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </Form.Control>
                                    {userRole !== 'admin' && <Form.Text className="text-muted">El estado solo puede ser modificado por administradores.</Form.Text>}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de Entrega Estimada</Form.Label>
                                    <Form.Control type="date" name="fecha_entrega_estimada" value={editingOrder.fecha_entrega_estimada ? editingOrder.fecha_entrega_estimada.slice(0, 10) : ''} onChange={handleEditOrderChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Comentarios</Form.Label>
                                    <Form.Control as="textarea" name="comentarios" value={editingOrder.comentarios} onChange={handleEditOrderChange} />
                                </Form.Group>
                                {/* The following fields will not be displayed in the edit form */}
                                {/* <Form.Group className="mb-3">
                                    <Form.Label>Repartidor Asignado</Form.Label>
                                    <Form.Control type="text" name="repartidor_asignado" value={editingOrder.repartidor_asignado} readOnly />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>User ID</Form.Label>
                                    <Form.Control type="text" name="user_id" value={editingOrder.user_id} readOnly />
                                </Form.Group> */}
                            </Form>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleEditOrderSubmit}>
                            Guardar Cambios
                        </Button>
                    </Modal.Footer>
                </Modal>

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
                                    <th>Fecha Entrega Estimada</th>
                                    <th>Comentarios</th>
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
                                                disabled={userRole !== 'admin'} // Only admin can change status from the table
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="En camino">En camino</option>
                                                <option value="Entregado">Entregado</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </Form.Select>
                                            {userRole !== 'admin' && <Form.Text className="text-muted">Solo administradores pueden cambiar el estado aquí.</Form.Text>}
                                        </td>
                                        <td>{order.fecha_entrega_estimada ? new Date(order.fecha_entrega_estimada).toLocaleDateString() : '-'}</td>
                                        <td>{order.comentarios}</td>
                                        <td>
                                            <Button variant="info" size="sm" className="me-2" onClick={() => handleShowEditModal(order)}>
                                                <FontAwesomeIcon icon={faEdit} /> Editar
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                                                <FontAwesomeIcon icon={faTrash} /> Eliminar
                                            </Button>
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