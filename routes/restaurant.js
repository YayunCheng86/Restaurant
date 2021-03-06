const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { authenticated } = require('../config/auth')

// 瀏覽全部餐廳 
router.get('/', authenticated, (req, res) => {
    return res.redirect('/')
})

// 新增一家餐廳
router.get('/new', authenticated, (req, res) => {
    res.render('new')
})

// 瀏覽搜尋結果
router.get('/search', authenticated, (req, res) => {
    let keyword = req.query.keyword
    Restaurant.find({ userId: req.user._id })
        .lean()
        .exec((err, restaurants) => {
            let noResult
            if (err) return console.error(err)
            restaurants = restaurants.filter(restaurant => {
                return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
            })
            // 如果搜尋結果是空值，就回傳'no result'
            if (restaurants.length === 0) {
                noResult = 'No results'
            }
            return res.render('index', { restaurants, keyword, noResult })
        })
})

// 瀏覽一家餐廳的詳細資訊                                                   
router.get('/:id', authenticated, (req, res) => {
    Restaurant.findOne({ _id: req.params.id, userId: req.user._id })
        .lean()
        .exec((err, restaurant) => {
            if (err) return console.error(err)
            return res.render('show', { restaurant })
        })
})


// 新增一家餐廳
router.post('/', authenticated, (req, res) => {
    // 建立 Todo model 實例
    const restaurant = new Restaurant({
        name: req.body.name,
        name_en: req.body.name_en,
        category: req.body.category,
        phone: req.body.phone,
        location: req.body.location,
        description: req.body.description,
        image: req.body.image,
        userId: req.user._id
    })
    // 存入資料庫
    restaurant.save(err => {
        if (err) return console.error(err)
        return res.redirect('/')
    })
})

// 修改一家餐廳的資訊頁面
router.get('/:id/edit', authenticated, (req, res) => {
    // 找到資料庫的資料
    Restaurant.findOne({ _id: req.params.id, userId: req.user._id })
        .lean()
        .exec((err, restaurant) => {
            if (err) return console.error(err)
            res.render('edit', { restaurant })
        })
})

// 修改一家餐廳的資訊
router.put('/:id/edit', authenticated, (req, res) => {
    Restaurant.findOne({ _id: req.params.id, userId: req.user._id }, (err, restaurant) => {
        if (err) return console.error(err)
        // 修改資料
        restaurant.name = req.body.name
        restaurant.name_en = req.body.name_en
        restaurant.category = req.body.category
        restaurant.phone = req.body.phone
        restaurant.location = req.body.location
        restaurant.image = req.body.image
        restaurant.description = req.body.description
        // 儲存資料
        restaurant.save(err => {
            if (err) return console.error(err)
            return res.redirect(`/restaurants/${req.params.id}`)
        })
    })
})

// 刪除一家餐廳
router.delete('/:id/delete', authenticated, (req, res) => {
    Restaurant.findOne({ _id: req.params.id, userId: req.user._id }, (err, restaurant) => {
        if (err) return console.error(err)
        restaurant.remove(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})


module.exports = router