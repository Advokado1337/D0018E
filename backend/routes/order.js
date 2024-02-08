import query from "../query.js"

export default {
    get: async (req, res) => {
        const { database, session_id, params } = req

        const sqlOrder = `
            SELECT *
            FROM orders
            WHERE session_id = ? AND orders_id = ?
        `
        const [order] = await query(database, sqlOrder, [session_id, params.id])

        if (!order) return res.sendStatus(404)

        const sqlCart = `
            SELECT ci.*, p.*
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            WHERE ci.orders_id = ?
        `
        const cart = await query(database, sqlCart, [params.id])

        order.cart = cart

        const sqlPayment = `
            SELECT total
            FROM payment_details 
            WHERE payment_id = ?
        `
        const [payment] = await query(database, sqlPayment, [order.payment_id])

        order.payment = payment

        const sqlCustomer = `
            SELECT *
            FROM customer
            WHERE customer_id = ?
        `
        const [customer] = await query(database, sqlCustomer, [
            order.customer_id,
        ])

        order.customer = customer

        res.json(order)
    },
    post: async (req, res) => {
        const { database, session_id, body } = req

        const sqlCart = `
            SELECT SUM(p.price * ci.amount) AS total_price
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            WHERE ci.session_id = ?`
        const [cart] = await query(database, sqlCart, [session_id])

        const totalPrice = cart.total_price

        if (!totalPrice) return res.sendStatus(400)

        const sqlPayment = `
            INSERT INTO payment_details (cardnumber, expiration, cvc, total)
            VALUES (?, ?, ?, ?)`
        const paramsPayment = [
            body.cardnumber,
            body.expiration,
            body.cvc,
            totalPrice,
        ]

        const payment = await query(database, sqlPayment, paramsPayment)

        const payment_id = payment.insertId

        if (!payment_id) return res.sendStatus(500)

        const sqlCustomer = `
            INSERT INTO customer (firstname, lastname, country, city, zip, address, phonenumber, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        const paramsCustomer = [
            body.firstname,
            body.lastname,
            body.country,
            body.city,
            body.zip,
            body.address,
            body.phonenumber,
            body.email,
        ]

        const customer = await query(database, sqlCustomer, paramsCustomer)

        const customer_id = customer.insertId

        if (!customer_id) return res.sendStatus(500)

        const sqlOrder = `
            INSERT INTO orders (session_id, customer_id, payment_id)
            VALUES (?, ?, ?)`
        const paramsOrder = [session_id, customer_id, payment_id]

        const orders = await query(database, sqlOrder, paramsOrder)

        const orders_id = orders.insertId

        const sqlUpdateCart = `
            UPDATE cart_item
            SET orders_id = ?
            WHERE session_id = ?`
        await query(database, sqlUpdateCart, [orders_id, session_id])

        res.json({ orders_id })
    },
}
