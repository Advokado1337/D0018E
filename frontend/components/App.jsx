import React from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Products from "./Products.jsx"
import Product from "./Product.jsx"
import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"
import Cart from "./Cart.jsx"

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto min-h-[90vh] max-w-7xl px-2 sm:px-6 lg:px-8">
                <Routes>
                    <Route path="/" element={<div>Hello</div>} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="*" element={<div>Not Found</div>} />
                </Routes>
            </div>
            <Footer />
        </Router>
    )
}

export default App
