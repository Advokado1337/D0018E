export default {
    get: (req, res) => {
        const { database, query } = req

        const params = []
        const conditions = []

        if (query.minPrice || query.maxPrice) {
            conditions.push(`price BETWEEN ? AND ?`)
            params.push(
                Number(query.minPrice) || 0,
                Number(query.maxPrice) || 999999
            )
        }

        if (query.colors) {
            const colors = query.colors.split(",")
            colors.forEach((color) => {
                conditions.push(`JSON_CONTAINS(colors, ?)`)
                params.push(JSON.stringify([color]))
            })
        }

        if (query.sizes) {
            const sizes = query.sizes.split(",")
            sizes.forEach((size) => {
                conditions.push(`JSON_CONTAINS(sizes, ?)`)
                params.push(JSON.stringify([size]))
            })
        }

        if (query.search) {
            const searchTerms = query.search.split(" ")
            searchTerms.forEach((term) => {
                conditions.push(`label LIKE ?`)
                params.push(`%${term}%`)
            })
        }

        let sqlQuery = "SELECT * FROM product"
        if (conditions.length) {
            sqlQuery += ` WHERE ${conditions.join(" AND ")}`
        }

        switch (query.sort) {
            case "price_asc":
                sqlQuery += " ORDER BY price ASC"
                break
            case "price_desc":
                sqlQuery += " ORDER BY price DESC"
                break
            case "new":
                sqlQuery += " ORDER BY product_id DESC"
                break
        }

        database.query(sqlQuery, params, (err, result) => {
            if (err) {
                console.error(err)
                return res.sendStatus(500)
            }
            res.send(result)
        })
    },
}
