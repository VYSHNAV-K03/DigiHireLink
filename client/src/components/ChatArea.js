import React from "react";
import styled from "styled-components";
import grpchat from "../assets/chat/groupchat.png";
import grpchat2 from "../assets/chat/groupchat3.png";

import logo_comm from "../assets/icons/Ellipse 3.png";

const Container = styled.div`
  height: calc(100vh - 100px);
  width: 700px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.52);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.52);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.52);
  border-radius: 5px;
  .header {
    height: 60px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .groupchat_image {
    width: 50px;
    height: 45px;
    margin-right: 10px;
  }
  .groupchat_image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .msg_area {
    height: calc(100% - 120px);
    background: #ffffff;
  }
  .type_area {
    height: 60px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bulk_msg_input {
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.24);
    border-radius: 10px;
    height: 40px;
  }
  .send_btn {
    background: #4a5a96;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;

    margin-left: 10px;

    color: #ffffff;
  }
`;

const ChatArea = () => {
  return (
    <Container>
      <div className="header">
        <div className="groupchat_image">
          <img src={grpchat2} alt="" />
        </div>
        <div className="name">Global Chat</div>
      </div>
      <div className="msg_area"></div>
      <div className="type_area">
        <textarea
          type="text"
          className="bulk_msg_input"
          name=""
          id=""
          placeholder="type message here..."
        />
        <div className="send_btn">send</div>
      </div>
    </Container>
  );
};

export default ChatArea;
