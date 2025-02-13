const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const fetchUser = require('../middlewares/auth');
const cloudinary = require('cloudinary');

// New post creation 
router.post('/createpost', fetchUser,
    [body('image').exists().withMessage("Plaese upload an image to create this post.")],
    async (req, res) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array()[0].msg });
        }

        try {
            // const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            //     folder: "ArtgalleryPosts"
            // })

            // console.log(myCloud);
            if (!req.user._id) {
                return res.status(404).json({ place: 'createpost', error: "Authentication fault: Please try with valid credentials." });
            }

            const user = await User.findById(req.user._id);
            let newPostDetails = []
            if (req.body.price) {
                newPostDetails = {
                    caption: req.body.caption,
                    image: {
                        public_id: 'myCloud.public_id',
                        url: 'myCloud.secure_url'
                    },
                    owner: req.user._id,
                    price: req.body.price,
                    buyFlag: true
                };
            }
            else {
                newPostDetails = {
                    caption: req.body.caption,
                    image: {
                        public_id: 'myCloud.public_id',
                        url: 'myCloud.secure_url'
                    },
                    owner: req.user._id,
                    buyFlag: false
                };
            }

            const newPost = await Post.create(newPostDetails);
            user.posts.push(newPost._id);
            await user.save();
            res.status(200).json(newPost);
        } catch (error) {
            res.status(500).json({ place: "post creation", error: "Internal server error! Please try again later.", err: error.message });

        }
    }
);

// delete post
router.delete('/deletepost/:_id', fetchUser, async (req, res) => {
    try {
        const targetPost = await Post.findById(req.params._id);
        const userId = req.user._id;

        if (!targetPost) {
            return res.status(404).json({ error: "Post not found." });
        }
        if (targetPost.owner.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Authentication Fault: You're not eligible to delete this post." });
        }

        // deleting the post from website database
        const deletepost = await Post.findByIdAndDelete(req.params._id);
        res.status(200).json({ success: "Deleted", post: deletepost });

        // deleting the post from the user storage
        const user = await User.findById(userId);
        const indx = user.posts.indexOf(req.params._id);
        user.posts.splice(indx, 1);
        await user.save();

    } catch (error) {
        res.status(500).json({ place: "deleting post", error: "Internal server error! Please try again later.", err: error.message });
    }
})


// likes save
router.get('/likeUnlike/:_id', fetchUser, async (req, res) => {
    try {
        const post = await Post.findById(req.params._id);
        console.log(post)
        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }

        // if the post is already liked by the user, it will be disliked
        if (post.likes.includes(req.user._id)) {
            const indx = post.likes.indexOf(req.user._id);
            post.likes.splice(indx, 1);
            await post.save();
            return res.status(200).json({ post: post, msg: "Successfully Unliked." });
        }

        else {
            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({ post: post, msg: "Successfully Liked." });
        }
    } catch (error) {
        res.status(500).json({ place: "like and unlike", error: "Internal server error! Please try again later.", err: error.message });

    }
});


// fetching posts of following users
router.get('/feedposts', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const followingUsers = user.following;
        // let feedposts = [];
        // for(i = 0; i < followingUsers.length; i++){
        // let fuser = await User.findById(followingUsers[i]);
        // let posts = fuser.posts;
        // feedposts.push(posts);
        // }

        const feedposts = await Post.find({
            owner: {
                $in: followingUsers
            }
        }).populate('owner', '-password').populate('likes', '-password').populate('comments.user', '-password');

        res.status(200).json({ followingUsers, feedposts });
    } catch (error) {
        res.status(500).json({ place: "feedposts", error: "Internal server error! Please try again later.", err: error.message });

    }
});


// update caption 
router.put('/update/:_id', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const post = await Post.findById(req.params._id);

        if (post.owner.toString() !== user._id.toString()) {
            return res.status(401).json({ error: "Authentication fault: You're not eligibile to update the post." });
        }

        const { caption } = req.body;
        if (caption) {
            post.caption = caption;
            await post.save();
        }

        res.status(200).json({ success: "Caption updated.", post })
    } catch (error) {
        res.status(500).json({ place: "feedposts", error: "Internal server error! Please try again later.", err: error.message });
    }
})


