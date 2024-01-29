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

        app.get("/api/products", (req, res) => {
            const sizes = req.query.sizes?.split(",") ?? []
            const colors = req.query.colors?.split(",") ?? []
            const search = req.query.search ?? ""

            const colorConditions = colors
                .map((color) => `JSON_CONTAINS(colors, '"${color}"')`)
                .join(" OR ")
            const sizeConditions = sizes
                .map((size) => `JSON_CONTAINS(sizes, '"${size}"')`)
                .join(" OR ")
            const searchConditions = search
                .split(" ")
                .map((word) => `label LIKE '%${word}%'`)
                .join(" OR ")

            let sqlQuery = "SELECT * FROM product"
            const conditions = []
            if (colorConditions) conditions.push(`(${colorConditions})`)
            if (sizeConditions) conditions.push(`(${sizeConditions})`)
            if (searchConditions) conditions.push(`(${searchConditions})`)
            if (conditions.length)
                sqlQuery += ` WHERE ${conditions.join(" AND ")}`

            sqlQuery += ";"
            console.log(sqlQuery)

            connection.query(sqlQuery, (err, result) => {
                if (err) return console.error(err)
                res.send(result)
            })
        })
        app.get("*", (req, res) => {
            res.sendFile("index.html", options)
        })

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
}

start()
