import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const AdminOrders = () => {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        const response = await fetch("/api/orders", {
            method: "GET",
        })

        const data = await response.json()

        if (!data || data.error) {
            return alert(data.error)
        }
        setOrders(data)
    }

    return (
        <div className="flex h-full">
            <div className="w-full p-8">
                <div className="flex">
                    <div className="w-full">
                        <h1 className="font-bold text-3xl">Orders</h1>
                        <p className="text-gray-800">
                            A list of orders, which you can update and manage.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col mt-8">
                    {orders.map((order) => (
                        <Link
                            to={"/admin/order/" + order.orders_id}
                            className="flex flex-col w-full border border-gray-300 mb-4 p-4 rounded-md bg-white"
                            key={order.orders_id}
                        >
                            <div className="flex w-full">
                                <div className="flex w-full flex-col">
                                    <div>Order ID</div>
                                    <div className="font-medium">
                                        #{order.orders_id}
                                    </div>
                                </div>
                                <div className="flex w-full flex-col">
                                    <div>Price</div>
                                    <div className="font-medium">
                                        ${order.total}
                                    </div>
                                </div>
                                <div className="flex w-full flex-col">
                                    <div>Customer</div>
                                    <div className="font-medium">
                                        {order.firstname} {order.lastname}
                                    </div>
                                </div>
                                <div className="flex w-full flex-col">
                                    <div>Address</div>
                                    <div className="font-medium">
                                        {order.address}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminOrders
