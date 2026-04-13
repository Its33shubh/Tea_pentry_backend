const JWT = require('jsonwebtoken')

const authMiddleware =(req,res,next)=>{
    try {
            const token = req.headers.authorization;
            // console.log(token);

            if(!token)
            {
                return res.status(401).json({
                    error:true,
                    success:false,
                    message:"No Token , Access Denied"
                })
            }

            const cleanToken = token.split(" ")[1];

            const decoded = JWT.verify(cleanToken,process.env.JWT_SECRET) 

            req.user = decoded

            next();
            
    } catch (err) {
        return res.status(401).json({
            error: true,
            success: false,
            message: "Invalid token"
        })
    }
}

module.exports = authMiddleware