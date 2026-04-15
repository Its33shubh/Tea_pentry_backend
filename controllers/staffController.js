const Request = require('../models/request')

// GET REQUESTS FOR STAFF
exports.getAllRequests = async (req, res) => {
    try {

        const { status, item, date } = req.query;
        // filter by status
        let filter = {
            status: { $in: ['pending', 'in_progress'] }
        };

        if (status) {
            const allowedStatus = ['pending', 'in_progress', 'delivered'];

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    error: true,
                    success: false,
                    message: "Invalid status"
                });
            }

            filter.status = status;
        }
            // filter by item
        if (item) {
            filter.item = { $regex: item, $options: 'i' };
        }
        // filter by date
        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1); //2026-04-15 00:00 → 2026-04-16 00:00

            filter.createdAt = {
                $gte: start,
                $lt: end
            };
        }

        const requests = await Request.find(filter)
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
};
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
         // Prevent same status
         if (request.status === status) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Request already in this status"
            });
        }

        // Flow validation  like pending that goes in in_progress not direct to the delivered status
        if (status === "in_progress" && request.status !== "pending") {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Only pending requests can move to in_progress"
            });
        }

        if (status === "delivered" && request.status !== "in_progress") {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Request must be in_progress before delivery"
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