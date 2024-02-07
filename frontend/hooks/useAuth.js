import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"

const useAuth = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const token = Cookies.get("admin_token")

        if (token) {
            if (location.pathname === "/login") {
                navigate("/admin")
            }

            setUser(token)
        } else {
            if (location.pathname !== "/login") {
                navigate("/login")
            }
        }
    }, [])

    return { user, isAuthenticated: user !== null }
}

export default useAuth
