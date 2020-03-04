const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// 首頁
router.get('/', (req, res) => {
    let dropdown = req.query.name

    if (dropdown === 'location'){   // 地點排序
        Restaurant.find()
        .sort({ location: 'asc' })
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', { restaurants: restaurants })
        })
    } else if (dropdown === 'name') {   // 名稱排序
        Restaurant.find()
        .sort({ name: 'asc' })
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', { restaurants: restaurants })
        })
    } else if (dropdown === 'category') {  // 類別排序
        Restaurant.find()
        .sort({ category: 'asc' })
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', { restaurants: restaurants })
        })
    } else {
        Restaurant.find()
            .sort({ name: 'asc' })
            .lean()
            .exec((err, restaurants) => {
                if (err) return console.error(err)
                return res.render('index', { restaurants: restaurants })
            })
    }

    
})

module.exports = router