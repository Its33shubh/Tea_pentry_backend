const JWT = require('jsonwebtoken')
const User = require('../models/user')

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // console.log(token);

        if (!token) {
            return res.status(401).json({
                error: true,
                success: false,
                message: "No Token , Access Denied"
            })
        }

        const cleanToken = token.split(" ")[1];

        const decoded = JWT.verify(cleanToken, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)

        if (!user) {
            if (!user) {
                return res.status(401).json({
                    error: true,
                    success: false,
                    message: "User not found"
                })
            }
        }

        if (!user.isActive) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Account is deactivated"
            })
        }

        req.user = user
        
        next();

    } catch (err) {
        return res.status(401).json({
            error: true,
            success: false,
            message: "Invalid token"
        })
    }
}

module.exports = authMiddleware