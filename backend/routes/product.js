export default {
    get: (req, res) => {
        const { database, params } = req
        database.query(
            `SELECT * FROM product WHERE product_id = ${params.id}`,
            (err, result) => {
                if (err) return res.sendStatus(500)
                if (result.length) return res.send(result[0])
                res.send({})
            }
        )
    },
}
