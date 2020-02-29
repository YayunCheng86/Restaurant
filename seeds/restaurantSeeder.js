const mongoose = require('mongoose')
const Restaurant = require('../models/restaurant')
const restaurantsList = require('./restaurant.json') 

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('error', () => {
    console.log('mongodb error!')
})

db.on('open', () => {
    console.log('mongodb connected!')
    console.log(restaurant.results.length)
})