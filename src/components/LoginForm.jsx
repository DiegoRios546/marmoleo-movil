import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import logo from '../assets/logo-form.png'; 

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { username, password });
            const { token } = response.data;
            login(token);

            const userRole = JSON.parse(atob(token.split('.')[1])).role;

            // Redirigir al tablero correspondiente según el rol
            if (userRole === 'admin') {
                navigate('/admin/adminDashboard', { replace: true });
            } else if (userRole === 'moderator') {
                navigate('/moderator/moderatorDashboard', { replace: true });
            } else {
                navigate('/user/userDashboard', { replace: true });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error en el inicio de sesión',
                text: error.response?.data.message || 'Usuario o contraseña incorrectos',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
    };

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center" style={{ backdropFilter: 'blur(10px)' }}>
            <div className="bg-dark rounded p-4 shadow-lg text-white" style={{ width: '400px' }}>
                <div className="d-flex justify-content-center mb-3">
                    <img src={logo} alt="Logo de la aplicación" style={{ maxHeight: '100px' }} />
                </div>
                <h2 className="text-center mb-3">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control bg-light text-dark"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Usuario"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control bg-light text-dark"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            required
                        />
                    </div>
                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-primary">
                            Iniciar sesión
                        </button>
                    </div>
                </form>
                <p className="text-center mt-3">
                    ¿No tienes cuenta? <Link to="/register" className="text-decoration-none text-light">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;