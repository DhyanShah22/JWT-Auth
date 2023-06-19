const express = require('express')

const {
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    getLogout
} = require('../Controllers/authController')
const router = express.Router()

router.get('/signup', getSignup)

router.post('/signup', postSignup)

router.get('/login', getLogin)

router.post('/login', postLogin)

router.get('/logout', getLogout);

module.exports = router