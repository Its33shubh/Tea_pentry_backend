const Notification = require('../models/notification');

// Get logged-in user's notifications   
exports.getMyNotifications = async (req, res) => {
    try {

        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true }
        );

        // 🔥 Step 2: Fetch notifications
        const notifications = await Notification.find({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            error: false,
            success: true,
            notifications
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        });
    }
};