const jwt = require('jsonwebtoken');

const JWT_SECRET = "secreatkey";

function authmiddleware(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.id;
        req.username = decoded.username;

        next();

    } catch (err) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

module.exports = authmiddleware;