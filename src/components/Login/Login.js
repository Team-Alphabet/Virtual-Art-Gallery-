import React, { useEffect, useState } from "react";
import "./Login.css";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, loginUser } from "../../Action-creators/User";
// import { useAlert } from "react-alert";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user)
  
  const loginHandler = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(email, password));
    dispatch(loadUser())
    // console.log(state.isAuthenticate) // not working why??
  };

  useEffect(() => {
    if (state.isAuthenticate) {
      // This will run whenever the authentication state changes
      console.log("User is authenticated:", state.isAuthenticate);
    }
  }, [state.isAuthenticate]); // Runs whenever state.isAuthenticate changes




  return (
    <div className="login">
      <form className="loginForm" onSubmit={loginHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Canvas Media
        </Typography>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link to="/forgot/password">
          <Typography>Forgot Password?</Typography>
        </Link>

        <Button type="submit">Login</Button>

        <Link to="/register">
          <Typography>New User?</Typography>
        </Link>
      </form>
    </div>
  );
};

export default Login;




