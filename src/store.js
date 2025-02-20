import { configureStore } from "@reduxjs/toolkit"
import { postsOfFollowings, profilesOfAllUsers, userReducers } from "./Reducers/userReducers";
import { likeUnlike, postComment, sortedPosts } from "./Reducers/postsReducers";

const store = configureStore({
    reducer: {
        user: userReducers,
        allUsers: profilesOfAllUsers,
        feedPosts: postsOfFollowings,
        homePosts: sortedPosts,
        likeStatus: likeUnlike,
        comments: postComment
    }
})

export default store;