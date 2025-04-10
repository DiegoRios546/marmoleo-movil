// server/src/controllers/userController.js
const db = require('../config/db');

const getUsers = (req, res) => {
    const query = 'SELECT id, phone, name, email, username, creationDate, role FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Error al obtener los usuarios" });
        }
        res.json(results);
    });
};

const createUser = (req, res) => {
    const { phone, name, email, username, password, role } = req.body;
    const query = `
        INSERT INTO users (phone, name, email, username, password, role)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    // **Importante: Debes hashear la contraseña antes de guardarla en la base de datos.**
    db.query(
        query,
        [phone, name, email, username, password, role], // Reemplaza 'password' con la contraseña hasheada
        (err, result) => {
            if (err) {
                console.error("Error creating user:", err);
                return res.status(500).json({ message: "Error al crear el usuario" });
            }
            res.status(201).json({ message: "Usuario creado exitosamente", userId: result.insertId });
        }
    );
};

const updateUser = (req, res) => {
    const { userId } = req.params;
    const { phone, name, email, username, password, role } = req.body;
    let query = `
        UPDATE users SET
            phone = ?,
            name = ?,
            email = ?,
            username = ?,
            role = ?
        WHERE id = ?
    `;
    const params = [phone, name, email, username, role, userId];

    if (password) {
        query = `
            UPDATE users SET
                phone = ?,
                name = ?,
                email = ?,
                username = ?,
                password = ?,
                role = ?
            WHERE id = ?
        `;
        params.unshift(password); // Añade la contraseña al principio de los parámetros
    }

    db.query(
        query,
        params,
        (err, result) => {
            if (err) {
                console.error(`Error updating user with ID ${userId}:`, err);
                return res.status(500).json({ message: "Error al actualizar el usuario" });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ message: `Usuario con ID ${userId} actualizado exitosamente` });
            } else {
                res.status(404).json({ message: `Usuario con ID ${userId} no encontrado` });
            }
        }
    );
};

const deleteUser = (req, res) => {
    const { userId } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error(`Error deleting user with ID ${userId}:`, err);
            return res.status(500).json({ message: "Error al eliminar el usuario" });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: `Usuario con ID ${userId} eliminado exitosamente` });
        } else {
            res.status(404).json({ message: `Usuario con ID ${userId} no encontrado` });
        }
    });
};

const getUsersByRole = (req, res) => {
    const { role } = req.params;
    const query = 'SELECT id, name, username FROM users WHERE role = ?';
    db.query(query, [role], (err, results) => {
        if (err) {
            console.error(`Error fetching users with role ${role}:`, err);
            return res.status(500).json({ message: `Error al obtener los usuarios con rol ${role}` });
        }
        res.json(results);
    });
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUsersByRole,
};