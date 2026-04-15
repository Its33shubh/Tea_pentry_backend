const express = require('express')
const router = express.Router()

const { getAllRequests , getAllUsers,updateUserRole } = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// GET ALL REQUESTS
router.get('/requests',
    authMiddleware,
    roleMiddleware('admin'),
    getAllRequests
)

// get all user action 
router.get('/users',authMiddleware,roleMiddleware('admin'), getAllUsers)

router.put('/users/:id', authMiddleware, roleMiddleware('admin'), updateUserRole)
module.exports = router