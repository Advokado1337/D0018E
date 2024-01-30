export default {
    get: (req, res) => {
        const { database, query } = req

        const sizes = query.sizes?.split(",") ?? []
        const colors = query.colors?.split(",") ?? []
        const search = query.search ?? ""
        const minPrice = Number(query.minPrice) ? Number(query.minPrice) : 0
        const maxPrice = Number(query.maxPrice)
            ? Number(query.maxPrice)
            : 999999

        const colorConditions = colors
            .map((color) => `JSON_CONTAINS(colors, '"${color}"')`)
            .join(" OR ")
        const sizeConditions = sizes
            .map((size) => `JSON_CONTAINS(sizes, '"${size}"')`)
            .join(" OR ")
        const searchConditions = search
            .split(" ")
            .map((word) => `label LIKE '%${word}%'`)
            .join(" OR ")

        let sqlQuery = "SELECT * FROM product"

        const conditions = [`price BETWEEN ${minPrice} AND ${maxPrice}`]

        if (colorConditions && query.colors.length)
            conditions.push(`(${colorConditions})`)
        if (sizeConditions && query.sizes.length)
            conditions.push(`(${sizeConditions})`)
        if (searchConditions) conditions.push(`(${searchConditions})`)
        if (conditions.length) sqlQuery += ` WHERE ${conditions.join(" AND ")}`

        console.log(query.sort)

        if (query.sort === "price_asc") sqlQuery += " ORDER BY price"
        else if (query.sort === "price_desc") sqlQuery += " ORDER BY price DESC"
        else if (query.sort === "new") sqlQuery += " ORDER BY product_id DESC"

        sqlQuery += ";"

        console.log(sqlQuery)

        database.query(sqlQuery, (err, result) => {
            if (err) return console.error(err)
            res.send(result)
        })
    },
}
