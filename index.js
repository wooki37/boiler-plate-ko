const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://lite1324:dnrdl1324!!@cluster0.3luvfd9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요~')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
}) 