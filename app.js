const express = require('express')
const app = express()
const port = 3000

// require 渲染的工具
const exphbs = require('express-handlebars')
const restaurantsList = require('./restaurant.json')

// set engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 告知靜態檔案位置
app.use(express.static('public'))

// route
app.get('/', (req,res) => {
  
  res.render('index', {restaurant : restaurantsList.results})
})

// route for 點擊餐廳跳轉到show page
app.get('/restaurants/:restaurant_id', (req,res) => {

  let show_id = req.params.restaurant_id - 1
  res.render('show', {restaurant : restaurantsList.results[show_id]})
})

// route for search
app.get('/search', (req,res) => {
  if (!req.query.keywords) {
    res.redirect("/")
  }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  console.log('restaurantsList.results :', restaurantsList.results) //check

  const filterRestaurants = restaurantsList.results.filter(data => {
    data.name.toLowerCase().trim().includes(keyword) || data.category.trim().includes(keyword)
    // console.log('data.name.toLowerCase().trim().includes(keyword) :', data.name.toLowerCase().trim().includes(keyword))
    // console.log('keyword',keyword)
    // console.log('成功 : data.name.toLowerCase()',data.name.toLowerCase())
    // console.log('成功 : data.category',data.category)
  })
  
  // console.log('filterRestaurants', filterRestaurants)
  res.render('index', {restaurant : filterRestaurants})
})

// 監聽器
app.listen(port , () => {
  console.log(`DNS : http://localhost:${port}`)
})

// 讀取 JSON 檔案，將種子資料載入應用程式 ok
// 把資料帶入 handlebars 樣板中動態呈現 ok
// 操作 handlebars 中的 each 迴圈呈現出多張餐廳卡片 ok
// 應用 params 打造動態路由 ok
// 用 Query String 打造搜尋功能 not yet