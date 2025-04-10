const db = require('../config/db');

const getOrders = (req, res) => {
    const query = `
        SELECT
            p.id,
            p.numero_pedido,
            p.fecha_pedido,
            p.nombre_cliente,
            p.direccion_entrega,
            p.estado,
            p.repartidor_asignado,
            p.fecha_entrega_estimada,
            p.comentarios,
            p.created_at,
            p.updated_at,
            u.username AS repartidor_username
        FROM pedidos p
        LEFT JOIN users u ON p.repartidor_asignado = u.id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching orders with driver info:", err);
            return res.status(500).json({ message: "Error al obtener los pedidos" });
        }
        res.json(results);
    });
};

// Renombramos la función para que sea más específica para administradores
const updateAdminOrder = (req, res) => {
    const { orderId } = req.params;
    const { estado, repartidor_asignado, fecha_entrega_estimada } = req.body;
    const query = 'UPDATE pedidos SET estado = ?, repartidor_asignado = ?, fecha_entrega_estimada = ? WHERE id = ?';
    db.query(query, [estado, repartidor_asignado, fecha_entrega_estimada, orderId], (err, result) => {
        if (err) {
            console.error(`Error updating order ${orderId}:`, err);
            return res.status(500).json({ message: "Error al actualizar el estado del pedido" });
        }
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Pedido con ID ${orderId} actualizado` });
        } else {
            return res.status(404).json({ message: `Pedido con ID ${orderId} no encontrado` });
        }
    });
};

const assignDriverToOrder = (req, res) => {
    const { orderId } = req.params;
    const { driverId } = req.body;
    const query = 'UPDATE pedidos SET repartidor_asignado = ? WHERE id = ?';
    db.query(query, [driverId, orderId], (err, result) => {
        if (err) {
            console.error(`Error assigning driver ${driverId} to order ${orderId}:`, err);
            return res.status(500).json({ message: "Error al asignar el repartidor al pedido" });
        }
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Repartidor ${driverId} asignado al pedido ${orderId}` });
        } else {
            return res.status(404).json({ message: `Pedido con ID ${orderId} no encontrado` });
        }
    });
};

// Funciones para que los usuarios gestionen sus propios pedidos
const getUserOrders = (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario logueado
    const query = `
        SELECT
            id,
            numero_pedido,
            fecha_pedido,
            nombre_cliente,
            direccion_entrega,
            estado,
            repartidor_asignado,
            fecha_entrega_estimada,
            comentarios,
            created_at,
            updated_at
        FROM pedidos
        WHERE user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user orders:", err);
            return res.status(500).json({ message: "Error al obtener tus pedidos" });
        }
        res.json(results);
    });
};

const createUserOrder = (req, res) => {
    const userId = req.user.id;
    const { numero_pedido, nombre_cliente, direccion_entrega, estado, repartidor_asignado, fecha_entrega_estimada, comentarios } = req.body;

    const query = 'INSERT INTO pedidos (numero_pedido, nombre_cliente, direccion_entrega, estado, repartidor_asignado, fecha_entrega_estimada, comentarios, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [numero_pedido, nombre_cliente, direccion_entrega, estado, repartidor_asignado, fecha_entrega_estimada, comentarios, userId], (err, result) => {
        if (err) {
            console.error("Error creating order:", err);
            return res.status(500).json({ message: "Error al crear el pedido" });
        }
        res.status(201).json({ message: "Pedido creado exitosamente", orderId: result.insertId });
    });
};