// comment addition
router.post('/addcomment/:_id', fetchUser,
    [body('comment').exists().withMessage("Please add a valid comment")],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array()[0].msg });
        }

        try {
            const user = await User.findById(req.user._id);
            const post = await Post.findById(req.params._id);

            if (!post) {
                return res.status(404).json({ error: "Post not found." })
            }

            let commentExistsId = -1;
            post.comments.forEach((item, index) => {
                if (item.user.toString() === user._id.toString()) {
                    return commentExistsId = index;
                }
            })

            console.log(commentExistsId);
            const { comment } = req.body;

            if (commentExistsId !== -1) {
                post.comments[commentExistsId].comment = comment;
                await post.save();
                return res.status(200).json({ flag: "Comment updated", comments: post.comments, newComment: post.comments[commentExistsId], })
            }
            const newComment = {
                user: user._id,
                comment: comment
            }

            post.comments.push(newComment);
            await post.save();
            res.status(201).json({ flag: "Comment added", comments: post.comments, newComment })
        } catch (error) {
            res.status(500).json({ place: "Comment", error: "Internal server error! Please try again later.", err: error.message });
        }

    }
);


// comment deletion
router.delete('/deletecomment/:_id', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const post = await Post.findById(req.params._id);

        if (!post) {
            return res.status(404).json({ error: "Post not found." })
        }

        if (post.owner.toString() === user._id.toString()) {

            if (req.body.commentId === undefined) {
                return res.status(400).json({ error: "Comment Id is required." });
            }
            post.comments.forEach((item, index) => {
                if (item._id.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(index, 1);
                }
            });
            await post.save();
            return res.status(200).json({ flag: "Selected comment has been deleted.", nowComment: post.comments });

        } else {
            let hasComment = false
            post.comments.forEach((item, index) => {
                if (item.user.toString() === user._id.toString()) {
                    post.comments.splice(index, 1);
                    hasComment = true;
                }
            });
            if (hasComment) {
                await post.save();
                return res.status(200).json({ flag: "Your comment has been deleted.", nowComment: post.comments });
            }
            else {
                return res.status(404).json({ error: "No comment found." })
            }
        }

    } catch (error) {
        res.status(500).json({ place: "CommentD", error: "Internal server error! Please try again later.", err: error.message });

    }
});

// fetching posts have sell option
router.get('/forsell', fetchUser, async (req, res) => {
    try {
        const sellPosts = await Post.find({ buyFlag: true }).populate('owner').select('-password');
        res.status(200).json(sellPosts);
    } catch (error) {
        res.status(500).json({ place: "Buy posts", error: "Internal server error! Please try again later.", err: error.message });
    }
})


// fetching post according to number of likes
router.get('/sortedposts', fetchUser, async (req, res) => {
    try {
        const sortedPosts = await Post.aggregate([
            {
                $project: {
                    owner: 1,                // Include the 'owner' field
                    image: 1,                // Include the 'image' field
                    caption: 1,              // Include the 'caption' field
                    date: 1,                 // Include the 'date' field
                    likesCount: { $size: "$likes" },  // Calculate and include the size of 'likes' array as 'likesCount'
                    likes: 1,                // Include the 'likes' field (if you still want to include the list of users who liked)
                    comments: 1,             // Include the 'comments' field
                    price: 1,                // Include the 'price' field
                    buyFlag: 1               // Include the 'buyFlag' field
                }
            },
            {
                $sort: { likesCount: -1 }
            }
        ]);
        const postsWithPopulatedLikesComments = await Post.populate(sortedPosts,
            [{
                path: 'likes',
                select: '-password'
            },
            {
                path: 'comments.user',
                select: '-password'
            },
            {
                path: 'owner',
                select: '-password'
            }]
        );


        res.status(200).json(postsWithPopulatedLikesComments);
    } catch (error) {
        res.status(500).json({ place: "Buy posts", error: "Internal server error! Please try again later.", err: error.message });
    }
})



module.exports = router;