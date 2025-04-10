import React from 'react';
import LoginForm from '../components/LoginForm';
import backgroundImage from '../assets/fondo.jpg'; // Importa tu imagen de fondo

const Login = () => {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
        }}>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro semitransparente
                backdropFilter: 'blur(1px)', // Efecto de desenfoque
            }}></div>
            <div className="position-relative z-1"> {/* Asegura que el contenido esté encima del fondo */}
                {/* Puedes optar por no mostrar el título aquí si tu LoginForm ya tiene uno */}
                {/* <h1 className="text-white text-center mb-4">Login</h1> */}
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;