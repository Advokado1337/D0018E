export default {
    get: (req, res) => {
        const { database, session_id } = req
        database.query(
            "SELECT ci.*, p.* FROM cart_item ci JOIN product p ON ci.product_id = p.product_id WHERE ci.session_id = ?",
            [session_id],
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
            "SELECT * FROM cart_item WHERE session_id = ? AND product_id = ? AND size = ? AND color = ?",
            [session_id, body.product_id, body.size, body.color],
            (err, result) => {
                if (result.length) {
                    database.query(
                        "UPDATE cart_item SET amount = amount + 1 WHERE session_id = ? AND product_id = ? AND size = ? AND color = ?",
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
