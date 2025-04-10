import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt, faHome, faUser, faCog } from '@fortawesome/free-solid-svg-icons'; // Importa iconos
import logo from '../assets/logo.png'; // Importa tu logo (ajusta la ruta si es necesario)

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-danger p-2"> {/* Se eliminó la clase 'fixed-top' */}
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" onClick={toggleSidebar} aria-controls="offcanvasNavbar" aria-expanded={isSidebarOpen} aria-label="Toggle navigation">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <div className="navbar-brand fw-bold d-flex align-items-center">
                        <div className='d-flex'>
                        Panel de Administracion<br/> Carnicerias Marmoleo
                        </div>

                        <img src={logo} alt="Logo" style={{ marginLeft: '20px', height: '50px' }} />
                    </div>
                    <div className="d-flex">
                        <button className="btn btn-outline-light" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/* Menú Lateral (Sidebar) */}
            <div className={`offcanvas offcanvas-start bg-danger text-white ${isSidebarOpen ? 'show' : ''}`} tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title fw-bold" id="offcanvasNavbarLabel">Menú</h5>
                    <button type="button" className="btn-close btn-close-white text-reset" onClick={toggleSidebar} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li className="nav-item">
                            <Link to="/user/userDashboard" className="nav-link active" onClick={toggleSidebar}>
                                <FontAwesomeIcon icon={faHome} className="me-2" /> Inicio
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/user/profile" className="nav-link" onClick={toggleSidebar}>
                                <FontAwesomeIcon icon={faUser} className="me-2" /> Perfil
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/user/settings" className="nav-link" onClick={toggleSidebar}>
                                <FontAwesomeIcon icon={faCog} className="me-2" /> Configuración
                            </Link>
                        </li>
                        {/* Agrega más elementos de menú aquí */}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;