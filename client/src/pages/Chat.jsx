import React from "react";

import styled from "styled-components";
import ChatArea from "../components/ChatArea";
import Navbar from "../components/Navbar";

const Container = styled.div`
  background: #f5f5f5;
  min-height: 100vh;
  .chat_area {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
  }
`;

const Chat = () => {
  return (
    <Container>
      <Navbar role={true} />
      <div className="chat_area">
        <ChatArea />
      </div>
    </Container>
  );
};

export default Chat;
