const express = require('express')
const routes = require('./routes')
const connectDB = require('./config/mongodb')
const app = express()
// const routes = require("./routes/index")
// const cors = require('cors')

require('dotenv').config()

// app.use(cors())

const port = process.env.PORT

connectDB()

app.use(express.json());

app.use("/api/v1",routes)


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.use(function (err, req, res, next) {
  res.status(500).send(err.message)
})