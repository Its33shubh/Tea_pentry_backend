require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const staffRoutes = require('./routes/staffRoutes')
const adminRoutes = require('./routes/adminRoutes')
const superAdminRoutes = require('./routes/superAdminRoutes')

const app = express()

app.use(express.json())

connectDB()

app.get('/',(req,res)=>{
    res.send("API running")
})  

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes)
app.use('/api/staff',staffRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/super-admin',superAdminRoutes)

PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running is ${PORT}`)
})