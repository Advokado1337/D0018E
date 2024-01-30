export default {
    put: (req, res) => {
        const { database, params, body } = req
        let sql = "UPDATE product SET"
        let conditions = []
        if (body.label) conditions.push(`label = '${body.label}'`)
        if (body.price) conditions.push(`price = ${body.price}`)
        if (body.description)
            conditions.push(`description = '${body.description}'`)
        if (body.colors) conditions.push(`colors = '${body.colors}'`)
        if (body.sizes) conditions.push(`sizes = '${body.sizes}'`)
        if (conditions.length) sql += ` ${conditions.join(" , ")}`
        sql += ` WHERE product_id = ${params.id};`
        database.query(sql, (err, result) => {
            if (err) return res.sendStatus(500)
            database.query(
                `SELECT * FROM product WHERE product_id = ${params.id}`,
                (err, result) => {
                    if (err) return res.sendStatus(500)
                    res.send(result)
                }
            )
        })
    },

    delete: (req, res) => {
        const { database, params } = req
        database.query(
            `DELETE FROM product WHERE product_id = ${params.id}`,
            (err, result) => {
                if (err) return res.sendStatus(500)
                res.send(result)
            }
        )
    },

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
