import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    entry: "./frontend/index.js",
    watch: true,
    mode: "development",
    devtool: "eval-source-map",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "index.js",
    },
    stats: "minimal",
    module: {
        rules: [
            {
                test: /\.jsx?$/, // to process both .js and .jsx files
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"], // add .jsx here
    },
}
