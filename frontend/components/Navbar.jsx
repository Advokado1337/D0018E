import { Link, useLocation } from "react-router-dom"
import React from "react"

const Navbar = () => {
    const { pathname } = useLocation()
    const activeRouteClasses = (route) => {
        if (route === pathname) {
            return "bg-gray-900 text-white"
        }
        return "text-gray-300 hover:bg-gray-700 hover:text-white"
    }

    return (
        <nav className="bg-gray-800 h-[74px] flex items-center">
            <div className="max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link
                                    to="/"
                                    className={`${activeRouteClasses(
                                        "/"
                                    )} rounded-md px-3 py-2 text-sm font-medium`}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/products"
                                    className={`${activeRouteClasses(
                                        "/products"
                                    )} rounded-md px-3 py-2 text-sm font-medium`}
                                >
                                    Products
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <Link className="hover:cursor-pointer" to="/cart">
                            <svg
                                className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                            </svg>
                        </Link>
                        <div className="text-gray-400 ml-2">
                            0<span className="text-green-400 ml-1">$</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
