const User = require('../models/user')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.Register = async (req, res) => {
    try {

        let { firstName, lastName, email, password, confirmPassword } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All Fields Are Required"
            });
        }

        // email validation
        let emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegExp.test(email)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid Email Format"
            });
        }

        // password length
        if (password.length < 4) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Password must be at least 4 characters"
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Passwords do not match"
            });
        }

        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            error: false,
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        });
    }
};

exports.Login = async (req,res) =>{
    try {
        
        let {email,password} = req.body
        if(!email|| !password)
        {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Email and Password are required"
            });
        }

        let user  = await User.findOne({email})
        if(!user)
        {
            return res.status(400).json({
                error: true,
                success: false,
                message: "User not Found"
            });   
        }
        if(!user.isActive)
            {
                return res.status(403).json({
                    error: true,
                    success: false,
                    message: "Account is deactivated. Contact Admin"
                });
            }

        let isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)
        {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid Password"
            });  
        }

        let token = JWT.sign(
            {id:user.id,role:user.role},
            process.env.JWT_SECRET ,
            {expiresIn:"1d"}
        ) 

        res.status(200).json({
            error: false,
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isActive: user.isActive 
            }
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            success: false,
            message: err.message
        });
    }
}