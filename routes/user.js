const express = require('express')
const router = express.Router()
const User = require('./models/user')

// read login page
router.get('/login', (req, res) => {
    res.render('login')
})

// post login request
router.post('/login', (req, res) => {
    res.send('login')
})

//  read register page 
router.get('/register', (req, res) => {
    res.render('register')
})

// post register request 
router.post('/register', (req, res) => {
    res.send('register')
})

// logout
router.get('/logout', (req, res) => {
    res.send('logout')
})

module.exports = router