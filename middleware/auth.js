const { User } = require('../models/User')

const auth = async(req, res, next) => {
    try {
        const token = req.cookies?.x_auth;
        if (!token) {
            return res.status(401).json({ isAuth: false, error: 'No token.'});
        }

        const user = await User.findByToken(token);
        if (!user) {
            return res.status(401).json({ isAuth: false, error: 'Invalid token'});
        }
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ isAuth:false, error: err.message});
    }
}

module.exports = { auth };