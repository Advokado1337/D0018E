export default {
    get: (req, res) => {
        const { database, session_id } = req

        const sql = `
            SELECT ci.*, p.*, i.*
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            JOIN inventory i ON ci.product_id = i.product_id AND ci.size = i.size AND ci.color = i.color
            WHERE ci.session_id = ? AND ci.orders_id IS NULL
        `

        database.query(sql, [session_id], (err, result) => {
            if (err) return res.sendStatus(500)
            res.json(result)
        })
    },
    delete: (req, res) => {
        const { database, params } = req
        database.query(
            "DELETE FROM cart_item WHERE cart_id = ?",
            [params.id],
            (err, result) => {
                if (err) return res.sendStatus(500)
                res.send(result)
            }
        )
    },
    put: (req, res) => {
        const { database, params, body } = req
        database.query(
            "UPDATE cart_item SET amount = ? WHERE cart_id = ?",
            [body.amount, params.id],
            (err, result) => {
                if (err) return res.sendStatus(500)
                res.send(result)
            }
        )
    },
    post: (req, res) => {
        const { database, session_id, body } = req

        const sql =
            "INSERT INTO cart_item (session_id, product_id, amount, size, color) VALUES (?, ?, ?, ?, ?)"
        const params = [session_id, body.product_id, 1, body.size, body.color]

        database.query(
            "SELECT * FROM cart_item WHERE session_id = ? AND product_id = ? AND size = ? AND color = ? AND orders_id IS NULL",
            [session_id, body.product_id, body.size, body.color],
            (err, result) => {
                console.log(result, body)

                if (result.length) {
                    database.query(
                        "UPDATE cart_item SET amount = amount + 1 WHERE session_id = ? AND product_id = ? AND size = ? AND color = ? AND orders_id IS NULL",
                        [session_id, body.product_id, body.size, body.color],
                        (err, result) => {
                            if (err) return res.sendStatus(500)
                            res.send(result)
                        }
                    )
                } else {
                    database.query(sql, params, (err, result) => {
                        if (err) return res.sendStatus(500)
                        res.send(result)
                    })
                }
            }
        )
    },
}
