import { createRoot } from "react-dom/client"
import App from "./components/App.jsx"
import "./styles/index.css"
import React from "react"

const root = createRoot(document.getElementById("root"))
root.render(<App />)
