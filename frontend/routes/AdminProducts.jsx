import ProductEditor from "../components/ProductEditor.jsx"
import React, { useState, useEffect } from "react"
import Loader from "../components/Loader.jsx"
import colors from "../utils/colors.js"

const AdminProducts = () => {
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState({
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
    const [imageUploadDialog, setImageUploadDialog] = useState({
        open: false,
        color: null,
        file: null,
    })

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

    const handleEditProductSubmit = async () => {
        setIsLoadingProduct(true)

        let promises = []

        for (let i = 0; i < product.images.length; i++) {
            if (product.images[i].file) {
                const formData = new FormData()
                formData.append("image", product.images[i].file)

                promises.push(
                    fetch("/api/upload/" + product.product_id, {
                        headers: {
                            "x-color": product.images[i].color,
                        },
                        method: "POST",
                        body: formData,
                    })
                )
            }
        }

        await Promise.all(promises)

        await fetch("/api/product/" + product.product_id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        })
        setEditing(null)
        setDialog(false)
        fetchProducts()
    }

    const handleCreateProduct = (e) => {
        e.preventDefault()

        if (editing) return

        if (
            !product.label ||
            !product.price ||
            !product.description ||
            !product.sizes.length ||
            !product.colors.length
        ) {
            return alert("Please fill all fields")
        }

        fetch("/api/product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        })

        setDialog(false)
        setIsLoadingProducts(true)
        fetchProducts()
    }

    const handleCreateProductBtnClick = () => {
        setProduct({
            label: "",
            price: 0,
            description: "",
            sizes: [],
            colors: [],
            inventories: [],
            images: [],
        })
        setEditing(null)
        setDialog(true)
    }

    const handleDeleteProduct = () => {
        fetch("/api/product/" + product.product_id, {
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
        setProduct(data)

        setIsLoadingProduct(false)
    }

    const handleUploadButtonClick = () => {
        if (!product) return

        setImageUploadDialog({
            open: true,
            color: null,
            file: null,
        })
    }

    const handleFileSelect = () => {
        if (!imageUploadDialog.color || !imageUploadDialog.file) return

        setProduct({
            ...product,
            images: [
                ...product.images,
                {
                    file: imageUploadDialog.file,
                    color: imageUploadDialog.color,
                },
            ],
        })
        setImageUploadDialog({
            open: false,
        })
    }

    return (
        <div className="flex h-full relative">
            {imageUploadDialog.open && (
                <div className="absolute w-full h-full bg-gray-400 bg-opacity-50 flex justify-center">
                    <div className="bg-white w-[600px] fixed mt-4 p-8 rounded-md border border-gray-400">
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col w-full">
                                <h3 className="font-medium text-xl">
                                    Product Image
                                </h3>
                                <p>
                                    Upload a product image, select the color for
                                    the image.
                                </p>
                            </div>
                            <div className="flex shrink-0">
                                <button
                                    onClick={() => {
                                        setImageUploadDialog({
                                            ...imageUploadDialog,
                                            open: false,
                                        })
                                    }}
                                    className="text-gray-400 h-8 w-8 flex items-center justify-center bg-red-500 hover:bg-red-400 rounded-md hover:text-gray-600"
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
                        <div className="mt-2 flex justify-center">
                            {product.colors.map((color) => {
                                const imageWithColorExists =
                                    product.images.find(
                                        (img) => img.color === color
                                    )

                                if (imageWithColorExists) {
                                    return null
                                }

                                return (
                                    <div
                                        className="inline-block mr-2 cursor-pointer hover:opacity-80"
                                        onClick={() =>
                                            setImageUploadDialog({
                                                ...imageUploadDialog,
                                                color,
                                            })
                                        }
                                        key={color}
                                    >
                                        <div
                                            className={
                                                "w-10 h-10 flex justify-center items-center rounded-full " +
                                                (imageUploadDialog.color ===
                                                color
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
                                )
                            })}
                        </div>
                        <div className="w-full mt-4 bg-gray-100 rounded-md border border-dotted border-gray-400 flex aspect-square min-h-[300px] relative flex-col items-center justify-center">
                            <input
                                onChange={(e) => {
                                    setImageUploadDialog({
                                        ...imageUploadDialog,
                                        file: e.target.files[0],
                                    })
                                }}
                                type="file"
                                className="w-full h-full absolute opacity-0 cursor-pointer"
                            />
                            {!imageUploadDialog.file ? (
                                <>
                                    <div className="font-semibold mb-2 text-xl">
                                        Upload
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-10 h-10"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                                        />
                                    </svg>
                                </>
                            ) : (
                                <div
                                    className="w-full h-full bg-no-repeat bg-center rounded-md bg-contain"
                                    style={{
                                        backgroundImage:
                                            "url(" +
                                            URL.createObjectURL(
                                                imageUploadDialog.file
                                            ) +
                                            ")",
                                    }}
                                ></div>
                            )}
                        </div>
                        <div className="flex">
                            <button
                                onClick={handleFileSelect}
                                className={
                                    "shrink-0 ml-auto text-white rounded-md p-4 mt-4 " +
                                    (!imageUploadDialog.color ||
                                    !imageUploadDialog.file
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600")
                                }
                            >
                                Select
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                                            JSON.parse(product.images)[0]?.url +
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
                <ProductEditor
                    product={product}
                    onProductEdit={setProduct}
                    editing={editing}
                    onSetEditing={setEditing}
                    onSetDialog={setDialog}
                    loading={isLoadingProduct}
                    onProductEditSubmit={handleEditProductSubmit}
                    onProductCreate={handleCreateProduct}
                    onProductDelete={handleDeleteProduct}
                    onUploadButtonClick={handleUploadButtonClick}
                />
            )}
        </div>
    )
}

export default AdminProducts
