// Import the database connection
const db = require('../config/db');

const getBusinessInfo = (req, res) => {
    const query = 'SELECT id, name, address, phone, email, operating_hours, base_shipping_fee FROM business_info LIMIT 1';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching business information:", err);
            return res.status(500).json({ message: "Error al obtener la información del negocio" });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            // If no info exists, you might want to return a default object or a 404
            res.status(200).json({}); // Returning an empty object for now
        }
    });
};

const updateBusinessInfo = (req, res) => {
    const { name, address, phone, email, operating_hours, base_shipping_fee } = req.body;
    const query = `
        UPDATE business_info SET
            name = ?,
            address = ?,
            phone = ?,
            email = ?,
            operating_hours = ?,
            base_shipping_fee = ?
        WHERE id = 1 
    `;
    db.query(
        query,
        [name, address, phone, email, operating_hours, base_shipping_fee],
        (err, result) => {
            if (err) {
                console.error("Error updating business information:", err);
                return res.status(500).json({ message: "Error al actualizar la información del negocio" });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ message: "Información del negocio actualizada exitosamente" });
            } else {
                res.status(404).json({ message: "No se encontró la información del negocio para actualizar" });
            }
        }
    );
};

module.exports = {
    getBusinessInfo,
    updateBusinessInfo,
};