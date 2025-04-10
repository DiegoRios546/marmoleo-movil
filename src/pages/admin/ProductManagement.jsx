import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct as createProductAPI, updateProduct as updateProductAPI, deleteProduct as deleteProductAPI, fetchCategories } from '../../api/auth'; // Import fetchCategories
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

const ProductManagement = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState();
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [productModalType, setProductModalType] = useState('add'); // 'add' o 'edit'
    const [selectedProduct, setSelectedProduct] = useState({
        id: null,
        nombre: '',
        descripcion: '',
        precio: '',
        unidad_medida: 'kg',
        categoria_id: null,
        imagen_url: ''
    });
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState(null);

    const fetchProductData = async () => {
        setProductsLoading(true);
        setProductsError(null);
        try {
            const data = await fetchProducts(token);
            setProducts(data);
        } catch (err) {
            setProductsError(err.message || 'Error al cargar los productos.');
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchCategoriesData = async () => {
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
        fetchProductData();
        fetchCategoriesData();
    }, [token]);

    const handleShowProductModal = (type, product = { id: null, nombre: '', descripcion: '', precio: '', unidad_medida: 'kg', categoria_id: null, imagen_url: '' }) => {
        setProductModalType(type);
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const handleCloseProductModal = () => {
        setShowProductModal(false);
        setSelectedProduct({ id: null, nombre: '', descripcion: '', precio: '', unidad_medida: 'kg', categoria_id: null, imagen_url: '' });
    };

    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct(prevProduct => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleCreateProduct = async () => {
        try {
            await createProductAPI(token, selectedProduct);
            Swal.fire('Producto creado', 'El producto ha sido creado exitosamente.', 'success');
            fetchProductData();
            handleCloseProductModal();
        } catch (err) {
            Swal.fire('Error', err.message || 'Error al crear el producto.', 'error');
        }
    };

    const handleUpdateProduct = async () => {
        try {
            await updateProductAPI(token, selectedProduct.id, selectedProduct);
            Swal.fire('Producto actualizado', 'El producto ha sido actualizado exitosamente.', 'success');
            fetchProductData();
            handleCloseProductModal();
        } catch (err) {
            Swal.fire('Error', err.message || 'Error al actualizar el producto.', 'error');
        }
    };

    const handleDeleteProduct = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar este producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProductAPI(token, id);
                    Swal.fire('Producto eliminado', 'El producto ha sido eliminado exitosamente.', 'success');
                    fetchProductData();
                } catch (err) {
                    Swal.fire('Error', err.message || 'Error al eliminar el producto.', 'error');
                }
            }
        });
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.nombre : 'Sin Categoría';
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="mb-4 text-danger">Administración de Productos</h2>
                <Button variant="primary" className="mb-3" onClick={() => handleShowProductModal('add')}>
                    <FontAwesomeIcon icon={faPlus} /> Agregar Producto
                </Button>
                {productsLoading || categoriesLoading ? (
                    <p>Cargando productos y categorías...</p>
                ) : productsError ? (
                    <p className="text-danger">Error: {productsError}</p>
                ) : categoriesError ? (
                    <p className="text-danger">Error al cargar categorías: {categoriesError}</p>
                ) : (
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Unidad</th>
                                    <th>Categoría</th> {/* Changed header */}
                                    <th>Imagen URL</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products && products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.nombre}</td>
                                        <td>{product.descripcion}</td>
                                        <td>${product.precio}</td>
                                        <td>{product.unidad_medida}</td>
                                        <td>{getCategoryName(product.categoria_id)}</td> {/* Display category name */}
                                        <td>{product.imagen_url}</td>
                                        <td>
                                            <Button variant="info" size="sm" className="me-2" onClick={() => handleShowProductModal('edit', product)}>
                                                <FontAwesomeIcon icon={faEdit} /> Editar
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                                                <FontAwesomeIcon icon={faTrash} /> Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
                {products && products.length === 0 && !productsLoading && <p>No hay productos.</p>}
            </div>

            {/* Modal para Productos */}
            <Modal show={showProductModal} onHide={handleCloseProductModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{productModalType === 'add' ? 'Agregar Nuevo Producto' : 'Editar Producto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <Form.Group className="mb-3 col-md-6">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={selectedProduct.nombre}
                                    onChange={handleProductInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="precio"
                                    value={selectedProduct.precio}
                                    onChange={handleProductInputChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="row">
                            <Form.Group className="mb-3 col-md-4">
                                <Form.Label>Unidad de Medida</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="unidad_medida"
                                    value={selectedProduct.unidad_medida}
                                    onChange={handleProductInputChange}
                                >
                                    <option value="kg">Kilogramo (kg)</option>
                                    <option value="lb">Libra (lb)</option>
                                    <option value="unidad">Unidad</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-4">
                                <Form.Label>Categoría</Form.Label> {/* Changed label in modal */}
                                <Form.Control
                                    as="select"
                                    name="categoria_id"
                                    value={selectedProduct.categoria_id}
                                    onChange={handleProductInputChange}
                                >
                                    <option value={null}>Seleccionar Categoría</option>
                                    {!categoriesLoading && !categoriesError && categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.nombre}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-4">
                                <Form.Label>Imagen URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="imagen_url"
                                    value={selectedProduct.imagen_url}
                                    onChange={handleProductInputChange}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="descripcion"
                                value={selectedProduct.descripcion}
                                onChange={handleProductInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseProductModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={productModalType === 'add' ? handleCreateProduct : handleUpdateProduct}>
                        {productModalType === 'add' ? 'Guardar Producto' : 'Actualizar Producto'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductManagement;