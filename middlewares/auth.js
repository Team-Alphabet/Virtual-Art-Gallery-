const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWTSECRET;

const fetchUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        // console.log(token)
        
        if (!token) {
            return res.status(404).json({ error: "Please log in first." });
        }
        try {
            const userDc = jwt.verify(token, jwtsecret);
            req.user = await User.findById(userDc._id);
            next();
        } catch (error) {
            res.status(500).json({place:"fetchUser", error: "Invalid user! Please try with valid credentials.", err : error.message});

        }

    } catch (error) {
        res.status(500).json({place:"fetchUser", error: "Internal server error! Please try again later.", err : error.message});
    }
}

module.exports = fetchUser;