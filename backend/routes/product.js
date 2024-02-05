export default {
    put: (req, res) => {
        const { database, params, body } = req
        let sql = "UPDATE product SET "
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
            paramsList.push(body.colors)
        }
        if (body.sizes) {
            updates.push("sizes = ?")
            paramsList.push(body.sizes)
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

        database.query(
            "SELECT * FROM product WHERE product_id = ?",

            [params.id],
            (err, result) => {
                if (err) return res.sendStatus(500)
                if (result.length) return res.send(result[0])
                res.send(result)
            }
        )
    },
}
