const express = require('express')
const router = express.Router()

const { Register, Login,forgotPassword,resetPassword,changePassword } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register',Register)
router.post('/login',Login)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/change-password", authMiddleware, changePassword);



router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        message: "Protected route",
        user: req.user
    });
});

module.exports = router