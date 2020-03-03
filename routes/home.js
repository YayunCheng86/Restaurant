const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// 首頁
router.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            res.render('index', { restaurants: restaurants })
        })
})

module.exports = router