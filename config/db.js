const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
            await mongoose.connect(process.env.MONGO_URL)
                console.log('mongoDB is Connected ');
                
    } catch (err) {
        console.log('error:',err.message);
        process.exit(1)
        
    }
}

module.exports = connectDB