const express = require('express')
const router = express.Router()

const { createRequest, getMyRequests } = require('../controllers/employeeController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// CREATE REQUEST
router.post('/request',
    authMiddleware,
    roleMiddleware('employee'),
    createRequest
)

// GET MY REQUESTS
router.get('/my-requests',
    authMiddleware,
    roleMiddleware('employee'),
    getMyRequests
)

module.exports = router