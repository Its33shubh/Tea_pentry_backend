const express = require('express')
const router = express.Router()

const { getAllRequests } = require('../controllers/superAdminController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// GET ALL REQUESTS
router.get('/requests',
    authMiddleware,
    roleMiddleware('super_admin'),
    getAllRequests
)

module.exports = router