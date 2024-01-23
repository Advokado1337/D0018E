import React from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Products from "./Products.jsx"
import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <Routes>
                    <Route path="/" element={<div>Hello</div>} />
                    <Route path="/products" element={<Products />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    )
}

export default App
