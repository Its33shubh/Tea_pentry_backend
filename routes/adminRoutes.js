const express = require('express')
const router = express.Router()

const { getAllRequests } = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// GET ALL REQUESTS
router.get('/requests',
    authMiddleware,
    roleMiddleware('admin'),
    getAllRequests
)

module.exports = router