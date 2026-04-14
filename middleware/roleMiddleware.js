

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // req.user comes from authMiddleware
            const userRole = req.user.role;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    error: true,
                    success: false,
                    message: `Access Denied. Required role: ${allowedRoles.join(', ')}`
                });
            }

            next();

        } catch (err) {
            return res.status(500).json({
                error: true,
                success: false,
                message: err.message
            });
        }
    };
};

module.exports = roleMiddleware;