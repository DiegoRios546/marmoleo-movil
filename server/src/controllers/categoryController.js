const db = require('../config/db');

const getCategories = (req, res) => {
    const query = 'SELECT id, nombre FROM categorias';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching categories:", err);
            return res.status(500).json({ message: "Error al obtener las categorías" });
        }
        res.json(results);
    });
};

const createCategory = (req, res) => {
    const { nombre } = req.body;
    const query = 'INSERT INTO categorias (nombre) VALUES (?)';
    db.query(query, [nombre], (err, result) => {
        if (err) {
            console.error("Error creating category:", err);
            return res.status(500).json({ message: "Error al crear la categoría" });
        }
        res.status(201).json({ message: "Categoría creada exitosamente", categoryId: result.insertId });
    });
};

const updateCategory = (req, res) => {
    const { categoryId } = req.params;
    const { nombre } = req.body;
    const query = 'UPDATE categorias SET nombre = ? WHERE id = ?';
    db.query(query, [nombre, categoryId], (err, result) => {
        if (err) {
            console.error(`Error updating category with ID ${categoryId}:`, err);
            return res.status(500).json({ message: "Error al actualizar la categoría" });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: `Categoría con ID ${categoryId} actualizada exitosamente` });
        } else {
            res.status(404).json({ message: `Categoría con ID ${categoryId} no encontrada` });
        }
    });
};

const deleteCategory = (req, res) => {
    const { categoryId } = req.params;
    const query = 'DELETE FROM categorias WHERE id = ?';
    db.query(query, [categoryId], (err, result) => {
        if (err) {
            console.error(`Error deleting category with ID ${categoryId}:`, err);
            return res.status(500).json({ message: "Error al eliminar la categoría" });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: `Categoría con ID ${categoryId} eliminada exitosamente` });
        } else {
            res.status(404).json({ message: `Categoría con ID ${categoryId} no encontrada` });
        }
    });
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};