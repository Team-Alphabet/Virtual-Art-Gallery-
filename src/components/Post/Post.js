import { Avatar, Button, Typography, Dialog } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import { addNewComment, getLikeUnlikeStatus, getSortedPosts } from "../../Action-creators/Post";
import User from "../User/User";
import CommentCard from '../CommentCard/CommentCard'
import { green } from "@mui/material/colors";


const Post = ({
  postId,
  caption,
  postImage,
  likes,
  comments,
  ownerImage,
  ownerName,
  ownerEmail,
  ownerId,
  price,
  isForSale = false,
  isFeed = false,
  isDelete = false,
  isAccount = false,
}) => {

  const [liked, setliked] = useState(false)
  const [likesUser, setLikesUser] = useState(false)
  const [commentToggle, setCommentToggle] = useState(false)
  const [commentValue, setCommentValue] = useState("")
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state.user)

  const handleLikes = async () => {
    setliked(!liked);

    // backend status
    await dispatch(getLikeUnlikeStatus(postId));
    dispatch(getSortedPosts());
    
  }

  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(addNewComment(postId,commentValue));
    dispatch(getSortedPosts());
    
  }

try {
  useEffect(() => {
    const userHasLiked = likes.some(like => like._id === user._id);
    setliked(userHasLiked);
  }, [likes, user._id]);
  
} catch (error) {
  console.log(error.message)
}
 
  
  



  return (
    <div className="post">
      <div className="postHeader">
        {
          isAccount ? 
          (
            <Button>
              <MoreVert />
            </Button>
          ):
          null
        }

        {
          isForSale ?
          (
            <Typography 
            style={{background: '#adcbda', borderRadius: 20, padding: 5, color: '#22a2e3'}}
            >
              For Sale:  <span style={{color: '#e3e022'}}>${ price }</span> </Typography>
          ):
          null
        }
      </div>

      <img src={postImage} alt="Post" />

      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{
            height: "3vmax",
            width: "3vmax",
          }}
        />

        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>

        <Typography
          fontWeight={100}
          color="rgba(0, 0, 0, 0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>

      <button
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "1vmax 2vmax",
          display: "flex",
          justifyContent: "space-between"
        }}
        onClick={() => setLikesUser(!likesUser)}
        disabled={likes.length === 0 ? true : false}
      >
        {/* <Favorite style={{color:"red"}}/> */}
        <Typography>{likes.length} Likes</Typography>
      </button>

      <div className="postFooter">
        {
          isAccount || isFeed ?
            (
              <>
                <Button onClick={handleLikes}>
                  {liked ? <Favorite style={{ color: "red" }} /> : <Favorite />}
                </Button>

                <Button onClick={() => setCommentToggle(!commentToggle)}>
                  <ChatBubbleOutline />
                </Button>

                {isDelete ? (
                  <Button>
                    <DeleteOutline />
                  </Button>
                ) : null}

                {isForSale && isFeed ? (
                  <Link to={ownerEmail}>
                   <Button style={{color: '#DAF7A6', backgroundColor: '#FFC300'}}>
                    <Typography>Contact</Typography>
                  </Button>
                  </Link>
                ): null}
              </>
            )
            :
            (
              <Link to={`/post/${postId}`}>
              <Typography fontWeight={700}>See post</Typography>
              </Link>
            )
        }

      </div>

      <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className="DialogBox">
          <Typography variant="h4">Liked By</Typography>

          {likes.map((like) => (
            <User
              key={like._id}
              userId={like._id}
              name={like.userName}
              // avatar={like.avatar.url}
            />
          ))}
        </div>
      </Dialog>

    <Dialog
        open={commentToggle}
        onClose={() => setCommentToggle(!commentToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Comments</Typography>

          <form className="commentForm" >
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="Comment Here..."
              required
            />

            <Button type="submit" variant="contained" onClick={addCommentHandler}>
              Add
            </Button>
          </form>

          {comments.length > 0 ? (
            comments.map((item) => (
              <CommentCard
                userId={item.user._id}
                // avatar={item.user.avatar.url}
                comment={item.comment}
                commentId={item._id}
                key={item._id}
                postId={postId}
                userName={item.user.userName}
                isAccount={isAccount}
              />
            ))
          ) : (
            <Typography>No comments Yet</Typography> 
          )}
        </div>
      </Dialog>

       {/*<Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Update Caption</Typography>

          <form className="commentForm" onSubmit={updateCaptionHandler}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption Here..."
              required
            />

            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>
        </div>
      </Dialog>*/}
    </div>
  );
};

export default Post;