const updateUserOrder = (req, res) => {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { numero_pedido, nombre_cliente, direccion_entrega, fecha_entrega_estimada, comentarios } = req.body;

    // Primero, obtenemos el pedido original para preservar los campos no modificables
    const selectQuery = 'SELECT fecha_pedido, estado, repartidor_asignado, user_id FROM pedidos WHERE id = ? AND user_id = ?';
    db.query(selectQuery, [orderId, userId], (err, originalOrderResults) => {
        if (err) {
            console.error(`Error fetching original order ${orderId}:`, err);
            return res.status(500).json({ message: "Error al verificar el pedido" });
        }

        if (originalOrderResults.length === 0) {
            return res.status(404).json({ message: `Pedido con ID ${orderId} no encontrado o no pertenece al usuario` });
        }

        const originalOrder = originalOrderResults[0];

        const updateQuery = `
            UPDATE pedidos
            SET numero_pedido = ?,
                nombre_cliente = ?,
                direccion_entrega = ?,
                fecha_pedido = ?,
                estado = ?,
                repartidor_asignado = ?,
                fecha_entrega_estimada = ?,
                comentarios = ?
            WHERE id = ? AND user_id = ?
        `;
        db.query(updateQuery, [
            numero_pedido,
            nombre_cliente,
            direccion_entrega,
            originalOrder.fecha_pedido, // Usar el valor original
            originalOrder.estado,        // Usar el valor original
            originalOrder.repartidor_asignado, // Usar el valor original
            fecha_entrega_estimada,
            comentarios,
            orderId,
            userId
        ], (err, result) => {
            if (err) {
                console.error(`Error updating order ${orderId}:`, err);
                return res.status(500).json({ message: "Error al actualizar el pedido" });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ message: `Pedido con ID ${orderId} actualizado exitosamente` });
            } else {
                res.status(404).json({ message: `Pedido con ID ${orderId} no encontrado o no pertenece al usuario` });
            }
        });
    });
};

const deleteUserOrder = (req, res) => {
    const userId = req.user.id;
    const { orderId } = req.params;

    const query = 'DELETE FROM pedidos WHERE id = ? AND user_id = ?';
    db.query(query, [orderId, userId], (err, result) => {
        if (err) {
            console.error(`Error deleting order ${orderId}:`, err);
            return res.status(500).json({ message: "Error al eliminar el pedido" });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: `Pedido con ID ${orderId} eliminado exitosamente` });
        } else {
            res.status(404).json({ message: `Pedido con ID ${orderId} no encontrado o no pertenece al usuario` });
        }
    });
};

// Nuevas funciones para el repartidor (moderator)
const getAssignedOrders = (req, res) => {
    const driverId = req.user.id; // Obtener el ID del repartidor logueado
    const query = `
        SELECT
            id,
            numero_pedido,
            fecha_pedido,
            nombre_cliente,
            direccion_entrega,
            estado,
            repartidor_asignado,
            fecha_entrega_estimada,
            comentarios,
            created_at,
            updated_at
        FROM pedidos
        WHERE repartidor_asignado = ?
    `;
    db.query(query, [driverId], (err, results) => {
        if (err) {
            console.error("Error fetching assigned orders:", err);
            return res.status(500).json({ message: "Error al obtener los pedidos asignados" });
        }
        res.json(results);
    });
};

const updateOrderStatusByModerator = (req, res) => {
    const driverId = req.user.id; // Obtener el ID del repartidor logueado
    const { orderId } = req.params;
    const { estado } = req.body;

    // Verificar que el estado sea uno de los permitidos para el repartidor
    const allowedStates = ['Pendiente', 'En camino', 'Entregado'];
    if (!allowedStates.includes(estado)) {
        return res.status(400).json({ message: `El estado debe ser uno de los siguientes: ${allowedStates.join(', ')}` });
    }

    const query = 'UPDATE pedidos SET estado = ? WHERE id = ? AND repartidor_asignado = ?';
    db.query(query, [estado, orderId, driverId], (err, result) => {
        if (err) {
            console.error(`Error updating order ${orderId} by driver ${driverId}:`, err);
            return res.status(500).json({ message: "Error al actualizar el estado del pedido" });
        }
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Estado del pedido con ID ${orderId} actualizado a ${estado}` });
        } else {
            return res.status(404).json({ message: `Pedido con ID ${orderId} no encontrado o no asignado a este repartidor` });
        }
    });
};

module.exports = {
    getOrders,
    updateAdminOrder,
    assignDriverToOrder,
    getUserOrders,
    createUserOrder,
    updateUserOrder,
    deleteUserOrder,
    getAssignedOrders, // Exportar la nueva función
    updateOrderStatusByModerator, // Exportar la nueva función
};