const express = require('express')
const app = express()
const mongoose = require('mongoose')
const RestaurantModel = require('./models/restaurant-list')
const bodyParser = require('body-parser')

const port = 3000

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongoose error')
})

db.once('open', () => {
  console.log('mongoose connedted!')
})

// require 渲染的工具
const exphbs = require('express-handlebars')
// 可能是無用的變數
const restaurantsList = require('./restaurant.json')

// set engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 告知靜態檔案位置
app.use(express.static('public'))

// bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

// route 根目錄 & 顯示所有餐廳
app.get('/', (req, res) => {
  // Controller
  RestaurantModel.find()
    .lean()
    .then(restaurant => {
      res.render('index', { restaurant: restaurant })
    })
    .catch(error => console.log(error))
})

// route for search restaurant
app.get('/search', (req, res) => {
  if (!req.query.keywords) {
    res.redirect('/')
  }
  const keyword = req.query.keywords.trim().toLowerCase() // 處理過的輸入的搜尋字眼
  // restaurantsList.results 是restaurant.json的陣列
  const filterRestaurants = restaurantsList.results.filter((data) => {
    return data.name.toLowerCase().trim().includes(keyword) || data.category.trim().includes(keyword)
  })
  res.render('index', { restaurant: filterRestaurants })
})

// route for create new restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
// route for show page (specific restaurant)
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return RestaurantModel.findById(id)
    .lean()
    .then((restaurant) => {
      res.render('show', { restaurant: restaurant })
    })
    .catch(error => console.log(error))
})
// route for catch new restaurant data
app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const nameEn = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const googleMap = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return RestaurantModel.create({ name, nameEn, category, image, location, phone, googleMap, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// route for Edit
app.get('/restaurants/:_id/edit', (req, res) => {
  const id = req.params._id
  return RestaurantModel.findById(id)
    .lean()
    .then((restaurant) => {
      res.render('edit', { restaurant: restaurant })
    })
    .catch(error => console.log(error))
})
// route for Catch Edit restaurant data
app.post('/restaurants/:_id', (req, res) => {
  const id = req.params._id
  return RestaurantModel.findById(id)
    .then(restaurantEdit => {
      return restaurantEdit.update(req.body)
    })
    .then(() => res.redirect(`/restaurants/${id}`))// 還有有疑問的地方
    .catch(error => console.log(error))
})

// route for delete
app.post('/restaurants/:_id/delete', (req, res) => {
  const id = req.params._id
  return RestaurantModel.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// form action="/restaurants/{{ this._id }}/delete" method="POST"

// route for Delete
// 監聽器
app.listen(port, () => {
  console.log(`DNS : http://localhost:${port}`)
})
