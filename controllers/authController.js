const User = require('../models/user')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.Register = async (req,res)=>{
    try {
        
        let {name,email,password}= req.body;

        // console.log(name,email,password);

        if (!name|| !email|| !password)
        {
            return res.status(400).json({
                error:true,
                success:false,
                message:"All Fields Are Require"
            })
        }

        let emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegExp.test(email))
        {
            return res.status(400).json({
                error:true,
                success:false,
                message:"Invalid Email Formate"
            })
        }

        if(password.length  <4)
        {
            return res.status(400).json({
                error:true,
                success:false,
                message:"Password must be at least 4 characters"
            })
        }
        
        let user = await User.findOne({email})
        if (user)
        {
            return res.status(400).json({
                error:true,
                success:false,
                message:"User already Exist"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password : hashedPassword
        })

        await user.save()
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {
        res.status(500).json({
            error:true,
            success:false,
            message: err.message
        });
    }
}

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
                name: user.name,
                email: user.email,
                role: user.role
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