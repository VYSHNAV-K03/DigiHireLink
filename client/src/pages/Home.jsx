import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import SearchArea from "../components/SearchArea";
import SearchAreaCollege from "../components/SearchAreaCollege";
import StudentList from "../components/StudentList";

const Container = styled.div`
  background: rgb(249, 227, 187);
  min-height: 5000vh;
`;

const Home = () => {
  const location = useLocation();
  const [id, setid] = useState([]);

  return (
    <Container>
      <Navbar role={true} />
      {/* <SearchArea /> */}
      <StudentList id={location.state && location.state.id} />
    </Container>
  );
};

export default Home;
