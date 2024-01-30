import { useParams, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"

const Product = () => {
    const { id } = useParams()

    const [product, setProduct] = useState()
    const [selectedColor, setSelectedColor] = useState()
    const [selectedSize, setSelectedSize] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        fetch("/api/product/" + id)
            .then((res) => res.json())
            .then((data) => {
                if (!data || !Object.keys(data).length) return navigate("/404")
                data.colors = JSON.parse(data.colors)
                data.sizes = JSON.parse(data.sizes)
                setProduct(data)
                setSelectedColor(data.colors[0])
                setSelectedSize(data.sizes[0])
            })
    }, [])

    const colors = {
        gray: {
            bg: "bg-gray-400",
            border: "border-gray-400",
        },
        purple: {
            bg: "bg-purple-400",
            border: "border-purple-400",
        },
        orange: {
            bg: "bg-orange-400",
            border: "border-orange-400",
        },
        red: {
            bg: "bg-red-400",
            border: "border-red-400",
        },
        white: {
            bg: "bg-white",
            border: "border-gray-400",
        },
        black: {
            bg: "bg-black",
            border: "border-gray-900",
        },
        yellow: {
            bg: "bg-yellow-400",
            border: "border-yellow-400",
        },
        green: {
            bg: "bg-green-400",
            border: "border-green-400",
        },
        blue: {
            bg: "bg-blue-400",
            border: "border-blue-400",
        },
    }

    const handleAddToCart = () => {
        fetch("/api/cart/add", {
            method: "POST",
            body: JSON.stringify({
                product_id: product.product_id,
                color: selectedColor,
                size: selectedSize,
            }),
        })
    }

    if (!product) return <div>Loading...</div>

    return (
        <div className="flex py-8">
            <div className="flex w-full">
                <div className="w-full border rounded-md bg-gray aspect-square overflow-hidden">
                    <img
                        src={"/images/products/" + product.image}
                        alt={product.label}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="w-full flex-col flex px-4">
                    <h2 className="font-semibold text-3xl capitalize">
                        {product.label}
                    </h2>
                    <h2 className="text-3xl mt-2">${product.price}</h2>
                    <h4 className="mt-4">Color</h4>
                    <div className="mt-2">
                        {product.colors.map((color) => (
                            <div
                                className="inline-block mr-2 cursor-pointer hover:opacity-80"
                                key={color}
                            >
                                <div
                                    onClick={() => setSelectedColor(color)}
                                    className={
                                        "w-10 h-10 flex justify-center items-center rounded-full " +
                                        (color === selectedColor
                                            ? colors[color].border + " border-2"
                                            : "")
                                    }
                                >
                                    <div
                                        className={
                                            "w-8 h-8 rounded-full " +
                                            colors[color].bg +
                                            (color === "white"
                                                ? " border border-gray-400"
                                                : "")
                                        }
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h4 className="mt-4">Size</h4>
                    <div className="flex mt-2">
                        {product.sizes.map((size) => (
                            <div
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={
                                    "border cursor-pointer rounded-md py-3 px-6 border-gray-400 mr-2 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 " +
                                    (selectedSize === size
                                        ? "bg-indigo-500 text-white border-indigo-500"
                                        : "")
                                }
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                    <h4 className="mt-4">Description</h4>
                    <p className="mt-2 text-gray-700">{product.description}</p>
                    <button
                        onClick={handleAddToCart}
                        className="mt-4 bg-indigo-500 border border-indigo500 py-3 rounded-md text-white justify-center flex"
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Product
