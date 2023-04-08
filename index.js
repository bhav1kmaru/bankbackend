const express=require('express')
const cors=require('cors')
const { connection } = require('./config/db')
const { accRouter } = require('./routes/Account.routes')

const app=express()
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Welcome to Bank backend!')
})

app.use('/account',accRouter)

const port=8080
app.listen(port,async()=>{
    console.log('server running on port '+port)
    try {
        await connection
        console.log('connected to db')
    } catch (error) {
        console.log('could not connect to db')
    }
})