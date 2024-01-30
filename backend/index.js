import products from "./routes/products.js"
import product from "./routes/product.js"
import express from "express"
import dotenv from "dotenv"
import * as url from "url"
import mysql from "mysql"
import path from "path"

dotenv.config()

const PORT = 3000

const start = () => {
    const app = express()

    const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
    const options = { root: path.join(__dirname, "../public") }

    const connection = mysql.createConnection({
        host: process.env["DB_HOST"],
        user: process.env["DB_USERNAME"],
        port: 3306,
        password: process.env["DB_PASSWORD"],
        database: "mydb",
    })

    connection.connect((err) => {
        if (err) return console.error(err)
        console.log("Connected to database")

        app.use(express.static("public"))
        app.use((req, res, next) => {
            req.database = connection
            next()
        })

        app.get("/api/products", products.get)
        app.get("/api/product/:id", product.get)
        app.get("*", (req, res) => {
            res.sendFile("index.html", options)
        })

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
}

start()
