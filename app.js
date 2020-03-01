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

// 瀏覽一家餐廳的詳細資訊                                                   
app.get('/restaurants/:id', (req, res) => {
        Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
        if(err) return console.error(err)
        return res.render('show', { restaurant })
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
    // 找到資料庫的資料
    Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
        if(err) return console.error(err)
        res.render('edit', { restaurant })
    })    
})

// 修改一家餐廳的資訊
app.post('/restaurants/:id/edit', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
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
            if(err) return console.error(err)
            return res.redirect(`/restaurants/${req.params.id}`)
        })
    })
})

// 刪除一家餐廳
app.post('/restaurants/:id/delete', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) =>{
        if(err) return console.error(err)
        restaurant.remove(err => {
            if(err) return console.error(err)
            return res.redirect('/')
        })
    })
})

app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}/restaurants`)
})