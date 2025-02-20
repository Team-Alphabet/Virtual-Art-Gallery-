import { Button, Typography, Avatar } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import "./CommentCard.css";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { delComment, getSortedPosts } from "../../Action-creators/Post";
// import { deleteCommentOnPost } from "../../Actions/Post";
// import { getFollowingPosts, getMyPosts } from "../../Actions/User";

const CommentCard = ({
  userId,
  userName,
  profilePic,
  comment,
  commentId,
  postId,
  isAccount,
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  const dropComment = async () => {
    await dispatch(delComment(postId, commentId));
    dispatch(getSortedPosts());
  }


  return (
    <div className="commentUser" style={{margin: 20}}>
      <Link to={`/user/${userId}`} >
      <Avatar
        src={profilePic}
        alt="User"
        // sx={{
        //   height: "3vmax",
        //   width: "3vmax",
        // }}
        style={{marginRight: 10}}
        
      />
        <Typography style={{ minWidth: "6vmax", marginRight: 20}}>{userName}</Typography>
      </Link>
      <Typography>{comment}</Typography>

      {isAccount ? (
        <Button>
          <Delete onClick={dropComment}/>
        </Button>
      ) : userId === user._id ? (
        <Button>
          <Delete onClick={dropComment}/>
        </Button>
      ) : null}
    </div>
  );
};

export default CommentCard;