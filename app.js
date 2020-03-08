const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {      // 如果不是 production 模式
    require('dotenv').config()                      // 使用 dotenv 讀取 .env 檔案
}
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 連線資料庫
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
})

// 註冊session
app.use(session({
    secret: 'QOO is the best drink ever',
    resave: false,
    saveUninitialized: true
}))

// 使用passport
app.use(passport.initialize())
app.use(passport.session())

// 載入 Passport config
require('./config/passport')(passport)

app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})

// routes
app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurant'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}/restaurants`)
})