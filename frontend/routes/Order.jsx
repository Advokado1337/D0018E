import { useParams, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import Loader from "../components/Loader.jsx"
import CartItem from "../components/CartItem.jsx"

const Order = ({ editable }) => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [order, setOrder] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [status, setStatus] = useState("")

    useEffect(() => {
        fetchOrder()
    }, [])

    const fetchOrder = () => {
        setIsLoading(true)
        fetch(`/api/order/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setOrder(data)
                    setStatus(data.status)
                    setIsLoading(false)
                } else {
                    navigate("/404")
                }
            })
            .catch(() => {
                navigate("/404")
            })
    }

    const handleOrderStatusUpdate = async (event) => {
        const response = await fetch(`/api/order/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: event.target.value,
            }),
        })

        if (response.status === 200) {
            fetchOrder()
        }
    }

    return (
        <div className="flex items-center justify-center w-full">
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <div className="flex">
                        <div className="flex flex-col w-2/3">
                            <div className="flex items-center w-full border-b-2 pb-8 border-gray-200 min-h-[75px]">
                                <h1 className="font-medium text-2xl">
                                    Order #{id}
                                </h1>
                                <div className="ml-4 p-3 rounded-full bg-indigo-500 text-white uppercase text-xs">
                                    {order.status}
                                </div>
                                {editable && (
                                    <select
                                        className="ml-auto border-2 border-gray-200 rounded-md p-2"
                                        onChange={handleOrderStatusUpdate}
                                        value={status}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">
                                            Processing
                                        </option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">
                                            Delivered
                                        </option>
                                    </select>
                                )}
                            </div>
                            <div className="flex flex-col">
                                {order.cart.map((item) => (
                                    <CartItem
                                        key={item.cart_id}
                                        item={item}
                                        disabled={true}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="w-1/3 pl-8">
                            <div className="flex items-center w-full border-b-2 pb-8 border-gray-200 min-h-[75px]">
                                <h1 className="font-medium text-2xl">
                                    Order Details
                                </h1>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex pt-4">
                                    <div className="font-medium">Total</div>
                                    <div className="ml-auto">
                                        ${order.payment.total}
                                    </div>
                                </div>
                                <div className="flex pt-4">
                                    <div className="font-medium">Address</div>
                                    <div className="ml-auto">
                                        {order.customer.address},{" "}
                                        {order.customer.city}, ZIP{" "}
                                        {order.customer.zip}
                                    </div>
                                </div>
                                <div className="flex pt-4">
                                    <div className="font-medium">Country</div>
                                    <div className="ml-auto">
                                        {order.customer.country}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Order
