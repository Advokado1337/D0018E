import React from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Navbar from "./Navbar.jsx"

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<div>Hello</div>} />
                <Route path="/products" element={<div>Test</div>} />
            </Routes>
        </Router>
    )
}

export default App
