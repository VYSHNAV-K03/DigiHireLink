import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { apiUrl, token } from "../data/api";
import logo from "../assets/logo.jpg";
import Cookies from "universal-cookie";

const Navbar = (props) => {
  const [login, setLogin] = useState(true);
  const [profileImg, setProfileImg] = useState();
  const [name, setName] = useState("No User");
  const [role, setRole] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const cookies = new Cookies();

  const callNavbar = async () => {
    try {
      const res = await axios.post(
        apiUrl + `/getData`,
        { token: token },
        { withCredentials: true }
      );

      const data = res.data;
      setRole(data.Role);
      setName(data.name);
      setProfileImg(data.profile && data.profile);
      setLogin(false);

      if (res.status !== 200) {
        throw new Error(res.error);
      }
    } catch (e) {
      console.log("error", e);
      setLogin(true);
      navigate("/landing");
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setTimeout(() => {
      navigate("/landing");
      window.location.reload();
    }, 500);
  };

  useEffect(() => {
    callNavbar();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#3F170E" }}>
      <div className="container-fluid">
        <a
          className="navbar-brand"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" style={{ height: "30px" }} />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {role == 1 && (
                <a className="nav-link text-white" onClick={() => navigate("/")}>Dashboard</a>
              )}
            </li>
            {role === 0 && !login && (
              <li className="nav-item">
                <a className="nav-link text-white" onClick={() => navigate("/ai")}>AiTools</a>
              </li>
            )}
            {location.pathname !== "/landing" &&
              location.pathname !== "/profile" &&
              location.pathname !== "/recruiter" &&
              location.pathname !== "/projectmanager" &&
              location.pathname !== "/profile_project" &&
              location.pathname !== "/profile_admin_want" &&
              location.pathname !== "/resignations" &&
              location.pathname !== "/notification" &&(
                <li className="nav-item">
                  <a className="nav-link text-white" onClick={() => navigate("/profile")}>
                    Profile
                  </a>
                </li>
              )}

            {role === 1 && location.pathname !== "/" && location.pathname !== "/recruiter" && location.pathname !== "/profile_admin_want" &&
            location.pathname !== "/notification" && location.pathname !== "/profile" &&(
              <li className="nav-item">
                <a className="nav-link text-white" onClick={() => navigate("/resignations")}>
                  Resignations
                </a>
              </li>
            )}

            {role != 2 &&
              (
                <li className="nav-item">
                  <a className="nav-link text-white" onClick={() => navigate("/notification")}>
                    Notifications
                  </a>
                </li>
              )}

            {!login ? (
              <>
                <li className="nav-item">
                  <a className="nav-link text-white" onClick={handleLogout}>
                    Sign Out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
