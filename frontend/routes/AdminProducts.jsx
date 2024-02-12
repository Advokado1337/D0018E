import React, { useState, useEffect } from "react"
import Loader from "../components/Loader.jsx"

const AdminProducts = () => {
    const [products, setProducts] = useState([])
    const [editProduct, setEditProduct] = useState({
        label: "",
        price: 0,
        description: "",
        sizes: [],
        colors: [],
        inventories: [],
    })
    const [dialog, setDialog] = useState(false)
    const [editing, setEditing] = useState(null)
    const [isLoadingProducts, setIsLoadingProducts] = useState(true)
    const [isLoadingProduct, setIsLoadingProduct] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(
            data.map((product) => ({
                ...product,
                sizes: JSON.parse(product.sizes),
                colors: JSON.parse(product.colors),
            }))
        )
        setIsLoadingProducts(false)
    }

    const handleDialogEdit = (e) => {
        setEditProduct({
            ...editProduct,
            [e.target.name]: e.target.value,
        })
    }

    const handleEditProduct = () => {
        fetch("/api/product/" + editProduct.product_id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editProduct),
        })
        setEditing(null)
        setDialog(false)
        setIsLoadingProducts(true)
        fetchProducts()
    }

    const handleCreateProduct = (e) => {
        e.preventDefault()

        if (editing) return

        if (
            !editProduct.label ||
            !editProduct.price ||
            !editProduct.description ||
            !editProduct.sizes.length ||
            !editProduct.colors.length
        ) {
            return alert("Please fill all fields")
        }

        fetch("/api/product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editProduct),
        })

        setDialog(false)
        setIsLoadingProducts(true)
        fetchProducts()
    }

    const handleCreateProductBtnClick = () => {
        setEditProduct({
            label: "",
            price: 0,
            description: "",
            sizes: [],
            colors: [],
            inventories: [],
        })
        setEditing(null)
        setDialog(true)
    }

    const handleDeleteProduct = () => {
        fetch("/api/product/" + editProduct.product_id, {
            method: "DELETE",
        })

        setEditing(null)
        setDialog(false)
        setIsLoadingProducts(true)
        fetchProducts()
    }

    const fetchProduct = async (id) => {
        setIsLoadingProduct(true)
        const response = await fetch("/api/product/" + id)
        const data = await response.json()
        setEditProduct(data)

        setIsLoadingProduct(false)
    }

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

    return (
        <div className="flex h-full">
            <div className="w-full p-8">
                <div className="flex">
                    <div className="w-full">
                        <h1 className="font-bold text-3xl">Products</h1>
                        <p className="text-gray-800">
                            A list of products you can edit, click on product to
                            make changes.
                        </p>
                    </div>
                    <button
                        className="shrink-0 bg-indigo-500 hover:bg-indigo-400 text-white rounded-md p-4"
                        onClick={handleCreateProductBtnClick}
                    >
                        Create Product
                    </button>
                </div>
                {isLoadingProducts ? (
                    <div className="w-full mt-24 flex justify-center items-center">
                        <Loader message="Loading cart..." />
                    </div>
                ) : (
                    <div className="flex flex-col w-full mt-4">
                        {products.map((product) => (
                            <div
                                key={product.product_id}
                                className={
                                    "bg-white p-4 flex rounded-md overflow-hidden mt-4 cursor-pointer" +
                                    (editing === product.product_id
                                        ? " border border-indigo-500"
                                        : " border-b-2 border-gray-200")
                                }
                                onClick={() => {
                                    setIsLoadingProduct(true)
                                    fetchProduct(product.product_id)
                                    setEditing(product.product_id)
                                    setDialog(true)
                                }}
                            >
                                <div
                                    className="p-4 shrink-0 h-32 w-32 bg-cover bg-center bg-no-repeat rounded-md"
                                    style={{
                                        backgroundImage:
                                            "url(/images/products/" +
                                            product.image +
                                            ")",
                                    }}
                                ></div>
                                <div className="w-full flex justify-between ml-4">
                                    <div className="flex flex-col w-full">
                                        <div className="text-gray-500 font-semibold">
                                            Label
                                        </div>
                                        <div className="text-gray-800 capitalize">
                                            {product.label}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className="text-gray-500 font-semibold">
                                            Price
                                        </div>
                                        <div className="text-gray-800 capitalize">
                                            {product.price}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className="text-gray-500 font-semibold">
                                            Description
                                        </div>
                                        <div className="text-gray-800 capitalize">
                                            {product.description.truncate(40)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className="text-gray-500 font-semibold">
                                            Colors
                                        </div>
                                        <div className="text-gray-800 capitalize">
                                            {product.colors.map((color) => (
                                                <div
                                                    key={color}
                                                    className={
                                                        "w-4 h-4 mr-2 inline-block rounded-full border " +
                                                        colors[color].bg +
                                                        " " +
                                                        colors[color].border
                                                    }
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className="text-gray-500 font-semibold">
                                            Sizes
                                        </div>
                                        <div className="text-gray-800 capitalize">
                                            {product.sizes.join(", ")}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className="text-gray-500 font-semibold">
                                            ID
                                        </div>
                                        <div className="text-gray-800 capitalize">
                                            {product.product_id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {dialog && (
                <div className="max-w-[550px] w-full bg-white min-h-full p-8 border-l-2 border-gray-200">
                    {isLoadingProduct && editing ? (
                        <div className="w-full mt-24 flex justify-center items-center">
                            <Loader message="Loading product..." />
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold text-xl">
                                    {editing
                                        ? "Edit Product"
                                        : "Create Product"}
                                </h2>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            setDialog(false)
                                            setEditing(null)
                                        }}
                                        className="text-gray-400 bg-red-500 hover:bg-red-400 rounded-md p-2 hover:text-gray-600"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="white"
                                            className="w-6 h-6"
                                        >
                                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-300 rounded-md p-4 mt-4">
                                <h3 className="font-semibold text-gray-500">
                                    Label
                                </h3>
                                <input
                                    onChange={handleDialogEdit}
                                    name="label"
                                    value={editProduct.label}
                                    type="text"
                                    className="w-full p-4 rounded-md mt-2 border-none outline-none ring-2 ring-gray-400 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="bg-gray-300 rounded-md p-4 mt-4">
                                <h3 className="font-semibold text-gray-500">
                                    Price
                                </h3>
                                <input
                                    onChange={handleDialogEdit}
                                    name="price"
                                    type="number"
                                    value={editProduct.price}
                                    className="w-full p-4 rounded-md mt-2 border-none outline-none ring-2 ring-gray-400 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="bg-gray-300 rounded-md p-4 mt-4">
                                <h3 className="font-semibold text-gray-500">
                                    Description
                                </h3>
                                <textarea
                                    onChange={handleDialogEdit}
                                    name="description"
                                    type="text"
                                    value={editProduct.description}
                                    className="w-full min-h-[200px] p-4 rounded-md mt-2 border-none outline-none ring-2 ring-gray-400 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="bg-gray-300 rounded-md p-4 mt-4">
                                <h3 className="font-semibold text-gray-500">
                                    Sizes
                                </h3>
                                <div className="flex mt-2">
                                    {["XS", "S", "M", "L", "XL", "XXL"].map(
                                        (size) => (
                                            <div
                                                key={size}
                                                className={
                                                    "border cursor-pointer rounded-md py-3 px-6 border-gray-400 mr-2  hover:border-indigo-500 " +
                                                    (editProduct.sizes.includes(
                                                        size
                                                    )
                                                        ? "bg-indigo-500 text-white border-indigo-500"
                                                        : "")
                                                }
                                                onClick={() => {
                                                    if (
                                                        editProduct.sizes.includes(
                                                            size
                                                        )
                                                    ) {
                                                        setEditProduct({
                                                            ...editProduct,
                                                            sizes: editProduct.sizes.filter(
                                                                (s) =>
                                                                    s !== size
                                                            ),
                                                        })
                                                    } else {
                                                        setEditProduct({
                                                            ...editProduct,
                                                            sizes: [
                                                                ...editProduct.sizes,
                                                                size,
                                                            ],
                                                        })
                                                    }
                                                }}
                                            >
                                                {size}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-300 rounded-md p-4 mt-4">
                                <h3 className="font-semibold text-gray-500">
                                    Colors
                                </h3>
                                <div className="mt-2">
                                    {Object.keys(colors).map((color) => (
                                        <div
                                            className="inline-block mr-2 cursor-pointer hover:opacity-80"
                                            key={color}
                                            onClick={() => {
                                                if (
                                                    editProduct.colors.includes(
                                                        color
                                                    )
                                                ) {
                                                    setEditProduct({
                                                        ...editProduct,
                                                        colors: editProduct.colors.filter(
                                                            (c) => c !== color
                                                        ),
                                                    })
                                                } else {
                                                    setEditProduct({
                                                        ...editProduct,
                                                        colors: [
                                                            ...editProduct.colors,
                                                            color,
                                                        ],
                                                    })
                                                }
                                            }}
                                        >
                                            <div
                                                className={
                                                    "w-10 h-10 flex justify-center items-center rounded-full " +
                                                    (editProduct.colors.includes(
                                                        color
                                                    )
                                                        ? colors[color].border +
                                                          " border-2"
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
                            </div>
                            <div className="bg-gray-300 rounded-md p-4 mt-4">
                                <div className="flex items-center w-full">
                                    <h3 className="font-semibold w-full text-gray-500">
                                        Inventory
                                    </h3>
                                </div>
                                <div className="mt-4">
                                    {editProduct.inventories.map(
                                        (inventory) => (
                                            <div
                                                key={
                                                    inventory.inventory_id ||
                                                    inventory.size +
                                                        inventory.color
                                                }
                                                className="flex flex-col p-2 bg-white rounded-md mb-4"
                                            >
                                                <div className="flex w-full">
                                                    <div className="flex flex-col w-full">
                                                        <div className="text-gray-500">
                                                            Size
                                                        </div>
                                                        <div className="h-full flex items-center">
                                                            {inventory.size}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col w-full">
                                                        <div className="text-gray-500">
                                                            Color
                                                        </div>
                                                        <div className="h-full flex items-center">
                                                            {inventory.color}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col w-full">
                                                        <div className="text-gray-500">
                                                            Quantity
                                                        </div>
                                                        <input
                                                            type="number"
                                                            value={
                                                                inventory.quantity
                                                            }
                                                            onChange={(e) => {
                                                                setEditProduct({
                                                                    ...editProduct,
                                                                    inventories:
                                                                        editProduct.inventories.map(
                                                                            (
                                                                                i
                                                                            ) =>
                                                                                i.inventory_id ===
                                                                                inventory.inventory_id
                                                                                    ? {
                                                                                          ...i,
                                                                                          quantity:
                                                                                              e
                                                                                                  .target
                                                                                                  .value,
                                                                                      }
                                                                                    : i
                                                                        ),
                                                                })
                                                            }}
                                                            className="w-full p-2 rounded-md mt-2 border-none outline-none ring-2 ring-gray-400 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex">
                                {editing ? (
                                    <>
                                        <button
                                            className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-md p-4 mt-4 ml-auto"
                                            onClick={handleEditProduct}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-400 text-white rounded-md p-4 mt-4 ml-4"
                                            onClick={handleDeleteProduct}
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-md p-4 mt-4 ml-auto"
                                        type="submit"
                                        onClick={handleCreateProduct}
                                    >
                                        Create
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default AdminProducts
