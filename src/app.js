const express = require('express')
const routes = require('./routes')
const connectDB = require('./config/mongodb')
const cors = require('cors')
const app = express()

require('dotenv').config({ path: './src/.env' })

const port = process.env.PORT

connectDB()

app.use(cors({
  origin: 'http://mosulganteng.com'
})) 

app.use(express.json())
app.use("/api/v1", routes)

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`)
})

app.use(function (err, req, res, next) {
  res.status(500).send(err.message)
})

app.use(express.static('public/cover_book'))
app.use(express.static('public/author_image'))