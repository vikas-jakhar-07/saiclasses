const mongoose = require('mongoose');

const checkDBStatus = () => {
    return {
        connected: mongoose.connection.readyState === 1,
        state: mongoose.STATES[mongoose.connection.readyState]
    };
};

const dbStatusMiddleware = (req, res, next) => {
    const dbStatus = checkDBStatus();
    if (!dbStatus.connected) {
        return res.status(503).json({
            message: 'Database not connected',
            status: dbStatus.state
        });
    }
    next();
};

module.exports = { checkDBStatus, dbStatusMiddleware };