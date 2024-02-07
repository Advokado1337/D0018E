import { useState, useEffect } from "react"
import Cookies from "js-cookie"

const useAuth = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = Cookies.get("admin_token")

        if (token) {
            setUser(token)
        }
    }, [])

    return { user, isAuthenticated: user !== null }
}

export default useAuth
