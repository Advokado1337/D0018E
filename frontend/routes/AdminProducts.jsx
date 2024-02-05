import React, { useState, useEffect } from "react"

const AdminProducts = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(data)
    }

    console.log(products)

    return (
        <div>
            <h1 className="font-bold text-3xl">Products</h1>
            <p className="text-gray-800">
                A list of products you can edit, click on product to make
                changes.
            </p>
            <div className="flex flex-col w-full mt-4 rounded-md">
                {products.map((product) => (
                    <div className="bg-gray-800 border-b border-gray-600 p-4 flex items-center justify-between">
                        <div
                            className="p-4 m-4 h-32 w-32 bg-cover bg-center bg-no-repeat rounded-md"
                            style={{
                                backgroundImage:
                                    "url(/images/products/" +
                                    product.image +
                                    ")",
                            }}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminProducts
