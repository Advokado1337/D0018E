export default {
    get: (req, res) => {
        const { database, params } = req
        let sql = "SELECT * FROM inventory WHERE product_id = ?"
        database.query(sql, [params.id], (err, result) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            res.send(result)
        })
    },
    post: (req, res) => {
        const { database, params, body } = req
        const sql =
            "INSERT INTO inventory (color, size, quantity, product_id) VALUES (?, ?, ?, ?)"
        const values = [body.color, body.size, body.quantity, params.id]
        database.query(sql, values, (err, result) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            res.send(result)
        })
    },

    put: (req, res) => {
        const { database, params, body } = req
        let sql = "UPDATE inventory SET "
        let updates = []
        let values = []

        if (body.quantity) {
            updates.push("quantity = ?")
            values.push(body.quantity)
        }
        if (body.color) {
            updates.push("color = ?")
            values.push(body.color)
        }
        if (body.size) {
            updates.push("size = ?")
            values.push(body.size)
        }
        if (!updates.length) {
            return res.sendStatus(400)
        }
        sql += updates.join(", ") + " WHERE inventory_id = ?"
        values.push(params.id)
        database.query(sql, values, (err, result) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            res.send(result)
        })
    },
}
