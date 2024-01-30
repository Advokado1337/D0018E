export default {
    get: (req, res) => {
        const { database, session_id } = req
        const query = `
            SELECT ci.*, p.*
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            WHERE ci.session_id = ?
        `

        database.query(query, [session_id], (err, result) => {
            if (err) return res.sendStatus(500)
            res.send(result)
        })
    },

    post: (req, res) => {
        const { database, session_id, body } = req

        if (!body.product_id || !body.size || !body.color)
            return res.sendStatus(400)

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
