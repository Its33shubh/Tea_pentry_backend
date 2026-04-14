const express = require('express')
const router = express.Router()

const { getAllRequests, updateRequestStatus } = require('../controllers/staffController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// GET REQUESTS
router.get('/requests',
    authMiddleware,
    roleMiddleware('staff'),
    getAllRequests
)

// UPDATE STATUS
router.put('/request/:id',
    authMiddleware,
    roleMiddleware('staff'),
    updateRequestStatus
)

module.exports = router