import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import SearchArea from "../components/SearchArea";
import SearchAreaCollege from "../components/SearchAreaCollege";
import StudentList from "../components/StudentList";
import AllUsers from "../components/AllUsers";

const Container = styled.div`
  background: #f5f5f5;
  min-height: 100vh;
`;

const AdminPanel = () => {
  const location = useLocation();
  const [id, setid] = useState([]);

  return (
    <Container>
      <Navbar role={true} />
      {/* <SearchArea /> */}
      <AllUsers id={location.state && location.state.id} />
    </Container>
  );
};

export default AdminPanel;
