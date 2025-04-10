const jwt = require('jsonwebtoken');

const authorizeRoles = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).send('Acceso denegado: falta token');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!roles.includes(decoded.role)) {
                return res.status(403).send('Acceso denegado: rol no autorizado');
            }
            req.user = decoded; // Guarda la info del usuario para futuras operaciones
            next();
        } catch (err) {
            res.status(403).send('Acceso denegado');
        }
    };
};

module.exports = authorizeRoles;
