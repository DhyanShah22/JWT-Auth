const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const authRoutes = require('./Routes/authRoutes')
const app = express()
app.use(cookieParser());
app.use(express.json())

app.use((req,res,next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api', authRoutes)

mongoose.connect(process.env.MONG_URI , {useNewUrlParser: true, useUnifiedTopology: true}) 
    .then(() => {
        app.listen((process.env.PORT), () => {
            console.log('Connected to DB and listening to port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);