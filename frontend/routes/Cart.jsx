import React, { useState, useEffect } from "react"
import CartItem from "../components/CartItem.jsx"
import Loader from "../components/Loader.jsx"
import { Link } from "react-router-dom"

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
                            <CartItem
                                onUpdateCartItem={handleUpdateCartItem}
                                onRemoveCartItem={handleRemoveCartItem}
                                item={item}
                                key={item.cart_id}
                            />
                        ))
                    )}
                </div>
                {cart.length ? (
                    <Link
                        to="/checkout"
                        className="w-full py-4 text-center mt-8 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 active:bg-indigo-800"
                    >
                        Checkout
                    </Link>
                ) : null}
            </div>
        </div>
    )
}

export default Cart
