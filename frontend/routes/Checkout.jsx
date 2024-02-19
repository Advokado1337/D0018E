import React, { useEffect, useState } from "react"
import CartItem from "../components/CartItem.jsx"
import { useNavigate } from "react-router-dom"
import Loader from "../components/Loader.jsx"

const Checkout = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const [isFormValid, setIsFormValid] = useState(false)
    const [error, setError] = useState(null)
    const [inStock, setInStock] = useState(true)
    const [form, setForm] = useState({
        email: "",
        phonenumber: "",
        firstname: "",
        lastname: "",
        address: "",
        country: "",
        city: "",
        zip: "",
        cardnumber: "",
        expiration: "",
        cvc: "",
    })
    const navigate = useNavigate()

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

        if (!data.length) return navigate("/cart")

        let total = 0
        data.forEach((item) => {
            total += item.price * item.amount
            if (!item.quantity) {
                setError("Some items are out of stock")
                setInStock(false)
            }
        })

        setTotal(total)

        setIsLoading(false)
    }

    const handleFormSubmit = async () => {
        if (!isFormValid || !inStock) return

        setIsLoading(true)

        const response = await fetch("/api/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })

        let data

        try {
            data = await response.json()
        } catch (error) {
            console.log(error)
        }

        if (data && !data.error) {
            const { orders_id } = data
            navigate("/order/" + orders_id)
        } else {
            setError(data.error)
            setIsLoading(false)
        }
    }

    const handleFormChange = ({ target }) => {
        const name = target.name
        const value = target.value

        const newForm = { ...form, [name]: value }

        const isValid = Object.keys(newForm).every((key) => {
            // Check if minLength attribute for input is fufilled
            if (target.minLength && value.length < target.minLength) {
                return false
            }
            // Check if maxLength attribute for input is fufilled
            if (target.maxLength && value.length > target.maxLength) {
                return false
            }
            // Check if input is required and not empty
            if (target.required && !value) {
                return false
            }
            return newForm[key].length > 0
        })

        setIsFormValid(isValid)
        setForm(newForm)
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

    useEffect(() => {
        fetchCartItems()
    }, [])

    return (
        <div className="flex py-8 gap-4 w-full">
            {isLoading ? (
                <div className="w-full flex items-center justify-center py-12">
                    <Loader />
                </div>
            ) : (
                <>
                    <div className="w-full px-4">
                        <div className="border-b border-gray-200 pb-12">
                            <h1 className="text-xl font-medium mb-4">
                                Contact Information
                            </h1>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    onChange={handleFormChange}
                                    value={form.email}
                                    type="email"
                                    required
                                    name="email"
                                    className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="flex flex-col w-full mt-4">
                                <label className="text-gray-700 font-medium mb-2">
                                    Phonenumber
                                </label>
                                <input
                                    onChange={handleFormChange}
                                    value={form.phonenumber}
                                    type="text"
                                    required
                                    name="phonenumber"
                                    className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                        </div>
                        <div className="border-b border-gray-200 py-12">
                            <h1 className="text-xl font-medium mb-4">
                                Shipping Information
                            </h1>
                            <div className="flex w-full">
                                <div className="flex flex-col w-full pr-4">
                                    <label className="text-gray-700 font-medium mb-2">
                                        Firstname
                                    </label>
                                    <input
                                        onChange={handleFormChange}
                                        value={form.firstname}
                                        name="firstname"
                                        required
                                        type="text"
                                        className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="flex flex-col w-full pl-4">
                                    <label className="text-gray-700 font-medium mb-2">
                                        Lastname
                                    </label>
                                    <input
                                        onChange={handleFormChange}
                                        value={form.lastname}
                                        name="lastname"
                                        required
                                        type="text"
                                        className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col w-full mt-4">
                                <label className="text-gray-700 font-medium mb-2">
                                    Address
                                </label>
                                <input
                                    onChange={handleFormChange}
                                    value={form.address}
                                    name="address"
                                    required
                                    type="text"
                                    className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="flex w-full mt-4">
                                <div className="flex flex-col w-full pr-4">
                                    <label className="text-gray-700 font-medium mb-2">
                                        Country
                                    </label>
                                    <input
                                        onChange={handleFormChange}
                                        value={form.country}
                                        name="country"
                                        required
                                        type="text"
                                        className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="flex flex-col w-full pl-4">
                                    <label className="text-gray-700 font-medium mb-2">
                                        City
                                    </label>
                                    <input
                                        onChange={handleFormChange}
                                        value={form.city}
                                        name="city"
                                        required
                                        type="text"
                                        className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="flex flex-col w-full pl-4">
                                    <label className="text-gray-700 font-medium mb-2">
                                        Zip
                                    </label>
                                    <input
                                        onChange={handleFormChange}
                                        value={form.zip}
                                        name="zip"
                                        required
                                        type="text"
                                        className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pb-12 mt-12">
                            <h1 className="text-xl font-medium mb-4">
                                Payment Information
                            </h1>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 font-medium mb-2">
                                    Card number
                                </label>
                                <input
                                    onChange={handleFormChange}
                                    value={form.cardnumber}
                                    type="text"
                                    required
                                    name="cardnumber"
                                    placeholder="ex. 1234 5678 9012 3456"
                                    minLength={16}
                                    maxLength={16}
                                    className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="flex w-full mt-4">
                                <div className="flex flex-col w-full pr-4">
                                    <label className="text-gray-700 font-medium mb-2">
                                        Expiration
                                    </label>
                                    <input
                                        onChange={handleFormChange}
                                        value={form.expiration}
                                        name="expiration"
                                        minLength={5}
                                        maxLength={5}
                                        placeholder="MM/YY"
                                        required
                                        type="text"
                                        className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="flex flex-col w-full pl-4">
                                    <label className="text-gray-700 font-medium mb-2">
                                        CVC
                                    </label>
                                    <input
                                        onChange={handleFormChange}
                                        value={form.cvc}
                                        name="cvc"
                                        minLength={3}
                                        maxLength={3}
                                        placeholder="ex. 123"
                                        required
                                        type="text"
                                        className="w-full border rounded-md p-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-4">
                        <h1 className="text-xl font-medium">Order summary</h1>
                        <div className="flex flex-col w-full">
                            {cart.map((item) => (
                                <CartItem
                                    onUpdateCartItem={handleUpdateCartItem}
                                    onRemoveCartItem={handleRemoveCartItem}
                                    item={item}
                                    key={item.cart_id}
                                />
                            ))}
                        </div>
                        <div className="flex justify-center border-b text-2xl border-gray-200 pb-12 mt-12">
                            <div className="font-medium flex">Total</div>
                            <div className="ml-auto flex">${total}</div>
                        </div>
                        <button
                            className={
                                "w-full py-4 text-center mt-8 text-white font-semibold rounded-md" +
                                (isFormValid && inStock
                                    ? " bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 cursor-pointer"
                                    : " bg-gray-300 cursor-not-allowed")
                            }
                            onClick={handleFormSubmit}
                        >
                            Place order
                        </button>
                        {error && (
                            <div className="bg-red-600 text-red-200 p-4 text-center mt-4">
                                {error}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Checkout
