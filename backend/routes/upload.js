import { storage } from "../utils/storage.js"
import multer from "multer"

export default {
    upload: multer({
        storage,
        fileFilter: (req, file, cb) => {
            const { database, params, headers } = req
            const { id } = params
            const color = headers["x-color"]

            const checkIfColorExists = `
                SELECT colors
                FROM product
                WHERE product_id = ?
            `

            database.query(checkIfColorExists, [id], (err, results) => {
                if (err || !results.length) {
                    console.log(err)
                    return cb(null, false)
                }

                const colors = JSON.parse(results[0].colors)

                if (!colors.includes(color)) {
                    return cb(null, false)
                }

                if (
                    file.mimetype === "image/jpeg" ||
                    file.mimetype === "image/png"
                ) {
                    cb(null, true)
                } else {
                    cb(null, false)
                }
            })
        },
        fileSize: 1024 * 1024 * 5,
    }),
    post: (req, res) => {
        if (!req.file) return res.json({ error: "Failed to upload image" })

        const { database, params, headers } = req
        const { id } = params
        const color = headers["x-color"]

        if (!color) {
            return res.json({ error: "Missing color" })
        }
        if (!id) {
            return res.json({ error: "Missing product id" })
        }

        const sql = `
            UPDATE product
            SET images = ?
            WHERE product_id = ?
        `

        database.query(
            "SELECT images FROM product WHERE product_id = ?",
            [id],
            (err, results) => {
                if (err || !results.length) {
                    console.log(err)
                    return res.json({ error: "Could not find product" })
                }

                const images = JSON.parse(results[0].images)
                images.push({ url: req.file.filename, color })

                database.query(
                    sql,
                    [JSON.stringify(images), id],
                    (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.json({
                                error: "Could not update product",
                            })
                        }
                        res.sendStatus(200)
                    }
                )
            }
        )
    },
}
