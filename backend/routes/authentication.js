import bcrypt from "bcryptjs"

export default {
    post: (req, res) => {
        const { body, database } = req

        if (!body.username || !body.password) {
            return res.sendStatus(400)
        }

        database.query(
            "SELECT * FROM admin WHERE username = ?",
            [body.username],
            (err, results) => {
                if (err) return res.sendStatus(500)
                if (results.length === 0) return res.sendStatus(401)

                const admin = results[0]

                bcrypt.compare(body.password, admin.password, (err, same) => {
                    if (err) return res.sendStatus(500)
                    if (!same) return res.sendStatus(401)

                    res.cookie("admin_token", admin.admin_id, { signed: true })
                    res.redirect("/admin")
                })
            }
        )
    },
}
