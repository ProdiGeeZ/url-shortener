const db = require('../db/connection');

exports.getHealthStatus = async (req, res, next) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.status(200).json({
            status: 'healthy',
            timestamp: result.rows[0].now,
            message: 'URL shortener service is running'
        });
    } catch (err) {
        next({ status: 500, msg: 'Service Unhealthy - Database connection failed' });
    }
}; 