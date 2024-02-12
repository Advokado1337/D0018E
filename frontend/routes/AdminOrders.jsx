import React, { useEffect, useState } from "react"

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
                        <div
                            className="flex flex-col w-full"
                            key={order.order_id}
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-xl">
                                    Order #{order.order_id}
                                </h2>
                                <p className="text-gray-800"></p>
                            </div>
                            <div className="text-xl font-semibold mt-4"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminOrders
