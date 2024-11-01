const User = require('../Models/User')
const jwt = require("jsonwebtoken")

exports.isAuthenticated = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)

        if (!token) {
            return res.status(401).json({ message: 'Login first to access this resource' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id);

        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Something wrong with authentication',
        })
    }
};

exports.isAuthorized = (...roles) => {

    return (req, res, next) => {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: `You are not allowed to acccess or do something on this resource` })
        }
        next()
    }
}