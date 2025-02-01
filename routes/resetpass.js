const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const crypto = require('crypto');


router.get('/reset/:token',
    [body('resetPass').isLength({ min : 5 }).withMessage("Password should be atleast of 5 characters.")],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array()[0].msg });
        }

        try {
            const token = req.params.token;
            console.log({token: token})
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            console.log({tokenHash: tokenHash})
            const user = await User.findOne({
                resetPassTokenHash: tokenHash,
                resetPassValidation: { $gt: Date.now() }
            });

            if(!user) {
                return res.status(401).json({ flag: "Token is not valid or expired." });
            }

            const newPassHash = await bcrypt.hash(req.body.resetPass, 10);
            user.password = newPassHash;
            console.log(newPassHash);
            user.resetPassTokenHash = undefined;
            user.resetPassValidation = undefined;
            await user.save();
            res.status(200).json({ flag: "Password has reset.", user});
            
        } catch (error) {
            res.status(500).json({ place: "password reset", error: "Internal server error! Please try again later.", err: error.message });
        }
    }
);

module.exports = router;