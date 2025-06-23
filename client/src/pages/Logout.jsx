import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../data/api";
import Cookies from "universal-cookie";

const Logout = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  localStorage.removeItem("token", { path: "/" });

  useEffect(() => {
    axios
      .get(apiUrl + `/signout`, {
        withCredentials: true,
      })
      .then((res) => {
        navigate("/landing", { replace: true });
        if (res.status !== 200) {
          throw new Error(res.error);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/landing");
      });
  }, []);
  return <>Logout page</>;
};

export default Logout;
