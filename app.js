const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
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
app.use(bodyParser.urlencoded({ extended: true }))

// route
// 首頁
app.get('/', (req, res) => {
    Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
        if(err) return console.error(err)
        res.render('index', { restaurants: restaurants })
    }) 
})

// 瀏覽全部餐廳 
app.get('/restaurants', (req, res) => {
    return res.redirect('/')
})

// 新增一家餐廳
app.get('/restaurants/new', (req, res) => {
    res.render('new')
})

// 瀏覽一家餐廳的詳細資訊                                                   ////////////////////////////////改_id
app.get('/restaurants/:id', (req, res) => {
    console.log(req.params.id)
    Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
        if(err) return console.error(err)
        return  res.render('show', { restaurant })
    })
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
app.post('/restaurants', (req, res) => {
    console.log(req)
    // 建立 Todo model 實例
    const restaurant = new Restaurant({
        name: req.body.name,
        name_en: req.body.name_en,
        category: req.body.category,
        phone: req.body.phone,
        location: req.body.location,
        description: req.body.description,
        image: req.body.image
    })
    // 存入資料庫
    restaurant.save(err => {
        if(err) return console.error(err)
        return res.redirect('/')
    })    
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