const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWTSECRET;
const User = require('../models/User');
const fetchUser = require('../middlewares/auth');
const Post = require('../models/Post');
const crypto = require('crypto');
const sentEmail = require('../middlewares/email');
const cloudinary = require('cloudinary');

// new user registration
router.post('/signup',
    [body('email').isEmail().withMessage('Please entre a valid e-mail address'),
    body('userName').isLength({ min: 2 }).withMessage('Please entre a valid user name.'),
    body('password').isLength({ min: 5 }).withMessage('Password should be of atleast 5 characters')],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array()[0].msg });
        }

        try {
            const { userName, email, password, profilePic } = req.body;
            let user = await User.findOne({ email: email });
            if (user) {
                console.log(user)
                return res.status(400).json({ place: 'registration', error: "User in this email already exists." });
            }

            // Password Hash Genaration
            const salt = await bcrypt.genSalt(10);
            const secured_pass = await bcrypt.hash(password, salt);

            // user with profile pic
            if (profilePic) {
                const myCloud = await cloudinary.v2.uploader.upload(req.body.profilePic, {
                    folder: "ArtgalleryProfiles"
                });

                user = {
                    userName: userName,
                    profilePic: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    },
                    email: email,
                    password: secured_pass
                };
            }

            // user without profile pic
            else {
                user = {
                    userName: userName,
                    profilePic: {
                        public_id: null,
                        url: null
                    },
                    email: email,
                    password: secured_pass
                };
            }


            const newUser = await User.create(user)
            res.status(200).json(newUser);

        } catch (error) {
            res.status(500).json({ place: "sign up", error: "Internal server error! Please try again later.", err: error.message });
        }

    }
);

// User verification and logging in
router.post('/login',
    [body("email", "Invalid e-mail address").isEmail()],
    async (req, res) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array()[0].msg });
        }

        try {
            const { email, password } = req.body;

            let user = await User.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ error: "Invalid credentials! User in this email doesn't exists" });
            }

            // Matching requested password with stored hash
            let isValidPass = await bcrypt.compare(password, user.password);
            if (!isValidPass) {
                return res.status(404).json({ error: "Invalid credentials!" });
            }

            const PAYLOAD = {
                _id: user.id
            }

            const option = {
                maxAge: 90 * 24 * 60 * 60 * 60 * 1000,
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production", // make sure this is true in production
                // sameSite: "None", // required for cross-site cookies

            }

            const token = jwt.sign(PAYLOAD, jwtsecret);
            return res.status(200).cookie("token", token, option).json({ user: user, token: token });


        } catch (error) {
            res.status(500).json({ place: "login", error: "Internal server error! Please try again later.", err: error.message });
        }

    }
);

// user following
router.get('/follow/:_id', fetchUser, async (req, res) => {
    try {
        const toUser = await User.findById(req.params._id);
        const fromUser = await User.findById(req.user._id);

        if (!toUser) {
            return res.status(404).json({ error: "User is not found." });
        }

        if (toUser.followers.includes(fromUser._id)) {
            const toIndx = toUser.followers.indexOf(fromUser._id);
            toUser.followers.splice(toIndx, 1);
            await toUser.save();

            const fromIndx = fromUser.following.indexOf(toUser._id);
            fromUser.following.splice(fromIndx, 1);
            await fromUser.save();
            return res.status(200).json({ flag: 'Unfollow', following: toUser, followedBy: fromUser });
        }


        toUser.followers.push(req.user._id);
        await toUser.save();
        fromUser.following.push(req.params._id);
        await fromUser.save();

        res.status(200).json({ flag: "Follow", following: toUser, followedBy: fromUser });
    } catch (error) {
        res.status(500).json({ place: "fllow", error: "Internal server error! Please try again later.", err: error.message });
    }
});

// log out
router.get('/logout', async (req, res) => {
    try {
        const option = {
            httpOnly: true
        };
        res.status(200).clearCookie("token", option).json({ success: "Succesfully logged out." });
    } catch (error) {
        res.status(500).json({ place: "logout", error: "Internal server error! Please try again later.", err: error.message });
    }
});

