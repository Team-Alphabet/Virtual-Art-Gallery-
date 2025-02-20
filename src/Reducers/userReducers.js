import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  usersloading: true,
  isAuthenticated : false,
  posts: [],
  newPost: []
};

export const userReducers = createReducer(initialState, (builder) => {
  builder
  // Login reducers
    .addCase('loginReq', (state) => {
      state.usersloading = true;
    })
    .addCase('loginSucc', (state, action) => {
      state.usersloading = false;
      state.user = action.payload;
      state.isAuthenticated = true
    })
    .addCase('loginFail', (state, action) => {
      state.usersloading = false;
      state.usererror = action.payload;
      state.isAuthenticated = false
    })

    // Register reducers
    .addCase('registerReq', (state) => {
      state.usersloading = true;
    })
    .addCase('registerSucc', (state, action) => {
      state.usersloading = false;
      state.user = action.payload;
    })
    .addCase('registerFail', (state, action) => {
      state.usersloading = false;
      state.usererror = action.payload;
    })

    // User fetching reducers
    .addCase('loaduserReq', (state) => {
      state.usersloading = true;
    })
    .addCase('loaduserSucc', (state, action) => {
      state.usersloading = false;
      state.user = action.payload;
      state.isAuthenticated = true
    })
    .addCase('loaduserFail', (state, action) => {
      state.usersloading = false;
      state.usererror = action.payload;
      state.isAuthenticated = false
    })

    // Logout reducers
    .addCase('logoutReq', (state) => {
      state.usersloading = true;
    })
    .addCase('logoutSucc', (state, action) => {
      state.usersloading = false;
      state.user = action.payload;
      state.isAuthenticated = false
    })
    .addCase('logoutFail', (state, action) => {
      state.usersloading = false;
      state.usererror = action.payload;
      state.isAuthenticated = true
    })
    
    // Post creation reducers
    .addCase('postCReq', (state) => {
      state.usersloading = true;
    })
    .addCase('postCSucc', (state, action) => {
      state.usersloading = false;
      state.newPost = action.payload;
    })
    .addCase('postCFail', (state, action) => {
      state.usersloading = false;
      state.usererror = action.payload;
    })

    .addCase('clearErrors', (state, action) => {
      state.usersloading= false
      state.usererror = null
    });
});



export const postsOfFollowings = createReducer(initialState, (builder) => {
  builder
  .addCase('postsReq', (state, action) => {
    state.usersloading = true
  })
  .addCase('postsSucc', (state, action) => {
    state.usersloading= false
    state.posts = action.payload
  })
  .addCase('postsFail', (state, action) => {
    state.usersloading= false
    state.usererror = action.payload
  })
  .addCase('clearErrors', (state, action) => {
    state.usererror = null
  });
});



export const profilesOfAllUsers = createReducer(initialState, (builder) => {
  builder
  .addCase('usersReq', (state) => {
    state.usersloading= true
  })
  .addCase('usersSucc', (state, action) => {
    state.usersloading=false
    state.users = action.payload
  })
  .addCase('usersFail', (state, action) => {
    state.usersloading=false
    state.usererror=action.payload
  })
  .addCase('clearErrors', (state, action) => {
    state.usersloading= false
    state.usererror = null
  });

})
