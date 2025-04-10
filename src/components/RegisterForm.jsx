import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import logo from '../assets/logo-form.png';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        phone: '',
        name: '',
        email: '',
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const { token } = useAuth(); // Obtén el token del contexto de autenticación

    useEffect(() => {
        // Si ya hay un token, redirige al usuario al Dashboard
        if (token) {
            navigate('/Dashboard', { replace: true });
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Envía solo la información del usuario (sin la necesidad de la tabla clients)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
                phone: formData.phone,
                name: formData.name,
                email: formData.email,
                username: formData.username,
                password: formData.password,
            });
            Swal.fire({
                title: 'Registro exitoso',
                text: 'Tu cuenta ha sido creada exitosamente',
                icon: 'success',
                confirmButtonText: 'Iniciar sesión'
            }).then(() => {
                navigate('/login');
            });
        } catch (error) {
            Swal.fire({
                title: 'Error en el registro',
                text: error.response?.data.message || 'Hubo un problema al crear la cuenta',
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
                <h2 className="text-center mb-3">Registrarse</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control bg-light text-dark"
                            name="phone"
                            placeholder="Telefono"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control bg-light text-dark"
                            name="name"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control bg-light text-dark"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control bg-light text-dark"
                            name="username"
                            placeholder="Nombre de usuario"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control bg-light text-dark"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-primary">
                            Registrarse
                        </button>
                    </div>
                </form>
                <p className="text-center mt-3">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none text-light">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;