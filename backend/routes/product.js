export default {
    get: (req, res) => {
        const { database, params } = req
        database.query(
            `SELECT * FROM product WHERE product_id = ${params.id}`,
            (err, result) => {
                if (err) return res.sendStatus(500)
                res.send(result)
            }
        )
    },
}
