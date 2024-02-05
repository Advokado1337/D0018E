import products from "./routes/products.js"
import product from "./routes/product.js"
import cart from "./routes/cart.js"
import inventory from "./routes/inventory.js"
import express from "express"
import dotenv from "dotenv"
import * as url from "url"
import mysql from "mysql"
import path from "path"
import cookieParser from "cookie-parser"
import { v4 as uuidv4 } from "uuid"

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
        app.use(express.json())
        app.use(cookieParser("secret"))

        app.use((req, res, next) => {
            if (!req.signedCookies.session_id) {
                const id = uuidv4()
                res.cookie("session_id", id, {
                    signed: true,
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                })

                req.session_id = id
                return next()
            }
            req.session_id = req.signedCookies.session_id
            next()
        })

        app.use((req, res, next) => {
            req.database = connection
            next()
        })

        app.get("/api/products", products.get)
        app.get("/api/product/:id", product.get)
        app.put("/api/product/:id", product.put)
        app.delete("/api/product/:id", product.delete)
        app.post("/api/product", product.post)
        app.post("/api/cart", cart.post)
        app.get("/api/cart", cart.get)
        app.get("/api/inventory/:id", inventory.get)
        app.post("/api/inventory/:id", inventory.post)
        app.put("/api/inventory/:id", inventory.put)
        app.get("*", (req, res) => {
            res.sendFile("index.html", options)
        })

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
}

start()
