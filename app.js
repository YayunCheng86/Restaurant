const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantsList = require('./restaurant.json') 

const port = 3000

// 連線資料庫
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
})

// 載入model
const Restaurant = require('./models/restaurant')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

// route
// 瀏覽全部餐廳 (首頁)
app.get('/restaurants', (req, res) => {
    res.render('index', { restaurants: restaurantsList.results })
})

// 瀏覽一家餐廳的詳細資訊                                                   ////////////////////////////////改_id
app.get('/restaurants/:id', (req, res) => {
    let restaurant = restaurantsList.results.find(restaurant => {
        return restaurant.id.toString() === req.params.id
    })
    res.render('show', { restaurant })
})

// 瀏覽搜尋結果
app.get('/search', (req, res) => {
    let keyword = req.query.keyword
    let restaurantSearch = restaurantsList.results.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })
    res.render('index', { restaurants: restaurantSearch, keyword })
})

// 新增一家餐廳
app.get('/restaurants/new', (req, res) => {
    res.send('新增一家餐廳的頁面')
})

// 新增一家餐廳
app.post('/restaurants', (req, res) => {
    res.send('新增一家餐廳')
})

// 修改一家餐廳的資訊頁面
app.get('/restaurants/:id/edit', (req, res) => {
    res.send('修改一家餐廳的資訊的頁面')
})

// 修改一家餐廳的資訊
app.post('/restaurants/:id/edit', (req, res) => {
    res.send('修改一家餐廳的資訊')
})

// 刪除一家餐廳
app.post('/restaurants/:id/delete', (req, res) => {
    res.send('刪除一家餐廳')
})

app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}/restaurants`)
})