const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')  //引入bcryptjs 

// 引入model
const Restaurant = require('../restaurant')
const User = require('../user')

const restaurantList = require('../../restaurant.json')  // 引入外部json

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
    
    // 創造new users
    const user1 = new User ({
        email: 'user1@example.com',
        password: '12345678'
    })
    const user2 = new User ({
        email: 'user2@example.com',
        password: '12345678'
    })
    
    // bcrypt隱藏user1、user2密碼
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user1.password, salt, (err, hash) => {
            if (err) throw err
            user1.password = hash

            user1
            .save()
            .catch(err => console.log(err))
        })
    })  

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user2.password, salt, (err, hash) => {
            if (err) throw err
            user2.password = hash

            user2
            .save()
            .catch(err => console.log(err))
        })
    })

    // 創造餐廳seeder
    restaurantList.results.forEach(restaurant => {
        if (restaurant.id <= 3) {
            Restaurant.create ({
                id: restaurant.id,
                name: restaurant.name,
                name_en: restaurant.name_en,
                category: restaurant.category,
                image: restaurant.image,
                location: restaurant.location,
                phone: restaurant.phone,
                google_map: restaurant.google_map,
                rating: restaurant.rating,
                description: restaurant.description,
                userId: user1._id,
            })
        } else if (restaurant.id > 3 && restaurant.id <= 6) {
            Restaurant.create ({
                id: restaurant.id,
                name: restaurant.name,
                name_en: restaurant.name_en,
                category: restaurant.category,
                image: restaurant.image,
                location: restaurant.location,
                phone: restaurant.phone,
                google_map: restaurant.google_map,
                rating: restaurant.rating,
                description: restaurant.description,
                userId: user2._id,
            })
        } else return 
    })
})