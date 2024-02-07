export default {
    post: (req, res) => {
        const { database, body } = req

        if (
            !body.label ||
            !body.price ||
            !body.description ||
            !body.colors ||
            !body.sizes
        ) {
            return res.sendStatus(400)
        }

        database.query(
            "INSERT INTO product (label, price, description, colors, sizes, image) VALUES (?, ?, ?, ?, ?, ?)",
            [
                body.label,
                body.price,
                body.description,
                JSON.stringify(body.colors),
                JSON.stringify(body.sizes),
                "test",
            ],
            (err, results) => {
                if (err) {
                    throw err
                }
                res.status(200)
            }
        )
    },
    put: (req, res) => {
        const { database, params, body } = req
        let sql = "UPDATE product SET "
        let updates = []
        let paramsList = []

        body.inventories = body.inventories || []

        body.inventories.forEach((inventory) => {
            if (inventory.inventory_id) {
                database.query(
                    "UPDATE inventory SET quantity = ? WHERE inventory_id = ?",
                    [inventory.quantity, inventory.inventory_id],
                    (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.sendStatus(500)
                        }
                    }
                )
            } else {
                database.query(
                    "INSERT INTO inventory (product_id, color, size, quantity) VALUES (?, ?, ?, ?)",
                    [
                        params.id,
                        inventory.color,
                        inventory.size,
                        inventory.quantity,
                    ],
                    (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.sendStatus(500)
                        }
                    }
                )
            }
        })

        if (body.label) {
            updates.push("label = ?")
            paramsList.push(body.label)
        }
        if (body.price) {
            updates.push("price = ?")
            paramsList.push(body.price)
        }
        if (body.description) {
            updates.push("description = ?")
            paramsList.push(body.description)
        }
        if (body.colors) {
            updates.push("colors = ?")
            paramsList.push(JSON.stringify(body.colors))
        }
        if (body.sizes) {
            updates.push("sizes = ?")
            paramsList.push(JSON.stringify(body.sizes))
        }

        if (!updates.length) {
            return res.sendStatus(400)
        }

        sql += updates.join(", ") + " WHERE product_id = ?"
        paramsList.push(params.id)

        database.query(sql, paramsList, (err, result) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }

            database.query(
                "SELECT * FROM product WHERE product_id = ?",
                [params.id],
                (err, result) => {
                    if (err) {
                        console.log(err)
                        return res.sendStatus(500)
                    }
                    res.send(result)
                }
            )
        })
    },
    delete: (req, res) => {
        const { database, params } = req

        database.query(
            "DELETE FROM product WHERE product_id = ?",
            [params.id],
            (err, result) => {
                if (err) return res.sendStatus(500)
                res.send(result)
            }
        )
    },
    get: (req, res) => {
        const { database, params } = req

        const sql = `
            SELECT p.*, i.inventory_id, i.color, i.size, i.quantity
            FROM product p
            LEFT JOIN inventory i ON p.product_id = i.product_id
            WHERE p.product_id = ?;
        `

        database.query(sql, [params.id], (err, result) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            if (result.length) {
                const product = {
                    product_id: result[0].product_id,
                    label: result[0].label,
                    description: result[0].description,
                    price: result[0].price,
                    colors: JSON.parse(result[0].colors),
                    sizes: JSON.parse(result[0].sizes),
                    image: result[0].image,
                    inventories: [],
                }

                if (result[0].inventory_id) {
                    result.forEach((row) => {
                        product.inventories.push({
                            inventory_id: row.inventory_id,
                            color: row.color,
                            size: row.size,
                            quantity: row.quantity,
                        })
                    })
                }

                return res.send(product)
            } else {
                res.sendStatus(404)
            }
        })
    },
}
