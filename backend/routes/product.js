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
                "mogging.jpg",
            ],
            (err, productResults) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500)
                }

                const productId = productResults.insertId

                body.colors.forEach((color) => {
                    body.sizes.forEach((size) => {
                        const inventoryInsertQuery = `
                            INSERT INTO inventory (product_id, color, size, quantity)
                            VALUES (?, ?, ?, ?)
                        `
                        const defaultQuantity = 0

                        database.query(inventoryInsertQuery, [
                            productId,
                            color,
                            size,
                            defaultQuantity,
                        ])
                    })
                })

                res.status(200)
            }
        )
    },
    put: (req, res) => {
        const { database, params, body } = req

        database.query(
            "SELECT colors, sizes FROM product WHERE product_id = ?",
            [params.id],
            (err, results) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500)
                }

                const existingProduct = results[0]
                const existingColors = JSON.parse(existingProduct.colors)
                const existingSizes = JSON.parse(existingProduct.sizes)
                const newColors = body.colors ? body.colors : existingColors
                const newSizes = body.sizes ? body.sizes : existingSizes

                const colorsToAdd = newColors.filter(
                    (color) => !existingColors.includes(color)
                )
                const colorsToRemove = existingColors.filter(
                    (color) => !newColors.includes(color)
                )

                const sizesToAdd = newSizes.filter(
                    (size) => !existingSizes.includes(size)
                )
                const sizesToRemove = existingSizes.filter(
                    (size) => !newSizes.includes(size)
                )

                colorsToRemove.forEach((color) => {
                    database.query(
                        "DELETE FROM inventory WHERE product_id = ? AND color = ?",
                        [params.id, color]
                    )
                })

                sizesToRemove.forEach((size) => {
                    database.query(
                        "DELETE FROM inventory WHERE product_id = ? AND size = ?",
                        [params.id, size]
                    )
                })

                colorsToAdd.forEach((color) => {
                    newSizes.forEach((size) => {
                        database.query(
                            "INSERT INTO inventory (product_id, color, size, quantity) VALUES (?, ?, ?, ?)",
                            [params.id, color, size, 0]
                        )
                    })
                })

                sizesToAdd.forEach((size) => {
                    newColors.forEach((color) => {
                        database.query(
                            "INSERT INTO inventory (product_id, color, size, quantity) VALUES (?, ?, ?, ?)",
                            [params.id, color, size, 0]
                        )
                    })
                })

                if (body.inventories) {
                    body.inventories.forEach((inventory) => {
                        database.query(
                            "UPDATE inventory SET quantity = ? WHERE inventory_id = ?",
                            [inventory.quantity, inventory.inventory_id]
                        )
                    })
                }

                let updates = []
                let paramsList = []

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
                    paramsList.push(JSON.stringify(newColors))
                }
                if (body.sizes) {
                    updates.push("sizes = ?")
                    paramsList.push(JSON.stringify(newSizes))
                }

                if (updates.length > 0) {
                    let sql =
                        "UPDATE product SET " +
                        updates.join(", ") +
                        " WHERE product_id = ?"
                    paramsList.push(params.id)

                    database.query(
                        sql,
                        paramsList,
                        (updateErr, updateResult) => {
                            if (updateErr) {
                                console.log(updateErr)
                                return res.sendStatus(500)
                            }

                            database.query(
                                "SELECT * FROM product WHERE product_id = ?",
                                [params.id],
                                (fetchErr, fetchResults) => {
                                    if (fetchErr) {
                                        console.log(fetchErr)
                                        return res.sendStatus(500)
                                    }
                                    res.send(fetchResults)
                                }
                            )
                        }
                    )
                } else {
                    res.sendStatus(200)
                }
            }
        )
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
