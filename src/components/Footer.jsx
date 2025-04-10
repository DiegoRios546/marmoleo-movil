import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom'; // Assuming you might want to add links

const Footer = () => {
    return (
        <footer className="bg-danger text-white py-5 mt-4">
            <div className="container">
                <div className="row">
                    {/* Columna 1: Información de la Empresa */}
                    <div className="col-md-4">
                        <h5 className="mb-3">Panel de Administración</h5>
                        <p>
                            [Nombre de tu Empresa o Aplicación]<br />
                            [Dirección]<br />
                            [Correo Electrónico]<br />
                            [Número de Teléfono]
                        </p>
                    </div>

                    {/* Columna 3: Redes Sociales */}
                    <div className="col-md-4">
                        <h5 className="mb-3">Síguenos</h5>
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <a href="#" className="text-white"><FontAwesomeIcon icon={faFacebook} size="lg" /></a>
                            </li>
                            <li className="list-inline-item ms-3">
                                <a href="#" className="text-white"><FontAwesomeIcon icon={faTwitter} size="lg" /></a>
                            </li>
                            <li className="list-inline-item ms-3">
                                <a href="#" className="text-white"><FontAwesomeIcon icon={faInstagram} size="lg" /></a>
                            </li>
                            <li className="list-inline-item ms-3">
                                <a href="#" className="text-white"><FontAwesomeIcon icon={faLinkedin} size="lg" /></a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Línea de Copyright */}
                <div className="row mt-4">
                    <div className="col-md-12 text-center">
                        <hr className="border-top border-white-50" />
                        <p className="mb-0">© {new Date().getFullYear()} [Nombre de tu Empresa o Aplicación]. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;