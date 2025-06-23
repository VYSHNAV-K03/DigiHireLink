import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { apiUrl } from "../data/api";
import {
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const theme = createTheme();

const SignIn = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const Postdata = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(apiUrl + `/signin`, user, {
        withCredentials: true,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.status !== 201) throw new Error(res.error);

      console.log(res.data.role);
      
      setLoading(false);
      if (res.data.role == 2) {
        navigate("/admin");
      } else if (res.data.role == 1) {
        navigate("/");
      } else {
        navigate("/profile");
      }
      setTimeout(() => {
        window.location.reload();
      },1000);
    } catch (error) {
      setLoading(false);
      setShowDialog(true);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #C08C46 0%, #764ba2 100%)",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="card shadow p-4" style={{ width: "350px", background: "#fff", borderRadius: "10px" }}>
        <div className="text-center">
          <h3 className="mt-2">Sign In</h3>
        </div>
        <form onSubmit={Postdata}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={user.email}
              onChange={handleLogin}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={user.password}
                onChange={handleLogin}
                required
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <button type="submit" className="btn btn-primary w-100">
              Sign In
            </button>
          )}
        </form>

        <div className="text-center mt-3">
          <a href="/register" className="text-decoration-none">
            Don't have an account? Sign Up
          </a>
        </div>
      </div>

      {/* Bootstrap Modal for Error Message */}
      <div
        className={`modal fade ${showDialog ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Sign In Failed</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowDialog(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>Invalid credentials or this account is not verified.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
              <a href="/register" className="btn btn-primary">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
