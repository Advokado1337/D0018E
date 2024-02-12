export default {
    get: (req, res) => {
        const { database } = req

        database.query("SELECT * from orders", (error, result) => {
            if (error) {
                console.log(error)
                return res.json({ error })
            }
            res.json(result)
        })
    },
}
