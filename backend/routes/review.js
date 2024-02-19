import query from "../query.js"

export default {
    get: (req, res) => {
        const { database, params } = req
        const sql = `
        SELECT 
          r.review_id, 
          r.rating, 
          r.text, 
          ci.cart_id,
          c.firstname, 
          c.lastname
        FROM review r
        JOIN cart_item ci ON r.cart_item_id = ci.cart_id
        JOIN orders o ON ci.orders_id = o.orders_id
        JOIN customer c ON o.customer_id = c.customer_id
        WHERE ci.product_id = ?;
      `

        database.query(sql, [params.id], (err, result) => {
            if (err) return res.sendStatus(500)
            res.json(result)
        })
    },

    post: async (req, res) => {
        const { database, body, params, session_id } = req
        const findCartId =
            "SELECT cart_id from cart_item WHERE product_id = ? AND session_id = ? AND orders_id IS NOT NULL"
        const [cartId] = await query(database, findCartId, [
            params.id,
            session_id,
        ])

        if (!cartId) return res.sendStatus(404)

        const verifyCart =
            "SELECT ci.cart_id FROM cart_item ci JOIN orders o ON ci.orders_id = o.orders_id WHERE ci.product_id = ? AND ci.session_id = ? AND o.status = 'delivered'"
        const [verify] = await query(database, verifyCart, [
            params.id,
            session_id,
        ])

        if (!verify) return res.sendStatus(403)

        const checkReviewExists =
            "SELECT r.review_id FROM review r JOIN cart_item ci ON r.cart_item_id = ci.cart_id WHERE ci.product_id = ? AND ci.session_id = ?"
        const [existingReview] = await query(database, checkReviewExists, [
            params.id,
            session_id,
        ])

        if (existingReview) return res.sendStatus(409)
        const sql = `
            INSERT INTO review (cart_item_id, rating, text, created_at)
            VALUES (?, ?, ?, ?)
        `
        await query(database, sql, [
            cartId.cart_id,
            body.rating,
            body.text,
            new Date().toDateString(),
        ])
        res.sendStatus(201)
    },
}
