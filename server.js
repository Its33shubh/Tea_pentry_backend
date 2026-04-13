const express = require('express')

const app = express()

app.use(express.json())


app.get('/',(req,res)=>{
    res.send("API running")
})  

PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running is ${PORT}`)
})