export const getSortedPosts = () => async (dispatch) => {
    try {
        // before req sent
        dispatch({
            type: 'sortedPostReq'
        });

        // req sent
        const API_URL = 'http://localhost:5000/api/post/sortedPosts'
        const response = await fetch(API_URL, {
            method: 'GET',
            credentials: 'include'
        });
        const json = await response.json();
        console.log(json)

        // after getting response
        if(response.status === 200){
            dispatch({
                type: 'sortedPostsSucc',
                payload: json
            })
        }

        else{
            dispatch({
                type: 'sortedPostsFail',
                payload: json.error
            })
        }

    } catch (error) {
         dispatch({
                type: 'sortedPostsFail',
                payload: error.message
        });
    }
}


export const getLikeUnlikeStatus = (id) => async(dispatch) => {
    try {
        
        // before req sent
        dispatch({
            type: 'likeReq',
        })

        // req sent
        const API_URL= `http://localhost:5000/api/post/likeUnlike/${id}`
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const json = await response.json();
        console.log(json);

        
        // after getting response
        if(response.status === 200){
            dispatch({
                type: 'likeSucc',
                payload: json.msg
            })
        }

        else{
            dispatch({
                type: 'likeFail',
                payload: json.error
            })
        }
    } catch (error) {
        dispatch({
            type: 'likeFail',
            payload: error.message
        })
    }
}

export const addNewComment = (id,comment) => async(dispatch) => {
    try {
        
        // before req sent
        dispatch({
            type: 'addCommentReq',
        })

        // req sent
        const API_URL= `http://localhost:5000/api/post/addcomment/${id}`
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({comment: comment})
        });
        const json = await response.json();
        console.log(json);

        
        // after getting response
        if(response.status === 200){
            dispatch({
                type: 'addCommentSucc',
                payload: json.msg
            })
        }

        else{
            dispatch({
                type: 'addCommentFail',
                payload: json.error
            })
        }
    } catch (error) {
        dispatch({
            type: 'addCommentFail',
            payload: error.message
        })
    }
}


export const delComment = (id,commentId) => async(dispatch) => {
    try {
        
        // before req sent
        dispatch({
            type: 'delCommentReq',
        })

        // req sent
        const API_URL= `http://localhost:5000/api/post/deletecomment/${id}`
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({commentId: commentId})
        });
        const json = await response.json();
        console.log(json);

        
        // after getting response
        if(response.status === 200){
            dispatch({
                type: 'delCommentSucc',
                payload: json.msg
            })
        }

        else{
            dispatch({
                type: 'delCommentFail',
                payload: json.error
            })
        }
    } catch (error) {
        dispatch({
            type: 'delCommentFail',
            payload: error.message
        })
    }
}


export const createNewPost = (image,caption,price) => async(dispatch) => {
    try {
        
        // before req sent
        dispatch({
            type: 'postCReq',
        })

        // req sent
        const API_URL= 'http://localhost:5000/api/post/createpost'
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({image: image, caption: caption, price: price})
        });
        const json = await response.json();
        console.log(json);

        
        // after getting response
        if(response.status === 200){
            dispatch({
                type: 'postCSucc',
                payload: json.msg
            })
        }

        else{
            dispatch({
                type: 'postCFail',
                payload: json.error
            })
        }
    } catch (error) {
        dispatch({
            type: 'postCFail',
            payload: error.message
        })
    }
}




