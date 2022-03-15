const mongoose = require('mongoose')
const Schema = mongoose.Schema // 資料庫綱要

const restaurantSchema = new Schema({
  id: { type: Number },
  name: { type: String, require: true },
  nameEn: { type: String },
  category: { type: String },
  image: { type: String },
  location: { type: String, require: true },
  phone: { type: String },
  googleMap: { type: String },
  rating: { type: String },
  description: { type: String }
})

module.exports = mongoose.model('RestaurantModel', restaurantSchema)
