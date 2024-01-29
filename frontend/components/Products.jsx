import React, { useState,useEffect} from "react"

const Products = () => {
    const sortOptions = [
        "Price Ascending",
        "Price Descending",
        "Popular",
        "New",
    ]
    const [sortDialog, setSortDialog] = useState({
        open: false,
        selected: null,
    })

    const [products, setProducts] = useState([])

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data)
            })
    }, [])

    return (
        <div className="flex py-8">
            <div className="w-1/4">
                <div className="flex flex-col">
                    <label className="font-medium mb-2">Search</label>
                    <input className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></input>
                </div>
                <div className="flex flex-col mt-8 pt-4 border-t border-gray-300">
                    <label className="font-medium">Color</label>
                    {[
                        "Red",
                        "Blue",
                        "Green",
                        "Yellow",
                        "Brown",
                        "Black",
                        "Purple",
                    ].map((color, i) => (
                        <div className="mt-4 flex items-center" key={i}>
                            <input
                                value={color}
                                type="checkbox"
                                className="border w-5 h-5"
                            ></input>
                            <label className="text-gray-600 ml-4 captilize">
                                {color}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col mt-8 pt-4 border-t border-gray-300">
                    <label className="font-medium">Size</label>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size, i) => (
                        <div className="mt-4 flex items-center" key={i}>
                            <input
                                value={size}
                                type="checkbox"
                                className="border w-5 h-5"
                            ></input>
                            <label className="text-gray-600 ml-4 captilize">
                                {size}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-3/4">
                <div className="flex">
                    <div className="relative mt-[24px] inline-block text-left ml-auto">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() =>
                                setSortDialog({
                                    ...sortDialog,
                                    open: !sortDialog.open,
                                })
                            }
                        >
                            {sortDialog.selected ? sortDialog.selected : "Sort"}
                            <svg
                                className="-mr-1 h-5 w-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        {sortDialog.open && (
                            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {sortOptions.map((option, i) => (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                setSortDialog({
                                                    selected: option,
                                                    open: false,
                                                })
                                            }
                                            className="text-gray-700 block px-4 py-2 text-sm"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full pl-8 mt-12 flex">
                    {products.length ? (
                        <div className="mt-6 w-full grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {products.map((product) => (
                                <div className="group relative">
                                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                        <img
                                            src={
                                                "/images/products/" +
                                                product.image
                                            }
                                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <h3 className="text-sm text-gray-700">
                                                <a href="#">
                                                    <span className="absolute inset-0"></span>
                                                    {product.label}
                                                </a>
                                            </h3>
                                            <p className="mt-1 text-sm capitalize text-gray-500">
                                                {product.label}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            ${product.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full text-center mt-6">
                            Couldn't find any products
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Products
