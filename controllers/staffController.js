const Request = require('../models/request')

// GET REQUESTS FOR STAFF
exports.getAllRequests = async (req, res) => {
    try {

        const requests = await Request.find({
            status: { $in: ['pending', 'in_progress'] }
        })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json({
            error: false,
            success: true,
            message: "Requests fetched successfully",
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

exports.updateRequestStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatus = ['pending', 'in_progress', 'delivered'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid status value"
            });
        }

        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Request not found"
            });
        }

        request.status = status;

        await request.save();

        res.status(200).json({
            error: false,
            success: true,
            message: "Request status updated successfully",
            request
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        });
    }
}