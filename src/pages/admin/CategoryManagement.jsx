// src/pages/admin/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory as createCategoryAPI, updateCategory as updateCategoryAPI, deleteCategory as deleteCategoryAPI } from '../../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

const CategoryManagement = () => {
    const { token } = useAuth();
    const [categories, setCategories] = useState();
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryModalType, setCategoryModalType] = useState('add'); // 'add' o 'edit'
    const [selectedCategory, setSelectedCategory] = useState({ id: null, nombre: '' });

    const fetchCategoryData = async () => {
        setCategoriesLoading(true);
        setCategoriesError(null);
        try {
            const data = await fetchCategories(token);
            setCategories(data);
        } catch (err) {
            setCategoriesError(err.message || 'Error al cargar las categorías.');
        } finally {
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, [token]);

    const handleShowCategoryModal = (type, category = { id: null, nombre: '' }) => {
        setCategoryModalType(type);
        setSelectedCategory(category);
        setShowCategoryModal(true);
    };

    const handleCloseCategoryModal = () => {
        setShowCategoryModal(false);
        setSelectedCategory({ id: null, nombre: '' });
    };

    const handleCategoryInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCategory(prevCategory => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    const handleCreateCategory = async () => {
        try {
            await createCategoryAPI(token, selectedCategory);
            Swal.fire('Categoría creada', 'La categoría ha sido creada exitosamente.', 'success');
            fetchCategoryData();
            handleCloseCategoryModal();
        } catch (err) {
            Swal.fire('Error', err.message || 'Error al crear la categoría.', 'error');
        }
    };

    const handleUpdateCategory = async () => {
        try {
            await updateCategoryAPI(token, selectedCategory.id, selectedCategory);
            Swal.fire('Categoría actualizada', 'La categoría ha sido actualizada exitosamente.', 'success');
            fetchCategoryData();
            handleCloseCategoryModal();
        } catch (err) {
            Swal.fire('Error', err.message || 'Error al actualizar la categoría.', 'error');
        }
    };

    const handleDeleteCategory = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar esta categoría?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCategoryAPI(token, id);
                    Swal.fire('Categoría eliminada', 'La categoría ha sido eliminada exitosamente.', 'success');
                    fetchCategoryData();
                } catch (err) {
                    Swal.fire('Error', err.message || 'Error al eliminar la categoría.', 'error');
                }
            }
        });
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h2 className="mb-4 text-danger">Administración de Categorías</h2>
                <Button variant="primary" className="mb-3" onClick={() => handleShowCategoryModal('add')}>
                    <FontAwesomeIcon icon={faPlus} /> Agregar Categoría
                </Button>
                {categoriesLoading ? (
                    <p>Cargando categorías...</p>
                ) : categoriesError ? (
                    <p className="text-danger">Error: {categoriesError}</p>
                ) : (
                    <div className="table-responsive"> {/* Añade esta línea */}
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories && categories.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>{category.nombre}</td>
                                        <td>
                                            <Button variant="info" size="sm" className="me-2" onClick={() => handleShowCategoryModal('edit', category)}>
                                                <FontAwesomeIcon icon={faEdit} /> Editar
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                                                <FontAwesomeIcon icon={faTrash} /> Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
                {categories && categories.length === 0 && !categoriesLoading && <p>No hay categorías.</p>}
            </div>

            {/* Modal para Categorías */}
            <Modal show={showCategoryModal} onHide={handleCloseCategoryModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{categoryModalType === 'add' ? 'Agregar Nueva Categoría' : 'Editar Categoría'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={selectedCategory.nombre}
                                onChange={handleCategoryInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCategoryModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={categoryModalType === 'add' ? handleCreateCategory : handleUpdateCategory}>
                        {categoryModalType === 'add' ? 'Guardar Categoría' : 'Actualizar Categoría'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CategoryManagement;