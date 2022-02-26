const express = require('express')
const app = express() // 看不懂這句 之後要再去問

const port = 3000

app.get('/', (req , res) => {
  res.send(`Success`)
})

app.listen(port , () => {
  console.log(`DNS : http://localhost:${port}`)
})