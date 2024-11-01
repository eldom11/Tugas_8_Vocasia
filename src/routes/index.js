const express = require("express")
const testRoutes = require("./test_routes")
const bookRoutes = require("./books_routes")
const authorRoutes = require("./authors_routes")
const categoryRoutes = require("./categories_routes")
const borrowerRoutes = require("./borrowers_routes")

const routes = express.Router()


// kumpulkan semua routes disini per bagian ex : /author,/books dll
routes.use(bookRoutes)
routes.use(authorRoutes)
routes.use(categoryRoutes)
routes.use(borrowerRoutes)

routes.use(testRoutes)

module.exports = routes