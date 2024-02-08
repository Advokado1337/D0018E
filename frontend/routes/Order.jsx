import { useParams, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import Loader from "../components/Loader.jsx"
import CartItem from "../components/CartItem.jsx"

const Order = () => {
    const { id } = useParams()

    const [order, setOrder] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
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
                    console.log(data)
                    setIsLoading(false)
                } else {
                    navigate("/404")
                }
            })
            .catch(() => {
                navigate("/404")
            })
    }, [])

    return (
        <div className="flex items-center justify-center py-8 w-full">
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <h1 className="font-medium text-3xl">Order #{id}</h1>
                    <div className="flex flex-col w-full">
                        {order.cart.map((item) => (
                            <CartItem
                                key={item.cart_id}
                                item={item}
                                disabled={true}
                            />
                        ))}
                    </div>
                    <div className="text-xl font-semibold mt-4">
                        Total: ${order.payment.total}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Order
