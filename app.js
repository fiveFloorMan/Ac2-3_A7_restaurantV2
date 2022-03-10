const express = require('express')
const app = express()
const mongoose = require('mongoose')
const RestaurantModel = require('./models/restaurant-list')
const bodyParser = require('body-parser')

const port = 3000

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true,  useUnifiedTopology: true})

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
app.use(bodyParser.urlencoded({ extended : true }))

// route 根目錄 & 顯示所有餐廳
app.get('/', (req, res) => {
  // Controller
  RestaurantModel.find()
    .lean()
    .then(restaurant => {
      res.render('index', { restaurant : restaurant })
    })
    .catch(error => console.error('error'))
})

// route for create new restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
// route for catch new restaurant data
app.post('/restaurants' , (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return RestaurantModel.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})
// route for show page (specific restaurant)
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return RestaurantModel.findById(id)
    .lean()
    .then((restaurant) => {
      console.log('restaurant', restaurant)
      res.render('show', {restaurant : restaurant})
    })
    .catch(error => console.log(error))
})

// route for search restaurant 
app.get('/search', (req,res) => {
  if (!req.query.keywords) {
    res.redirect("/")
  }
  const keywords = req.query.keywords  // 輸入的搜尋字眼
  const keyword = req.query.keywords.trim().toLowerCase() // 處理過的輸入的搜尋字眼
  // restaurantsList.results 是restaurant.json的陣列
  let filterRestaurants = restaurantsList.results.filter((data) => {
    return data.name.toLowerCase().trim().includes(keyword) || data.category.trim().includes(keyword)
  })
  res.render('index', {restaurant : filterRestaurants})
})


// route for Edit

// route for show the Detail

// route for Delete 
// 監聽器
app.listen(port , () => {
  console.log(`DNS : http://localhost:${port}`)
})
