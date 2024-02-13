import { Link, useLocation } from "react-router-dom"
import React from "react"

const Sidebar = () => {
    const { pathname } = useLocation()

    return (
        <div className="shrink-0 w-[300px] min-h-[100vh] bg-gray-800">
            <div className="h-[74px] p-4 w-full flex items-center">
                <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                />
            </div>
            <div
                style={{ height: "calc(100% - 74px" }}
                className="border-r-2 border-gray-600"
            >
                <Link
                    to="/admin/products"
                    className={
                        "rounded-md text-gray-400 flex items-center mx-4 p-2 cursor-pointer hover:bg-gray-700 hover:text-white hover:stroke-white stroke-gray-400" +
                        (pathname === "/admin/products"
                            ? " bg-gray-700 text-white"
                            : "")
                    }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        className="h-8 w-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                        ></path>
                    </svg>
                    <div className="ml-4">Products</div>
                </Link>
                <Link
                    to="/admin/orders"
                    className={
                        "rounded-md text-gray-400 flex items-center mt-4 mx-4 p-2 cursor-pointer hover:bg-gray-700 hover:text-white hover:stroke-white stroke-gray-400" +
                        (pathname === "/admin/orders"
                            ? " bg-gray-700 text-white"
                            : "")
                    }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        className="h-8 w-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                        ></path>
                    </svg>
                    <div className="ml-4">Orders</div>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar
