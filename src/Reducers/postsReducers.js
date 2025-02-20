import { createReducer } from "@reduxjs/toolkit"

const initialState= {
    postsloading: true,
    posts: [],
    postserror: null,
    message: null
}

export const sortedPosts = createReducer(initialState, (builder) => {
    builder
    .addCase('sortedPostsReq', (state, action) => {
        state.postsloading= true
    })
    .addCase('sortedPostsSucc', (state, action) => {
        state.postsloading= false
        state.posts = action.payload
    })
    .addCase('sortedPostsFail', (state, action) => {
        state.postsloading=false
        state.postserror = action.payload
    })
    
});

export const likeUnlike = createReducer(initialState, (builder) => {
    builder
    // likeUnlike
    .addCase('likeReq', (state, action) => {
        state.postsloading= true
    })
    .addCase('likeSucc', (state, action) => {
        state.postsloading= false
        state.message = action.payload
    })
    .addCase('likeFail', (state, action) => {
        state.postsloading=false
        state.postserror = action.payload
    })

    .addCase('clearMsgs', (state, action) => {
        state.postsloading= false
        state.message = null
      })
    .addCase('clearErrors', (state, action) => {
        state.postsloading= false
        state.postserror = null
      });
    
})


export const postComment = createReducer(initialState, (builder) => {
    builder
    // comments add
    .addCase('addCommentReq', (state, action) => {
        state.postsloading= true
    })
    .addCase('addCommentSucc', (state, action) => {
        state.postsloading= false
        state.message = action.payload
    })
    .addCase('addCommentFail', (state, action) => {
        state.postsloading=false
        state.postserror = action.payload
    })

    // comments delete
    .addCase('delCommentReq', (state, action) => {
        state.postsloading= true
    })
    .addCase('delCommentSucc', (state, action) => {
        state.postsloading= false
        state.message = action.payload
    })
    .addCase('delCommentFail', (state, action) => {
        state.postsloading=false
        state.postserror = action.payload
    })

    .addCase('clearMsgs', (state, action) => {
        state.postsloading= false
        state.message = null
      })
    .addCase('clearErrors', (state, action) => {
        state.postsloading= false
        state.postserror = null
      });
    
})





