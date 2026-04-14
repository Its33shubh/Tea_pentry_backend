const Request = require('../models/request')

// GET ALL REQUESTS 
exports.getAllRequests = async (req, res) => {
    try {

        const { status } = req.query;

        let filter = {};

        const allowedStatus = ['pending', 'in_progress', 'delivered'];

        //  filter
        if (status) {
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    error: true,
                    success: false,
                    message: "Invalid status"
                });
            }
            filter.status = status;
        }

        const requests = await Request.find(filter)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            error: false,
            success: true,
            message: "All requests fetched successfully",
            requests
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        });
    }
}