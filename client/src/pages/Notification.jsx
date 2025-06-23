import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { apiUrl, token } from "../data/api";
import loader_logo from "../assets/loader/onetouch_logo.png";
import Cookies from "universal-cookie";


const Notification = () => {
  const [bg, setbg] = useState(true);

  const [notifications, setnotifications] = useState();

  const [notifications_admin, setnotifications_admin] = useState();

  const [loader, setloader] = useState(false);

  const [role, setrole] = useState();

  const navigate = useNavigate();

  const cookies = new Cookies();

  const callNavbar = async () => {
    try {
      setloader(true);

      const res = await axios.post(
        apiUrl + `/getData`,
        {
          token: token
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data;

      setrole(res.data.Role);

      setnotifications(data.notifications && data.notifications);
      setnotifications_admin(
        data.notifications_admin && data.notifications_admin
      );
      if (res.status !== 200) {
        throw new Error(res.error);
      }
      setloader(false);
    } catch (e) {
      console.log("error", e);
      setloader(false);

      // navigate("/login");
    }
  };
  

  useEffect(() => {
    callNavbar();
  }, []);

  return (
    <>
      <Navbar role={false} />
      <Container loader={loader}>
        {loader ? (
          <div className="loader">
            <div className="loader_image">
              <img src={loader_logo} alt="" />
            </div>
            <div className="loader_line_container">
              <div className="line_loader"></div>
            </div>
          </div>
        ) : role === 0 ? (
          notifications &&
          notifications.reverse().map((notification, index) => (
            <ItemEach
              back={index % 2 === 0 ? false : true}
              response={notification.viewed ? true : false}
              className="item_each"
              key={notification._id}
              onClick={() =>
                navigate("/notification_each", {
                  state: { id: notification._id },
                })
              }
            >
              <div className="content">
                You have an update from <span>{notification.company_name}</span>
              </div>
              <div className="date">{notification.send_date}</div>
            </ItemEach>
          ))
        ) : (
          notifications_admin &&
          notifications_admin.reverse().map((notification_ad, index) => (
            <ItemEach
              back={index % 2 === 0 ? false : true}
              // response={notification.response}
              response={false}
              className="item_each"
              key={notification_ad._id}
              onClick={() =>
                navigate("/profile_admin_want", {
                  state: { id: notification_ad.user_id },
                })
              }
            >
              <div className="content">
                {notification_ad.name}{" "}
                {notification_ad.response ? "accepted" : "rejected"} your notification
              </div>
              <div className="date">{notification_ad.send_date}</div>
            </ItemEach>
          ))
        )}
      </Container>
    </>
  );
};

export default Notification;



const Container = styled.div`
  position: relative;

  .loader {
    position: absolute;
    left: 0;
    right: 0;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin: auto;
  }
  .loader_image {
    width: 200px;
    height: 200px;
  }
  .loader_image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .loader_line_container {
    width: 300px;
    height: 10px;

    background: rgba(0, 0, 0, 0.34);
    border-radius: 5px;
    position: relative;
  }
  .line_loader {
    position: absolute;
    background: #4a5a96;
    border-radius: 5px;

    top: 0;
    bottom: 0;
    left: 0;
    width: ${(props) => (props.loader ? "250px" : "300px")};
    animation: loader 5s ease;
  }

  @keyframes loader {
    from {
      width: 0px;
    }
    to {
      width: ${(props) => (props.loader ? "250px" : "300px")};
    }
  }
  @media screen and (max-width: 700px) {
    .loader_image {
      width: 130px;
      height: 130px;
    }
    .loader_line_container {
      width: 150px;
      height: 8px;
    }
    .line_loader {
      width: ${(props) => (props.loader ? "120px" : "150px")};
    }

    @keyframes loader {
      from {
        width: 0px;
      }
      to {
        width: ${(props) => (props.loader ? "120px" : "150px")};
      }
    }
  }
`;

const ItemEach = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px 50px;
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 29px;

  background: ${(props) =>
    props.back ? "rgba(217, 217, 217, 0.3)" : " rgba(217, 217, 217, 0.15)"};

  color: ${(props) => (props.response ? "grey" : "#000000")};
  cursor: pointer;
  :hover {
    color: blue;
  }
  span {
    font-weight: 600;
  }
  @media screen and (max-width: 775px) {
    .date {
      font-size: 15px;
    }
  }
  @media screen and (max-width: 631px) {
    .date {
      order: -1;
    }
  }
`;