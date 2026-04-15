const Request = require('../models/request')
const User = require('../models/user')

// GET ALL REQUESTS + FILTER
exports.getAllRequests = async (req, res) => {
    try {

        const { status } = req.query;

        let filter = {};

        const allowedStatus = ['pending', 'in_progress', 'delivered'];

        // optional filter
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

//  1. GET ALL USERS (SEARCH + FILTER)

exports.getAllUsers = async(req,res) =>{
    try {
        const {search , role ,isActive} = req.query

        let query = {
            role: { $ne: "super_admin" }
        };

        //for search 

        if (search) {  // $or means match name or email 
            query.$or = [  // $regex means MongoDB ka search pattern
                {name : {$regex : search, $options:"i"}},
                {email : {$regex : search, $options:"i"}}
            ]
        }
        //filter by role
        if (role) {
            query.role = role;
        }

        // filter by status
           if (isActive !== undefined) {
            query.isActive = isActive === "true";
        }


    const user = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            error: false,
            success: true,
            user
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        });
    }
}

exports.updateUserRole = async (req, res) => {
    try {

        const { role } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found"
            });
        }

        // not change role of super admin
        if (user.role === "super_admin") {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Cannot modify Super Admin"
            });
        }

        user.role = role;
        await user.save();

        const userObj = user.toObject();
        delete userObj.password;
        
        res.status(200).json({
            error: false,
            success: true,
            message: "User role updated",
            user: userObj
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        });
    }
}

exports.updateUserStatus = async(req,res)=>{
    try {

        const { isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found"
            });
        }

        // not change Super_admin 
        if (user.role === "super_admin") {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Cannot change Super Admin status"
            });
        }

        user.isActive = isActive;
        await user.save();

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({
            error: false,
            success: true,
            message: "User status updated",
            user : userObj
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        });
    }
};




