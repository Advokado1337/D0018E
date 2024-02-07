import React, { useState, useEffect } from "react"
import Loader from "../components/Loader.jsx"

const Cart = () => {
    const [cart, setCart] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchCartItems()
    }, [])

    const fetchCartItems = async () => {
        setIsLoading(true)
        const res = await fetch("/api/cart", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await res.json()
        setCart(data)
        setIsLoading(false)
    }

    const handleUpdateCartItem = async (id, amount) => {
        setIsLoading(true)
        await fetch(`/api/cart/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
        })
        fetchCartItems()
    }

    const handleRemoveCartItem = async (id) => {
        setIsLoading(true)
        await fetch(`/api/cart/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        fetchCartItems()
    }

    return (
        <div className="flex items-center justify-center py-8 w-full">
            <div className="w-3/5 flex flex-col justify-center">
                <h1 className="font-bold w-full text-center text-3xl border-b border-gray-300 pb-12">
                    Shopping Cart
                </h1>
                <div className="flex flex-col w-full">
                    {isLoading ? (
                        <div className="w-full flex items-center justify-center py-12">
                            <Loader />
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="w-full text-center py-12">
                            Your cart is empty
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div
                                className="w-full h-48 border-b border-gray-300 py-8 flex"
                                key={item.cart_id}
                            >
                                <div className="flex w-full">
                                    <div
                                        className="aspect-square h-full rounded-md overflow-hidden bg-center bg-no-repeat bg-cover"
                                        style={{
                                            backgroundImage: `url(/images/products/${item.image})`,
                                        }}
                                    ></div>
                                    <div className="flex flex-col px-4">
                                        <div className="flex flex-col">
                                            <div className="capitalize font-semibold">
                                                {item.label}
                                            </div>
                                            <div className="capitalize text-gray-700">
                                                {item.color}
                                            </div>
                                            <div className="uppercase text-gray-700">
                                                {item.size}
                                            </div>
                                        </div>
                                        <div className="mt-auto flex">
                                            <svg
                                                width="25"
                                                height="25"
                                                viewBox="0 0 100 100"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fill="none"
                                                    stroke="green"
                                                    strokeWidth="10"
                                                    d="M 10,50 l 20,20 l 40,-40"
                                                />
                                            </svg>

                                            <div>In stock</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <select
                                        value={item.amount}
                                        onChange={(e) =>
                                            handleUpdateCartItem(
                                                item.cart_id,
                                                Number(e.target.value)
                                            )
                                        }
                                        className="block rounded-md bg-white px-4 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        {[...Array(10).keys()].map((i) => (
                                            <option value={i + 1} key={i}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="text-indigo-600 mt-4 font-semibold"
                                        onClick={() =>
                                            handleRemoveCartItem(item.cart_id)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="w-1/3">
                                    <div className="text-right font-semibold">
                                        ${item.price}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cart
