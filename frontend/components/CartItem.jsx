import React from "react"

const CartItem = ({ item, onUpdateCartItem, onRemoveCartItem, disabled }) => {
    return (
        <div className="w-full h-48 border-b border-gray-300 py-8 flex">
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
                    {disabled ? null : (
                        <div className="mt-auto flex">
                            {item.quantity > 0 ? (
                                <>
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
                                    <div className="text-green-600 ml-1">
                                        In stock
                                    </div>
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="25"
                                        height="25"
                                        viewBox="0 0 100 100"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill="none"
                                            stroke="red"
                                            strokeWidth="10"
                                            d="M 10,10 l 80,80 M 10,90 l 80,-80"
                                        />
                                    </svg>
                                    <div className="text-red-600 ml-1">
                                        Out of stock
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="w-1/3">
                {disabled ? (
                    <div className="text-right font-semibold">
                        x{item.amount}
                    </div>
                ) : (
                    <>
                        <select
                            value={item.amount}
                            onChange={(e) =>
                                onUpdateCartItem(
                                    item.cart_id,
                                    Number(e.target.value)
                                )
                            }
                            className="block rounded-md bg-white px-4 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                            {[...Array(item.amount + 10).keys()].map((i) => (
                                <option value={i + 1} key={i}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <button
                            className="text-indigo-600 mt-4 font-semibold"
                            onClick={() => onRemoveCartItem(item.cart_id)}
                        >
                            Remove
                        </button>
                    </>
                )}
            </div>
            <div className="w-1/3">
                <div className="text-right font-semibold">
                    ${item.price * item.amount}
                </div>
            </div>
        </div>
    )
}

export default CartItem
