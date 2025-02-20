import { Avatar, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
const User = ({ userId, name, profilePic }) => {
  return (
    <Link to={`/user/getuserprofile/${userId}`} className="homeUser" style={{marginBottom: 25}}>
      <Avatar
        src={profilePic}
        alt="User"
        // sx={{
        //   height: "3vmax",
        //   width: "3vmax",
        // }}
      />
      <Typography style={{marginLeft: 10}}>{name}</Typography>
    </Link>
  );
};

export default User;