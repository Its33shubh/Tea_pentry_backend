const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { getMyNotifications } = require("../controllers/notificationController");
const roleMiddleware = require("../middleware/roleMiddleware");

// Employee gets own notifications
router.get(
  "/",
  auth,
  roleMiddleware("employee"),
  getMyNotifications
);

module.exports = router;