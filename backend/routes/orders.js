export default {
    get: (req, res) => {
        const { database } = req

        const query = `
            SELECT o.*, pd.*, c.*
            FROM orders o
            JOIN payment_details pd ON o.payment_id = pd.payment_id
            JOIN customer c ON o.customer_id = c.customer_id
        `

        database.query(query, (error, result) => {
            if (error) {
                console.log(error)
                return res.json({ error })
            }
            res.json(result)
        })
    },
}
