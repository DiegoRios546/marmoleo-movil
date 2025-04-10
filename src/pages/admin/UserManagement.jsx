// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { fetchUsers, createUser as createUserAPI, updateUser as updateUserAPI, deleteUser as deleteUserAPI } from '../../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

const UserManagement = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userModalType, setUserModalType] = useState('add'); // 'add' o 'edit'
    const [selectedUser, setSelectedUser] = useState({
        id: null,
        phone: '',
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'user', // Default role
    });

    const fetchUserData = async () => {
        setUsersLoading(true);
        setUsersError(null);
        try {
            const data = await fetchUsers(token);
            setUsers(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error); // Log del error completo
            setUsersError(error.message || 'Error al cargar los usuarios.');
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [token]);

    const handleShowUserModal = (type, user = { id: null, phone: '', name: '', email: '', username: '', password: '', role: 'user' }) => {
        setUserModalType(type);
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleCloseUserModal = () => {
        setShowUserModal(false);
        setSelectedUser({ id: null, phone: '', name: '', email: '', username: '', password: '', role: 'user' });
    };

    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser(prevUser => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleCreateUser = async () => {
        try {
            await createUserAPI(token, selectedUser);
            Swal.fire('Usuario creado', 'El usuario ha sido creado exitosamente.', 'success');
            fetchUserData();
            handleCloseUserModal();
        } catch (error) {
            console.error("Error al crear usuario:", error); // Log del error completo
            Swal.fire('Error', error.message || 'Error al crear el usuario.', 'error');
        }
    };

    const handleUpdateUser = async () => {
        try {
            await updateUserAPI(token, selectedUser.id, selectedUser);
            Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado exitosamente.', 'success');
            fetchUserData();
            handleCloseUserModal();
        } catch (error) {
            console.error("Error al actualizar usuario:", error); // Log del error completo
            Swal.fire('Error', error.message || 'Error al actualizar el usuario.', 'error');
        }
    };

    const handleDeleteUser = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar este usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUserAPI(token, id);
                    Swal.fire('Usuario eliminado', 'El usuario ha sido eliminado exitosamente.', 'success');
                    fetchUserData();
                } catch (error) {
                    console.error("Error al eliminar usuario:", error); // Log del error completo
                    Swal.fire('Error', error.message || 'Error al eliminar el usuario.', 'error');
                }
            }
        });
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="mb-4 text-danger">Administración de Usuarios</h2>
                <Button variant="primary" className="mb-3" onClick={() => handleShowUserModal('add')}>
                    <FontAwesomeIcon icon={faPlus} /> Agregar Usuario
                </Button>
                {usersLoading ? (
                    <p>Cargando usuarios...</p>
                ) : usersError ? (
                    <p className="text-danger">Error: {usersError}</p>
                ) : (
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Telefono</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    {/* <th>Fecha de Creación</th> */}
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.username}</td>
                                        {/* <td>{new Date(user.creationDate).toLocaleDateString()}</td> */}
                                        <td>{user.role === 'moderator' ? 'repartidor' : user.role}</td>
                                        <td>
                                            <Button variant="info" size="sm" className="me-2" onClick={() => handleShowUserModal('edit', user)}>
                                                <FontAwesomeIcon icon={faEdit} /> Editar
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                                <FontAwesomeIcon icon={faTrash} /> Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
                {users && users.length === 0 && !usersLoading && <p>No hay usuarios.</p>}
            </div>

            {/* Modal para Usuarios */}
            <Modal show={showUserModal} onHide={handleCloseUserModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{userModalType === 'add' ? 'Agregar Nuevo Usuario' : 'Editar Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <Form.Group className="mb-3 col-md-6">
                                <Form.Label>Telefono</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={selectedUser.phone}
                                    onChange={handleUserInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={selectedUser.name}
                                    onChange={handleUserInputChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="row">
                            <Form.Group className="mb-3 col-md-6">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleUserInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={selectedUser.username}
                                    onChange={handleUserInputChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="row">
                            <Form.Group className="mb-3 col-md-6">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={selectedUser.password}
                                    onChange={handleUserInputChange}
                                    placeholder={userModalType === 'edit' ? 'Dejar en blanco para no cambiar' : 'Ingrese la contraseña'}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6">
                                <Form.Label>Rol</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="role"
                                    value={selectedUser.role}
                                    onChange={handleUserInputChange}
                                >
                                    <option value="user">Usuario</option>
                                    <option value="admin">Administrador</option>
                                    <option value="moderator">Repartidor</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUserModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={userModalType === 'add' ? handleCreateUser : handleUpdateUser}>
                        {userModalType === 'add' ? 'Guardar Usuario' : 'Actualizar Usuario'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;