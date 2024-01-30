export default {
    get: (req, res) => {
        const { database, session_id } = req
        database.query(
            `SELECT * FROM cart_item WHERE session_id = '${session_id}'`,
            (err, result) => {
                console.log(err)
                if (err) return res.sendStatus(500)
                res.send(result)
            }
        )
    },

    post: (req, res) => {
        const { database, session_id, body } = req
        database.query(
            `INSERT INTO cart_item (session_id, product_id, amount, size, color) VALUES ('${session_id}', '${body.product_id}', '1', '${body.size}', '${body.color}')`,
            (err, result) => {
                console.log(err)
                if (err) return res.sendStatus(500)
                res.send(result)
            }
        )
    },
}
