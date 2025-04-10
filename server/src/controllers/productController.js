const db = require('../config/db');

const getProducts = (req, res) => {
    const query = 'SELECT id, nombre, descripcion, precio, unidad_medida, categoria_id, imagen_url, fecha_actualizacion FROM productos';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ message: "Error al obtener los productos" });
        }
        res.json(results);
    });
};

const getProductById = (req, res) => {
    const { productId } = req.params;
    const query = 'SELECT id, nombre, descripcion, precio, unidad_medida, categoria_id, imagen_url, fecha_actualizacion FROM productos WHERE id = ?';
    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error(`Error fetching product with ID ${productId}:`, err);
            return res.status(500).json({ message: "Error al obtener el producto" });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: `Producto con ID ${productId} no encontrado` });
        }
    });
};

const createProduct = (req, res) => {
    const { nombre, descripcion, precio, unidad_medida, categoria_id, imagen_url } = req.body;
    const query = `
        INSERT INTO productos (nombre, descripcion, precio, unidad_medida, categoria_id, imagen_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
        query,
        [nombre, descripcion, precio, unidad_medida, categoria_id, imagen_url],
        (err, result) => {
            if (err) {
                console.error("Error creating product:", err);
                return res.status(500).json({ message: "Error al crear el producto" });
            }
            res.status(201).json({ message: "Producto creado exitosamente", productId: result.insertId });
        }
    );
};

const updateProduct = (req, res) => {
    const { productId } = req.params;
    const { nombre, descripcion, precio, unidad_medida, categoria_id, imagen_url } = req.body;
    const query = `
        UPDATE productos SET
            nombre = ?,
            descripcion = ?,
            precio = ?,
            unidad_medida = ?,
            categoria_id = ?,
            imagen_url = ?
        WHERE id = ?
    `;
    db.query(
        query,
        [nombre, descripcion, precio, unidad_medida, categoria_id, imagen_url, productId],
        (err, result) => {
            if (err) {
                console.error(`Error updating product with ID ${productId}:`, err);
                return res.status(500).json({ message: "Error al actualizar el producto" });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ message: `Producto con ID ${productId} actualizado exitosamente` });
            } else {
                res.status(404).json({ message: `Producto con ID ${productId} no encontrado` });
            }
        }
    );
};

const deleteProduct = (req, res) => {
    const { productId } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';
    db.query(query, [productId], (err, result) => {
        if (err) {
            console.error(`Error deleting product with ID ${productId}:`, err);
            return res.status(500).json({ message: "Error al eliminar el producto" });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: `Producto con ID ${productId} eliminado exitosamente` });
        } else {
            res.status(404).json({ message: `Producto con ID ${productId} no encontrado` });
        }
    });
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};