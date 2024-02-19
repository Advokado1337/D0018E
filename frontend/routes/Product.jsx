import { useParams, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import Loader from "../components/Loader.jsx"

const Product = () => {
    const { id } = useParams()

    const [product, setProduct] = useState()
    const [selectedColor, setSelectedColor] = useState()
    const [selectedSize, setSelectedSize] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [addToCartThrottle, setAddToCartThrottle] = useState(false)
    const [inStock, setInStock] = useState(false)
    const [canReview, setCanReview] = useState(false)
    const [reviewModal, setReviewModal] = useState({
        open: false,
        text: "",
        rating: 0,
    })
    const [reviews, setReviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchReviews()
        fetchProduct()
    }, [])

    const fetchProduct = async () => {
        setIsLoading(true)

        const response = await fetch("/api/product/" + id, {
            method: "GET",
        })

        const data = await response.json()

        if (!data || data.error) {
            return navigate("/404")
        }
        setProduct(data)
        setIsLoading(false)
        setSelectedColor(data.colors[0])
        setSelectedSize(data.sizes[0])
    }

    const fetchReviews = async () => {
        setIsLoading(true)
        const response = await fetch("/api/review/" + id, {
            method: "GET",
        })

        const data = await response.json()

        if (!data || data.error) {
            return alert(data.error)
        }

        setCanReview(data.canReview)
        setReviews(data.reviews)
        setIsLoading(false)
    }

    useEffect(() => {
        const inventory = product?.inventories.find(
            (item) => item.color === selectedColor && item.size === selectedSize
        )
        setInStock(inventory?.quantity > 0)
    }, [selectedColor, selectedSize])

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

    const handleReviewModalOpen = () => {
        if (!canReview) return

        setReviewModal({ open: true, text: "", rating: 0 })
    }

    const handleReviewSubmit = async () => {
        console.log("ne")
        setIsLoading(true)
        await fetch("/api/review/" + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: reviewModal.text,
                rating: reviewModal.rating,
            }),
        })

        setReviewModal({ open: false, text: "", rating: 0 })
        fetchReviews()
    }

    const handleAddToCart = () => {
        if (addToCartThrottle || !inStock) return
        setAddToCartThrottle(true)
        fetch("/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_id: id,
                color: selectedColor,
                size: selectedSize,
            }),
        })
        setTimeout(() => {
            setAddToCartThrottle(false)
        }, 1000)
    }

    if (isLoading || !product) {
        return (
            <div className="flex items-center justify-center min-h-[500px] h-full">
                <Loader />
            </div>
        )
    }

    return (
        <div className="flex flex-col py-8">
            {reviewModal.open ? (
                <div className="w-full h-full items-center justify-center flex">
                    <div className="flex flex-col min-w-[700px]">
                        <h1 className="font-semibold text-3xl">
                            Write a Review
                        </h1>
                        <p className="text-gray-600">
                            Please leave a review to help others. Thank you!
                        </p>
                        <div className="flex mt-4 mx-auto">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                    key={i}
                                    onClick={() =>
                                        setReviewModal({
                                            ...reviewModal,
                                            rating: i + 1,
                                        })
                                    }
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={
                                        (i < reviewModal.rating
                                            ? "fill-yellow-400 stroke-yellow-400"
                                            : "stroke-gray-500 fill-gray-500") +
                                        " w-12 h-12"
                                    }
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                    />
                                </svg>
                            ))}
                        </div>
                        <label className="font-medium mt-4">
                            Product Review
                        </label>
                        <textarea
                            value={reviewModal.text}
                            onChange={(e) => {
                                setReviewModal({
                                    ...reviewModal,
                                    text: e.target.value,
                                })
                            }}
                            className="mt-2 p-4 border rounded-md w-full h-48 outline-none focus:ring-indigo-500 ring-2"
                        >
                            {reviewModal.text}
                        </textarea>
                        <div className="flex flex-row-reverse">
                            <button
                                onClick={handleReviewSubmit}
                                className="mt-4 p-4 rounded-md text-white justify-center flex bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
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
                                            onClick={() =>
                                                setSelectedColor(color)
                                            }
                                            className={
                                                "w-10 h-10 flex justify-center items-center rounded-full " +
                                                (color === selectedColor
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
                            <p className="mt-2 text-gray-700">
                                {product.description}
                            </p>
                            <button
                                onClick={handleAddToCart}
                                title={inStock ? "Add to cart" : "Out of stock"}
                                className={
                                    "mt-4 py-3 rounded-md text-white justify-center flex w-full" +
                                    (addToCartThrottle || !inStock
                                        ? " cursor-not-allowed bg-gray-400"
                                        : " bg-indigo-500 hover:bg-indigo-600")
                                }
                            >
                                Add to cart
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex flex-col mt-8">
                        <div className="flex items-center border-b border-gray-200 pb-8">
                            <div className="flex flex-col">
                                <h2 className="font-medium text-2xl">
                                    Reviews
                                </h2>
                                <p className="mt-1 text-gray-600">
                                    If you have purchased this product, please
                                    leave a review to help others. Thank you!
                                </p>
                            </div>
                            <button
                                className={
                                    "ml-auto text-white px-4 py-4 rounded-md " +
                                    (canReview
                                        ? " bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 cursor-pointer"
                                        : " bg-gray-300 cursor-not-allowed")
                                }
                                onClick={handleReviewModalOpen}
                            >
                                Write a Review
                            </button>
                        </div>
                        {reviews.length ? (
                            <div className="flex flex-col items-center">
                                {reviews.map((review) => (
                                    <div
                                        className="flex w-full max-w-[700px] mt-8"
                                        key={review.review_id}
                                    >
                                        <div className="bg-gray-400 shrink-0 rounded-full h-12 w-12 flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="white"
                                                className="w-8 h-8"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-4 w-full flex flex-col border-b pb-8 border-gray-300">
                                            <div className="font-medium">
                                                {review.firstname}{" "}
                                                {review.lastname}
                                            </div>
                                            <div className="text-gray-600">
                                                {new Date(
                                                    review.created_at
                                                ).toDateString()}
                                            </div>
                                            <div className="flex my-2">
                                                {Array.from({ length: 5 }).map(
                                                    (_, i) => (
                                                        <svg
                                                            key={i}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            className={
                                                                (i <
                                                                review.rating
                                                                    ? "fill-yellow-400 stroke-yellow-400"
                                                                    : "stroke-gray-500 fill-gray-500") +
                                                                " w-6 h-6"
                                                            }
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                                            />
                                                        </svg>
                                                    )
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                {review.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                No reviews yet
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Product
