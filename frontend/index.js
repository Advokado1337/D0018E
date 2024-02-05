import { createRoot } from "react-dom/client"
import App from "./components/App.jsx"
import "./styles/index.css"
import React from "react"

String.prototype.truncate = function (maxLength) {
    if (this.length > maxLength) {
        return this.slice(0, maxLength - 3) + "..."
    } else {
        return this.toString()
    }
}

const root = createRoot(document.getElementById("root"))
root.render(<App />)
