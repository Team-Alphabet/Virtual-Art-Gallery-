export const loginUser = (email, password) => async (dispatch) => {
        try {

            // Before req sent 
            dispatch({
                type: 'loginReq'
            });

            // req sent to certain api
            const API_URL = 'http://localhost:5000/api/user/login'
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password }),
                credentials: "include", 
            });
            const json = await response.json();
            // console.log(json);

            // After req sent
            if(response.status === 200) {
                dispatch({
                    type: 'loginSucc',
                    payload: response.user
                });
            }

            else{
                dispatch({
                    type: 'loginFail',
                    payload: json.error
                });
            }
            
        } catch (error) {
            dispatch({
                type: 'loginFail',
                payload: error.message
            });
        } 
}



export const loadUser = () => async (dispatch) => {
    try {

        // Before req sent 
        dispatch({
            type:'loaduserReq'
        });

        // req sent to certain api
        const API_URL = 'http://localhost:5000/api/user/getownprofile'
        const response = await fetch(API_URL, {
            method: 'GET',
            credentials: 'include'
        });
        const json = await response.json();
        // console.log(json);

        // After req sent
        if(response.status === 200){
            dispatch({
                type: 'loaduserSucc',
                payload: json
            });
        }
       
    } catch (error) {
        dispatch({
            type: 'loaduserFail',
            payload: error.message
        });

    } 
}


export const getFollowingPosts = () => async (dispatch) => {
    try {
        // before req sent
        dispatch({
            type: 'postReq'
        });

        // req sent
        const API_URL = 'http://localhost:5000/api/post/feedposts'
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const json = await response.json();
        let feedPosts = json.feedposts.reverse() 

        // after getting response
        if(response.status === 200){
            dispatch({
                type: 'postsSucc',
                payload: feedPosts
            })
        }

        else{
            dispatch({
                type: 'postsFail',
                payload: json.error
            })
        }

    } catch (error) {
         dispatch({
                type: 'postsFail',
                payload: error.message
        });
    }
}

export const getOwnPosts = () => async (dispatch) => {
    try {
        // before req sent
        dispatch({
            type: 'postReq'
        });

        // req sent
        const API_URL = 'http://localhost:5000/api/post/feedposts'
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const json = await response.json();
        let feedPosts = json.feedposts.reverse() 

        // after getting response
        if(response.status === 200){
            dispatch({
                type: 'postsSucc',
                payload: feedPosts
            })
        }

        else{
            dispatch({
                type: 'postsFail',
                payload: json.error
            })
        }

    } catch (error) {
         dispatch({
                type: 'postsFail',
                payload: error.message
        });
    }
}

export const getAllUserProfiles = () => async (dispatch) => {
    try {

        // Before req sent 
        dispatch({
            type:'usersReq'
        });

        // req sent to certain api
        const API_URL = 'http://localhost:5000/api/user/getallprofiles'
        const response = await fetch(API_URL, {
            method: 'GET',
            credentials: 'include'
        });
        const json = await response.json();
        const users = await json.reverse()
        // console.log(json);

        // After req sent
        if(response.status === 200){
            dispatch({
                type: 'usersSucc',
                payload: users
            });
        }
       
    } catch (error) {
        dispatch({
            type: 'usersFail',
            payload: error.message
        });

    } 
}


export const logoutUser = () => async (dispatch) => {
    try {

        // Before req sent 
        dispatch({
            type: 'logoutReq'
        });

        // req sent to certain api
        const API_URL = 'http://localhost:5000/api/user/logout'
        const response = await fetch(API_URL, {
            method: 'GET',
            credentials: "include", 
        });
        const json = await response.json();
        console.log(json);

        // After req sent
        if(response.status === 200) {
            dispatch({
                type: 'logoutSucc',
                payload: response.user
            });
        }

        else{
            dispatch({
                type: 'logoutFail',
                payload: json.error
            });
        }
        
    } catch (error) {
        dispatch({
            type: 'logoutFail',
            payload: error.message
        });
    } 
}