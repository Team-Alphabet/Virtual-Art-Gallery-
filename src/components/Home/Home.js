import React, { useEffect } from "react";
// import Post from "../Post/Post";
import "./Home.css";
import User from "../User/User";
import Post from "../Post/Post";
import { useDispatch, useSelector } from "react-redux";
// import { getFollowingPosts } from "../../Action-creators/User";
import { Typography } from "@mui/material";
import { getSortedPosts } from "../../Action-creators/Post";
import { getAllUserProfiles } from "../../Action-creators/User";

// import { Typography } from "@mui/material";
// import { useAlert } from "react-alert";

const Home = () => {
  const dispatch = useDispatch();
  const {postsloading,posts,postserror} = useSelector((state) => state.homePosts);
  const {usersloading, users, userserror} = useSelector((state) => state.allUsers);
    // const {postserror: likeError, message} = useSelector((state) => state.likeStatus);
  


  useEffect(() => {
    dispatch(getSortedPosts())
    dispatch(getAllUserProfiles())
  }, [])

  // useEffect(() => {
  //   if(likeError){
  //     alert(postserror)
  //     dispatch({
  //       type: 'clearErrors'
  //     })
  //   }
  //   if(message) {
  //     alert(message)
  //     dispatch({
  //       type: 'clearMsgs'
  //     })
  //   }
  // }, [alert, likeError, message])


  // console.log(posts)

  return (
    <>
     {
      postsloading===true || usersloading=== true ? (<>Loading...</>) : 
      (
        <div className="home">
        <div className="homeleft">
          {
            posts && posts.length <= 0 ? (<Typography>No posts yet.</Typography>):
            posts.map((post) =>
              (
                <Post
                key={post._id}
                postId={post._id}
                postImage={post.image.url}
                caption={post.caption}
                // ownerImage={post.owner.profilePic.url}
                ownerName={post.owner.userName}
                ownerEmail={post.owner.email}
                likes={post.likes}
                comments={post.comments}
                isForSale={post.buyFlag}
                price={post.price}
                isFeed={true}
              />
              )
            )
     
          }
         
        </div>
        <div className="homeright">
          {
            users && users.length > 0 ? 
            users.map((user) => 
            (
              <User 
              key={user._id}
              userId={user._id} 
              name={user.userName} 
              // profilePic={user.profilePic.url} 
              />
            )) :
            (<Typography>No users yet.</Typography>)
          }
        </div>
      </div>
      )
    }
    </>
    
  );
};

export default Home;