import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AdminProducts from "../routes/AdminProducts.jsx"
import AdminOrders from "../routes/AdminOrders.jsx"
import Products from "../routes/Products.jsx"
import Checkout from "../routes/Checkout.jsx"
import Product from "../routes/Product.jsx"
import useAuth from "../hooks/useAuth.js"
import Login from "../routes/Login.jsx"
import Order from "../routes/Order.jsx"
import Cart from "../routes/Cart.jsx"
import Sidebar from "./Sidebar.jsx"
import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"

const MainLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto min-h-[90vh] max-w-7xl px-2 sm:px-6 lg:px-8">
                {children}
            </div>
            <Footer />
        </>
    )
}

const AdminLayout = ({ children }) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) return null

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full">
                <div className="flex p-4 border-b-2 bg-gray-800 border-gray-600">
                    <button className="ml-auto bg-red-500 text-white px-4 py-2 rounded-md">
                        Sign out
                    </button>
                </div>
                <div
                    className="w-full bg-gray-100"
                    style={{ height: "calc(100% - 74px)" }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

const MinimalLayout = ({ children }) => (
    <div className="w-full min-h-[100vh] px-2 bg-gray-100">
        <div className="container mx-auto sm:px-6 lg:px-8 px-2">{children}</div>
    </div>
)

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout>Hello</MainLayout>} />
                <Route
                    path="/products"
                    element={
                        <MainLayout>
                            <Products />
                        </MainLayout>
                    }
                />
                <Route
                    path="/product/:id"
                    element={
                        <MainLayout>
                            <Product />
                        </MainLayout>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <MainLayout>
                            <Cart />
                        </MainLayout>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <MainLayout>
                            <Checkout />
                        </MainLayout>
                    }
                />
                <Route
                    path="/order/:id"
                    element={
                        <MainLayout>
                            <Order />
                        </MainLayout>
                    }
                />
                <Route
                    path="*"
                    element={
                        <MinimalLayout>
                            <div>Not Found</div>
                        </MinimalLayout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <MinimalLayout>
                            <Login />
                        </MinimalLayout>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AdminLayout>
                            <AdminOrders />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/products"
                    element={
                        <AdminLayout>
                            <AdminProducts />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/orders"
                    element={
                        <AdminLayout>
                            <AdminOrders />
                        </AdminLayout>
                    }
                />
            </Routes>
        </Router>
    )
}

export default App
