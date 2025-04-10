import React, { useState, useEffect } from 'react';
import { fetchBusinessInfo, updateBusinessInfoAPI } from '../../api/auth';
import { Button, Form } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const BusinessInfoManagement = () => {
    const { token } = useAuth();
    const [businessInfo, setBusinessInfo] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        operating_hours: '',
        base_shipping_fee: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchBusinessInfo(token);
            setBusinessInfo(data);
        } catch (err) {
            setError(err.message || 'Error al cargar la información del negocio.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusinessInfo(prevInfo => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        fetchInfo(); // Reload data to discard changes
    };

    const handleSaveClick = async () => {
        try {
            await updateBusinessInfoAPI(token, businessInfo);
            Swal.fire('Información Actualizada', 'La información del negocio ha sido actualizada exitosamente.', 'success');
            setIsEditing(false);
            fetchInfo(); // Reload data to show updated info
        } catch (err) {
            Swal.fire('Error', err.message || 'Error al actualizar la información del negocio.', 'error');
        }
    };

    if (loading) {
        return <p>Cargando información del negocio...</p>;
    }

    if (error) {
        return <p className="text-danger">Error: {error}</p>;
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="mb-4 text-danger">Información del Negocio</h2>
                {!isEditing ? (
                    <div>
                        <p><strong>Nombre:</strong> {businessInfo.name}</p>
                        <p><strong>Dirección:</strong> {businessInfo.address}</p>
                        <p><strong>Teléfono:</strong> {businessInfo.phone}</p>
                        <p><strong>Correo Electrónico:</strong> {businessInfo.email}</p>
                        <p><strong>Horario de Atención:</strong> {businessInfo.operating_hours}</p>
                        <p><strong>Tarifa de Envío Base:</strong> ${businessInfo.base_shipping_fee}</p>
                        <Button variant="primary" onClick={handleEditClick}>Editar Información</Button>
                    </div>
                ) : (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Carnicería</Form.Label>
                            <Form.Control type="text" name="name" value={businessInfo.name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" name="address" value={businessInfo.address} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Número de Teléfono de Contacto</Form.Label>
                            <Form.Control type="text" name="phone" value={businessInfo.phone} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico de Contacto</Form.Label>
                            <Form.Control type="email" name="email" value={businessInfo.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Horario de Atención</Form.Label>
                            <Form.Control type="text" name="operating_hours" value={businessInfo.operating_hours} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Configurar Tarifas de Envío Base</Form.Label>
                            <Form.Control type="number" name="base_shipping_fee" value={businessInfo.base_shipping_fee} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSaveClick} className="me-2">Guardar</Button>
                        <Button variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default BusinessInfoManagement;