// password change
router.get('/changepass', fetchUser,
    body('newPass').isLength({ min: 5 }).withMessage('Password should be of atleast 5 characters'),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array()[0].msg });
        }

        try {
            const user = await User.findById(req.user._id);
            const { oldPass, newPass } = req.body;
            const isValidPass = await bcrypt.compare(oldPass, user.password);
            if (!isValidPass) {
                return res.status(401).json({ error: "Authentication fault: Please entre valid password." })
            }

            const newSalt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(newPass, newSalt);
            user.password = newHash;
            await user.save();
            res.status(200).json({ success: true, userWithNewPass: user });

        } catch (error) {
            res.status(500).json({ place: "password change", error: "Internal server error! Please try again later.", err: error.message });
        }

    }
);

// forgot password
router.get('/forgotpass', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: "User in this email does not exist." });
        }

        // get reset password token
        const resetPassToken = crypto.randomBytes(20).toString('hex');
        user.resetPassTokenHash = crypto.createHash("sha256").update(resetPassToken).digest("hex");
        user.resetPassValidation = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        console.log(resetPassToken);

        // url of the token
        const tokenUrl = `${req.protocol}://${req.hostname}/fogotPassword?/password/reset/${resetPassToken}`;

        // sending mail
        const message = `Reset your password by clicking the following link: \n\n${tokenUrl}`;
        try {
            await sentEmail({ to: user.email, subject: "Reset password", text: message });
            res.status(200).json({ flag: "Email sent successfully" });
            console.log(tokenUrl);
        } catch (error) {
            user.resetPassTokenHash = undefined;
            user.resetPassValidation = undefined;
            await user.save();
            return res.status(400).json({ error: "Email not sent.", err: error.message })
        }

    } catch (error) {
        res.status(500).json({ place: "password reset", error: "Internal server error! Please try again later.", err: error.message });
    }
})



// update profile
router.get('/updateprofile', fetchUser,
    [body('newEmail').isEmail().withMessage('Please entre a valid e-mail address'),
    body('newUserName').isLength({ min: 2 }).withMessage('Please entre a valid user name.')],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array()[0].msg });
        }

        try {

            const { newEmail, newUserName, newProfilePic } = req.body;
            const user = await User.findById(req.user._id);
            if (newEmail) {
                user.email = newEmail;
            }

            if (newUserName) {
                user.userName = newUserName;
            }

            if (newProfilePic) {
                const myCloud = await cloudinary.v2.uploader.upload(req.body.newProfilePic, {
                    folder: "ArtgalleryProfiles"
                });
                user.profilePic = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }

            await user.save();
            res.status(200).json({ success: true, user })
        } catch (error) {
            res.status(500).json({ place: "profile update", error: "Internal server error! Please try again later.", err: error.message });
        }
    }
);


// delete profile
router.delete('/deleteprofile', fetchUser, async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        // posts delete
        const userPosts = user.posts;
        console.log(userPosts);
        let deletedPost = [];
        for (i = 0; i < userPosts.length; i++) {
            let post = await Post.findByIdAndDelete(userPosts[i]);
            deletedPost.push(post)
        }

        // delete the user from the following's follower's details
        const userFollowings = user.following;
        for (i = 0; i < userFollowings.length; i++) {
            let following = await User.findById(userFollowings[i]);
            let indx = following.followers.indexOf(user._id);
            following.followers.splice(indx, 1);
            await following.save();
        }

        // delete the user from the follower's following's details
        const userFollowers = user.followers;
        for (i = 0; i < userFollowers.length; i++) {
            let follower = await User.findById(userFollowers[i]);
            let indx = follower.following.indexOf(user._id);
            follower.following.splice(indx, 1);
            await follower.save();
        }


        // user delete
        const deletedProfile = await User.findByIdAndDelete(req.user._id);

        const option = {
            httpOnly: true
        };
        res.status(200).clearCookie("token", option).json({ deletedProfile, deletedPost: deletedPost });
    } catch (error) {
        res.status(500).json({ place: "profile delete", error: "Internal server error! Please try again later.", err: error.message });
    }
});

// user profile details fetching
router.get('/getuserprofile/:_id', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.params._id).populate('posts').select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ place: "profile get", error: "Internal server error! Please try again later.", err: error.message });
    }
});

// fetch own profile
router.get('/getownprofile', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('posts').select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ place: "profile get", error: "Internal server error! Please try again later.", err: error.message });
    }
});


// fetch all users
router.get('/getallprofiles', fetchUser, async (req, res) => {
    try {
        const user = await User.find({}).populate('posts').select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ place: "profile get", error: "Internal server error! Please try again later.", err: error.message });
    }
});


module.exports = router;