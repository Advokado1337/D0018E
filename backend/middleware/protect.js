export default (req, res, next) => {
    if (!req.signedCookies.admin_token) {
        return res.sendStatus(401)
    }
    next()
}
