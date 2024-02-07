import useAuth from "../hooks/useAuth.js"
import React, { useState } from "react"

const Login = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const { authenticated } = useAuth()

    if (authenticated) return null

    return (
        <div className="flex w-full h-[100vh] items-center justify-center">
            <div className="rounded-md w-[500px] bg-white p-8">
                <h1 className="text-3xl font-semibold">Login</h1>
                <p className="text-gray-600">
                    Enter your administrator credentials
                </p>
                <form
                    method="POST"
                    action="/api/login"
                    className="mt-4 flex flex-col w-full"
                >
                    <div className="flex flex-col w-full">
                        <label className="font-semibold">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                            type="text"
                            name="username"
                            className="border-2 mt-2 border-gray-200 bg-gray-100 outline-none rounded-md p-2 hover:ring-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex flex-col w-full mt-8">
                        <label className="font-semibold">Password</label>
                        <div className="border-2 mt-2 flex border-gray-200 bg-gray-100 rounded-md p-2 hover:ring-2 focus-within:ring-2 focus-within:ring-indigo-500">
                            <input
                                type={passwordVisibility ? "text" : "password"}
                                value={password}
                                name="password"
                                required
                                className="outline-none bg-gray-100 w-full"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordVisibility ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={() => setPasswordVisibility(false)}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={() => setPasswordVisibility(true)}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full">
                        <button
                            className="ml-auto bg-indigo-500 text-white px-4 py-2 rounded-md mt-8 hover:bg-indigo-600 active:bg-indigo-700"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
