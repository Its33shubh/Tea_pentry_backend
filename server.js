require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const staffRoutes = require('./routes/staffRoutes')
const adminRoutes = require('./routes/adminRoutes')
const superAdminRoutes = require('./routes/superAdminRoutes')
const notificationRoutes = require('./routes/notificationRoutes');
const categoryRoutes = require("./routes/categoryRoutes");



const app = express()

app.use(express.json())

connectDB()

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

app.get('/',(req,res)=>{
    res.send("API running")
})  

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes)
app.use('/api/staff',staffRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/super-admin',superAdminRoutes)
app.use('/api/notifications', notificationRoutes);
app.use('/api/category',categoryRoutes)

PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running is ${PORT}`)
})