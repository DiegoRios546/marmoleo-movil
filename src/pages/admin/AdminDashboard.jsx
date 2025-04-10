// src/pages/admin/adminDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBoxOpen, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import OrderManagement from './OrderManagement';
import ProductManagement from './productManagement';
import CategoryManagement from './CategoryManagement';
import UserManagement from './UserManagement'; 
import BusinessInfoManagement from './BusinessInfoManagement';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders'); // Estado para controlar la pestaña activa

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="bg-light vh-100">
            <Navbar />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                    <h2>Panel de Administrador</h2>
                    <p>Bienvenido al panel de administracion principal de Carnicerias Marmoleo.</p>
                        <div className="mb-4">
                            <Button
                                variant={activeTab === 'orders' ? 'primary' : 'outline-primary'}
                                className="me-2"
                                onClick={() => setActiveTab('orders')}
                            >
                                <FontAwesomeIcon icon={faBoxOpen} className="me-2" /> Pedidos
                            </Button>
                            <Button
                                variant={activeTab === 'products' ? 'primary' : 'outline-primary'}
                                className="me-2"
                                onClick={() => setActiveTab('products')}
                            >
                                <FontAwesomeIcon icon={faFolderOpen} className="me-2" /> Productos
                            </Button>
                            <Button
                                variant={activeTab === 'categories' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveTab('categories')}
                                className="me-2"
                            >
                                <FontAwesomeIcon icon={faFolderOpen} className="me-2" /> Categorías
                            </Button>
                            <Button
                                variant={activeTab === 'users' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveTab('users')}
                            >
                                <FontAwesomeIcon icon={faFolderOpen} className="me-2" /> Usuarios
                            </Button>
                            <Button
                                variant={activeTab === 'businessInfo' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveTab('businessInfo')}
                            >
                                <FontAwesomeIcon icon={faFolderOpen} className="me-2" /> Informacion de la carniceria
                            </Button>
                        </div>

                        {activeTab === 'orders' && <OrderManagement />}
                        {activeTab === 'products' && <ProductManagement />}
                        {activeTab === 'categories' && <CategoryManagement />}
                        {activeTab === 'users' && <UserManagement />}
                        {activeTab === 'businessInfo' && <BusinessInfoManagement />}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;