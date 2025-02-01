const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const fetchUser = require('../middlewares/auth');
const Story = require('../models/Story');
const cloudinary= require('cloudinary');

// New story creation 
router.post('/createstory/text', fetchUser,
    [body('text', 'Story length must be atleast of 10 characters.').isLength({ min: 10 })],
    async (req, res) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array()[0].msg });
        }


        try {
            if (!req.user._id) {
                return res.status(404).json({ place: 'createstory', error: "Authentication fault: Please try with valid credentials." });
            }

            const user = await User.findById(req.user._id);
            const userStory = await Story.find({
                owner: {
                    $in: user._id
                }
            })
            console.log(userStory);
            if (userStory.length !== 0) {
                return res.status(200).json({ flag: "One story is already uploaded!", msg: "Only one story can be added at a time." });
            }

            console.log(user.stories.length)
            if (user.stories.length !== 0) {
                user.stories = [];
                await user.save();
            }
            console.log(user.stories.length)


            const { text } = req.body;
            const storyDtls = {
                owner: req.user._id,
                text: text
            };

            const newStory = await Story.create(storyDtls);
            user.stories.push(newStory._id);
            await user.save();

            res.status(201).json({ flag: "Story uploaded success!", newStory });

        } catch (error) {
            res.status(500).json({ place: "story creation", error: "Internal server error! Please try again later.", err: error.message });

        }
    }
);

router.post('/createstory/image', fetchUser,
    [body('image').exists().withMessage("Please upload an image first.")],
    async (req, res) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array()[0].msg });
        }

        try {
            const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
                folder: "ArtgalleryStories"
            });


            if (!req.user._id) {
                return res.status(404).json({ place: 'createstory', error: "Authentication fault: Please try with valid credentials." });
            }

            const user = await User.findById(req.user._id);
            const userStory = await Story.find({
                owner: {
                    $in: user._id
                }
            })
            console.log(userStory);
            if (userStory.length !== 0) {
                return res.status(200).json({ flag: "One story is already uploaded!", msg: "Only one story can be added at a time. Delete the previous one add new." });
            }

            if (user.stories.length !== 0) {
                user.stories = [];
                await user.save();
            }

            const storyDtls = {
                owner: req.user._id,
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                caption: req.body.caption
            };

            const newStory = await Story.create(storyDtls);
            user.stories.push(newStory._id);
            await user.save();

            res.status(201).json({ flag: "Story uploaded success!", newStory });
        } catch (error) {
            res.status(500).json({ place: "story creation", error: "Internal server error! Please try again later.", err: error.message });

        }
    }
);

// get user's story
router.get('/getstory', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const userStory = await Story.find({
            owner: {
                $in: user._id
            }
        })

        if (userStory.length === 0) {
            return res.status(200).json({ flag: "Story null", userStory })
        }

        res.status(200).json({ flag: "Story success", userStory });
    } catch (error) {
        res.status(500).json({ place: "story fetch", error: "Internal server error! Please try again later.", err: error.message });
    }
});


// get following's stories
router.get('/feedstories', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const followingUsers = user.following;

        const feedStories = await Post.find({
            owner: {
                $in: followingUsers
            }
        })

        res.status(200).json({ followingUsers, feedStories });
    } catch (error) {
        res.status(500).json({ place: "feedstories", error: "Internal server error! Please try again later.", err: error.message });

    }
});

// like unlike
router.get('/likeunlike/:_id', fetchUser, async (req, res) => {
    try {
        const story = await Story.findById(req.params._id);
        console.log(story)
        if (!story) {
            return res.status(404).json({ error: "Story not found." });
        }

        // if the story is already liked by the user, it will be disliked
        if (story.likes.includes(req.user._id)) {
            const indx = story.likes.indexOf(req.user._id);
            story.likes.splice(indx, 1);
            await story.save();
            return res.status(200).json({ story, msg: "Successfully Unliked." });
        }

        else {
            story.likes.push(req.user._id);
            await story.save();
            return res.status(200).json({ story, msg: "Successfully Liked." });
        }
    } catch (error) {
        res.status(500).json({ place: "like and unlike", error: "Internal server error! Please try again later.", err: error.message });

    }
});

// delete story
router.delete('/deletestory/:_id', fetchUser, async (req, res) => {
    try {
        const targetStory = await Story.findById(req.params._id);
        const userId = req.user._id;

        if (!targetStory) {
            return res.status(404).json({ error: "Story not found." });
        }
        if (targetStory.owner.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Authentication Fault: You're not eligible to delete this Story." });
        }

        // deleting the story from website database
        const deleteStory = await Story.findByIdAndDelete(req.params._id);
        res.status(200).json({ success: "Deleted", deleteStory });

        // deleting the story from the user storage
        const user = await User.findById(userId);
        const indx = user.stories.indexOf(req.params._id);
        user.stories.splice(indx, 1);
        await user.save();

    } catch (error) {
        res.status(500).json({ place: "deleting story", error: "Internal server error! Please try again later.", err: error.message });
    }
});

// views
router.get('/views/:_id', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const story = await Story.findById(req.params._id);
        if (!story) {
            return res.status(404).json({ msg: "Story not found." })
        }
        if(story.owner.toString() === user._id.toString()) {
            return res.status(200).json({ flag: "Owner" })
        }
        else if (!story.views.includes(user._id)) {
            story.views.push(user._id);
            await story.save();
            return res.status(200).json({ msg: "New view added.", story })
        }
        else {
            return res.status(401).json({ msg: 'Already viewed' });
        }
    } catch (error) {

        res.status(500).json({ place: "story views", error: "Internal server error! Please try again later.", err: error.message });
    }
});



module.exports = router;
