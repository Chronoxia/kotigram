function checkAuth(req, res, next) {
    if (req.userId) {
        next()
    } else {
        res.status(403).send({ message: 'No access to this page' })
    }
}

module.exports = checkAuth;