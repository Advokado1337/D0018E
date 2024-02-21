import colors from "../utils/colors.js"
import Loader from "./Loader.jsx"
import React from "react"

const ProductEditor = ({
    product,
    onProductEdit,
    editing,
    onSetEditing,
    onSetDialog,
    loading,
    onProductEditSubmit,
    onProductCreate,
    onProductDelete,
    onUploadButtonClick,
}) => {
    const handleProductFormEdit = (e) => {
        onProductEdit({
            ...product,
            [e.target.name]: e.target.value,
        })
    }

    const handleCloseDialog = () => {
        onSetDialog(false)
        onSetEditing(null)
    }

    const handleSizeClick = (size) => {
        onProductEdit({
            ...product,
            sizes: product.sizes.includes(size)
                ? product.sizes.filter((s) => s !== size)
                : [...product.sizes, size],
        })
    }

    const handleColorClick = (color) => {
        onProductEdit({
            ...product,
            colors: product.colors.includes(color)
                ? product.colors.filter((c) => c !== color)
                : [...product.colors, color],
        })
    }

    const handleInventoryQuantityChange = (e, inventory) => {
        onProductEdit({
            ...product,
            inventories: product.inventories.map((i) =>
                i.inventory_id === inventory.inventory_id
                    ? {
                          ...i,
                          quantity: e.target.value,
                      }
                    : i
            ),
        })
    }

    const handleImageRemove = (image) => {
        onProductEdit({
            ...product,
            images: product.images.filter((i) => i.url !== image.url),
        })
    }

    return (
        <div className="max-w-[550px] w-full bg-white min-h-full p-8 border-l-2 border-gray-200">
            {loading && editing ? (
                <div className="w-full mt-24 flex justify-center items-center">
                    <Loader message="Loading product..." />
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-xl">
                            {editing ? "Edit Product" : "Create Product"}
                        </h2>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseDialog}
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
                    {editing && (
                        <div className="bg-gray-300 rounded-md p-4 mt-4">
                            <h3 className="font-semibold text-gray-500">
                                Images
                            </h3>
                            <div className="py-2 flex overflow-x-auto flex-nowrap">
                                {product.images.map((image, i) => (
                                    <div
                                        key={i}
                                        className="h-[300px] w-[300px] bg-cover bg-no-repeat overflow-hidden rounded-md mr-4 relative shrink-0"
                                        style={{
                                            backgroundImage:
                                                "url(" +
                                                (image.url
                                                    ? "/images/products/" +
                                                      image.url
                                                    : URL.createObjectURL(
                                                          image.file
                                                      )) +
                                                ")",
                                        }}
                                    >
                                        <div className="m-2 flex">
                                            <div className="w-10 h-10 flex justify-center items-center rounded-full ">
                                                <div
                                                    className={
                                                        "w-8 h-8 rounded-full " +
                                                        colors[image.color].bg
                                                    }
                                                ></div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleImageRemove(image)
                                                }
                                                className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-md ml-auto"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    class="w-6 h-6 stroke-white fill-none"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {product.images.length <
                                    product.colors.length && (
                                    <button
                                        onClick={onUploadButtonClick}
                                        className="flex relative items-center justify-center bg-white rounded-md border border-dashed border-gray-400 h-[300px] w-[300px] shrink-0"
                                    >
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
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="bg-gray-300 rounded-md p-4 mt-4">
                        <h3 className="font-semibold text-gray-500">Label</h3>
                        <input
                            onChange={handleProductFormEdit}
                            name="label"
                            value={product.label}
                            type="text"
                            className="w-full p-4 rounded-md mt-2 border-none outline-none ring-2 ring-gray-400 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="bg-gray-300 rounded-md p-4 mt-4">
                        <h3 className="font-semibold text-gray-500">Price</h3>
                        <input
                            onChange={handleProductFormEdit}
                            name="price"
                            type="number"
                            value={product.price}
                            className="w-full p-4 rounded-md mt-2 border-none outline-none ring-2 ring-gray-400 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="bg-gray-300 rounded-md p-4 mt-4">
                        <h3 className="font-semibold text-gray-500">
                            Description
                        </h3>
                        <textarea
                            onChange={handleProductFormEdit}
                            name="description"
                            type="text"
                            value={product.description}
                            className="w-full min-h-[200px] p-4 rounded-md mt-2 border-none outline-none ring-2 ring-gray-400 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="bg-gray-300 rounded-md p-4 mt-4">
                        <h3 className="font-semibold text-gray-500">Sizes</h3>
                        <div className="flex mt-2">
                            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                <div
                                    key={size}
                                    className={
                                        "border cursor-pointer rounded-md py-3 px-6 border-gray-400 mr-2  hover:border-indigo-500 " +
                                        (product.sizes.includes(size) &&
                                            "bg-indigo-500 text-white border-indigo-500")
                                    }
                                    onClick={() => handleSizeClick(size)}
                                >
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-300 rounded-md p-4 mt-4">
                        <h3 className="font-semibold text-gray-500">Colors</h3>
                        <div className="mt-2">
                            {Object.keys(colors).map((color) => (
                                <div
                                    className="inline-block mr-2 cursor-pointer hover:opacity-80"
                                    key={color}
                                    onClick={() => handleColorClick(color)}
                                >
                                    <div
                                        className={
                                            "w-10 h-10 flex justify-center items-center rounded-full " +
                                            (product.colors.includes(color)
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
                            {product.inventories.map((inventory) => (
                                <div
                                    key={
                                        inventory.inventory_id ||
                                        inventory.size + inventory.color
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
                                                value={inventory.quantity}
                                                onChange={(e) =>
                                                    handleInventoryQuantityChange(
                                                        e,
                                                        inventory
                                                    )
                                                }
                                                className="w-full p-2 rounded-md mt-2 border-none outline-none ring-2 ring-gray-400 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex">
                        {editing ? (
                            <>
                                <button
                                    className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-md p-4 mt-4 ml-auto"
                                    onClick={onProductEditSubmit}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-400 text-white rounded-md p-4 mt-4 ml-4"
                                    onClick={onProductDelete}
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <button
                                className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-md p-4 mt-4 ml-auto"
                                type="submit"
                                onClick={onProductCreate}
                            >
                                Create
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default ProductEditor
