import * as url from "url"
import path from "path"
import express from "express"

const PORT = 3000

const app = express()

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
const options = { root: path.join(__dirname, "../public") }

app.get("/", (req, res) => {
    res.sendFile("index.html", options)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
