import authentication from "./routes/authentication.js"
import protect from "./middleware/protect.js"
import inventory from "./routes/inventory.js"
import products from "./routes/products.js"
import product from "./routes/product.js"
import cookieParser from "cookie-parser"
import { body } from "express-validator"
import order from "./routes/order.js"
import bodyParser from "body-parser"
import cart from "./routes/cart.js"
import { v4 as uuidv4 } from "uuid"
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
        app.use(express.json())
        app.use(bodyParser.urlencoded({ extended: true }))
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

        // Products routes
        app.get("/api/products", products.get)

        // Product routes
        app.get("/api/product/:id", product.get)
        app.put("/api/product/:id", protect, product.put)
        app.delete("/api/product/:id", protect, product.delete)
        app.post(
            "/api/product",
            protect,
            [
                body("label").notEmpty().isString().isLength({ max: 255 }),
                body("price").notEmpty().isNumeric(),
                body("description")
                    .notEmpty()
                    .isString()
                    .isLength({ max: 2000 }),
                body("colors").notEmpty().isArray(),
                body("sizes").notEmpty().isArray(),
            ],
            product.post
        )

        // Cart routes
        app.post(
            "/api/cart",
            [
                body("product_id").notEmpty().isInt(),
                body("color").notEmpty().isString(),
                body("size").notEmpty().isString(),
            ],
            cart.post
        )
        app.get("/api/cart", cart.get)
        app.delete("/api/cart/:id", cart.delete)
        app.put("/api/cart/:id", cart.put)

        // Inventory routes
        app.get("/api/inventory/:id", protect, inventory.get)
        app.post(
            "/api/inventory/:id",
            [
                body("color").notEmpty().isString().isLength({ max: 255 }),
                body("size").notEmpty().isString().isLength({ max: 255 }),
                body("quantity").notEmpty().isInt(),
            ],
            protect,
            inventory.post
        )
        app.put("/api/inventory/:id", protect, inventory.put)

        // Login route
        app.post(
            "/api/login",
            [
                body("username").notEmpty().isString(),
                body("password").notEmpty().isString(),
            ],
            authentication.post
        )

        // Order routes
        app.post(
            "/api/order",
            [
                body("cardnumber").notEmpty().isString().isLength({ max: 45 }),
                body("expiration").notEmpty().isString().isLength({ max: 45 }),
                body("cvc").notEmpty().isString().isLength({ max: 3 }),
                body("firstname").notEmpty().isString().isLength({ max: 255 }),
                body("lastname").notEmpty().isString().isLength({ max: 255 }),
                body("country").notEmpty().isString().isLength({ max: 255 }),
                body("city").notEmpty().isString().isLength({ max: 255 }),
                body("zip").notEmpty().isString().isLength({ max: 255 }),
                body("address").notEmpty().isString().isLength({ max: 255 }),
                body("phonenumber")
                    .notEmpty()
                    .isString()
                    .isLength({ max: 255 }),
                body("email").notEmpty().isString().isLength({ max: 255 }),
            ],
            order.post
        )
        app.get("/api/order/:id", order.get)

        app.get("*", (req, res) => {
            res.sendFile("index.html", options)
        })

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
}

start()
