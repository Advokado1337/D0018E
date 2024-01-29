import React, { useState, useEffect } from "react"

const Products = () => {
    const sortOptions = {
        price_asc: "Price Ascending",
        price_desc: "Price Descending",
        popular: "Popular",
        new: "New",
    }
    const [sortDialog, setSortDialog] = useState({
        open: false,
        selected: null,
    })

    const [form, setForm] = useState({
        search: "",
        minPrice: 0,
        maxPrice: 0,
        colors: {
            red: false,
            blue: false,
            green: false,
            brown: false,
            black: false,
            purple: false,
            yellow: false,
        },
        sizes: {
            XS: false,
            S: false,
            M: false,
            L: false,
            XL: false,
            XXL: false,
        },
    })

    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [form, sortDialog.selected])

    const fetchProducts = () => {
        const colors = Object.keys(form.colors).filter(
            (color) => form.colors[color]
        )
        const sizes = Object.keys(form.sizes).filter((size) => form.sizes[size])

        const params = {
            search: form.search,
            minPrice: form.minPrice,
            maxPrice: form.maxPrice,
            colors,
            sizes,
        }

        if (sortDialog.selected) params.sort = sortDialog.selected

        const searchParams = new URLSearchParams(params)

        fetch("/api/products?" + searchParams.toString())
            .then((res) => res.json())
            .then((data) => {
                setProducts(data)
            })
    }

    const handleFormChange = (event) => {
        const { name, value } = event.target

        const [key, subKey] = name.split(".")

        if (subKey) {
            setForm({
                ...form,
                [key]: {
                    ...form[key],
                    [subKey]: !form[key][subKey],
                },
            })
        } else {
            setForm({
                ...form,
                [name]: value,
            })
        }
    }

    return (
        <div className="flex py-8">
            <form
                className="w-1/4"
                onChange={handleFormChange}
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex flex-col">
                    <label className="font-medium mb-2 font-semibold">
                        Search
                    </label>
                    <input
                        defaultValue={form.search}
                        name="search"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></input>
                </div>
                <div className="flex items-center pt-4 mt-8 border-t border-gray-300">
                    <div className="w-full">
                        <label className="font-medium font-semibold">
                            Min price
                        </label>
                        <input
                            defaultValue={form.minPrice}
                            name="minPrice"
                            type="number"
                            className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></input>
                    </div>
                    <div className="mx-4 text-xl font-bold mt-6">-</div>
                    <div className="w-full">
                        <label className="font-medium font-semibold">
                            Max price
                        </label>
                        <input
                            defaultValue={form.maxPrice}
                            name="maxPrice"
                            type="number"
                            className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></input>
                    </div>
                </div>
                <div className="flex flex-col mt-8 pt-4 border-t border-gray-300">
                    <label className="font-medium font-semibold">Color</label>
                    {Object.keys(form.colors).map((color, i) => (
                        <div className="mt-4 flex items-center" key={i}>
                            <input
                                name={"colors." + color}
                                defaultValue={form.colors[color]}
                                type="checkbox"
                                className="border w-5 h-5"
                            ></input>
                            <label className="text-gray-600 ml-4 capitalize">
                                {color}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col mt-8 pt-4 border-t border-gray-300">
                    <label className="font-medium font-semibold">Sizes</label>
                    {Object.keys(form.sizes).map((size, i) => (
                        <div className="mt-4 flex items-center" key={i}>
                            <input
                                name={"sizes." + size}
                                defaultValue={form.sizes[size]}
                                type="checkbox"
                                className="border w-5 h-5"
                            ></input>
                            <label className="text-gray-600 ml-4 uppercase">
                                {size}
                            </label>
                        </div>
                    ))}
                </div>
            </form>
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
                            {sortDialog.selected
                                ? sortOptions[sortDialog.selected]
                                : "Sort"}
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
                                    {Object.keys(sortOptions).map(
                                        (option, i) => (
                                            <button
                                                key={i}
                                                onClick={() =>
                                                    setSortDialog({
                                                        selected: option,
                                                        open: false,
                                                    })
                                                }
                                                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                            >
                                                {sortOptions[option]}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full pl-8 mt-12 flex">
                    {products.length ? (
                        <div className="mt-6 w-full grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {products.map((product) => (
                                <div
                                    className="group relative"
                                    key={product.product_id}
                                >
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
