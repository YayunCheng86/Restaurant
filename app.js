const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const restaurantsList = require('./restaurant') 
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', { restaurants: restaurantsList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
    let restaurant = restaurantsList.results.find(restaurant => {
        return restaurant.id.toString() === req.params.restaurant_id
    })
    res.render('show', { restaurant })
})

app.get('/search', (req, res) => {
    let keyword = req.query.keyword
    let restaurantSearch = restaurantsList.results.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })
    res.render('index', { restaurants: restaurantSearch, keyword })
})

app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
})