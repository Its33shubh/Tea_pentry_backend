const Request = require('../models/request')

exports.createRequest = async(req,res)=>{
    try {
        
        const {item,note } = req.body

        if(!item){
            return res.status(400).json({
                error: true,
                success: false,
                message: "Item is required"
            })

        }
        
        const request = new Request({
            userId: req.user._id,
            item,
            note
        })

        await request.save();

        res.status(201).json({
            error: false,
            success: true,
            message: "Request created successfully",
            request
        })

    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        })
    }
}

exports.getMyRequests  = async(req,res)=>{
    try {
        const requests = await Request.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

            if (requests.length === 0) {
                return res.status(200).json({
                    error: false,
                    success: true,
                    message: "No requests found",
                    requests: []
                });
            }
    
            res.status(200).json({
                error: false,
                success: true,
                message: "My requests fetched successfully",
                requests
            })   
    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        })
    }
}