const jwt = require('jsonwebtoken');
const SECRET_KEY = 'test1243rahul'

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid or expired token",
                    status: "error",
                });
            } 
            
            req.user = user; 
            req.body.user_id = user.id
            req.body.user_email = user.email
            next();
        });
    } else {
        return res.status(401).json({
            message: "Authorization header missing",
            status: "error",
        });
    }
};

module.exports = authenticateJWT;
