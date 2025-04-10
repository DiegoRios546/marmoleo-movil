const connection = require('../config/db');

module.exports.ping = (req, res) => {
    const query = 'SELECT * FROM login';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};
