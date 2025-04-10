// frontend/src/pages/user/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AssignedOrders from './AssignedOrders';

const UserDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

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
                    <h2>Panel de Repartidor</h2>
                    <p>Bienvenido al panel de administracion de pedidos para repartidores de Carnicerias Marmoleo.</p>
                        <div className="mb-4">
                            <Button
                                variant="primary"
                                className="me-2"
                                disabled
                            >
                                <FontAwesomeIcon icon={faBoxOpen} className="me-2" /> Pedidos
                            </Button>
                        </div>

                        
                        <AssignedOrders />
                        
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserDashboard;