import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../data/api";

const Container = styled.div`
  min-height: 120px;
  background: #fff;
  display: flex;
  align-items: center;
  position: relative;
  .searchbyfilter {
    margin: 0 auto;
  }
  .popup {
    position: absolute;
    width: min(400px, 90vw);
    min-height: 500px;
    background: #ffffff;
    box-shadow: 0px 0px 14px 1px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 0px 0px 14px 1px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 14px 1px rgba(0, 0, 0, 0.75);
    top: -10px;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 20px;
    z-index: 20;
  }
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    background: blue;
    padding: 2px;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    transform: scale(0.8);
    transition: 0.3s;
    :hover {
      transform: scale(1);
    }
  }
  .filter_contents {
    margin: 20px 0;
    cursor: pointer;
  }
`;

const SearchAreaCollege = () => {
  const [popup, setpopup] = useState(false);
  const [filter_content, setfilter_content] = useState();
  const [filter_interview, setfilter_interview] = useState();
  const [filter_placement, setfilter_placement] = useState();
  const [filter_interview_attended, setfilter_interview_attended] = useState();

  const [btnloader, setbtnloader] = useState(false);

  const navigate = useNavigate();

  const PostData = async () => {
    try {
      setbtnloader(true);
      const res = await axios.post(
        apiUrl + `/student/get_filter_stud_college_admin`,
        {
          filter_content,
          filter_interview,
          filter_interview_attended,
          filter_placement,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      // setdata(
      //   res.data &&
      //     res.data.map((element, index) => {
      //       return element._id;
      //     })
      // );

      navigate("/", {
        state: {
          id:
            res.data &&
            res.data.map((element, index) => {
              return element._id;
            }),
        },
      });
      setpopup(false);
      setfilter_content();
      setfilter_interview();
      setfilter_placement();
      setfilter_interview_attended();
    } catch (error) {
      console.log(error);
      setbtnloader(false);
    }
  };

  useEffect(() => {
    console.log({
      filter_content,
      filter_interview,
      filter_interview_attended,
      filter_placement,
    });
  }, [
    filter_content,
    filter_interview,
    filter_interview_attended,
    filter_placement,
  ]);

  return (
    <Container>
      <Button
        variant="outlined"
        className="searchbyfilter"
        startIcon={<FilterAltIcon />}
        onClick={() => setpopup(true)}
      >
        Search By Filter
      </Button>
      {popup && (
        <div className="popup">
          <div className="close" onClick={() => setpopup(false)}>
            <CloseIcon />
          </div>
          <select
            className="form-select filter_contents"
            aria-label="sumesh"
            onChange={(e) => {
              setfilter_content(e.target.value);
              setfilter_interview();
              setfilter_placement();
            }}
          >
            <option defaultValue>Filter</option>
            <option value="interview">Interview</option>
            <option value="placement">Placement</option>
          </select>
          {filter_content === "interview" && (
            <select
              className="form-select filter_contents"
              aria-label="ramesh"
              onChange={(e) => setfilter_interview(e.target.value)}
            >
              <option defaultValue>Filter</option>
              <option value="attended">attended</option>
              <option value="not_attended">not attended</option>
            </select>
          )}
          {filter_interview === "attended" && (
            <select
              className="form-select filter_contents"
              aria-label="ramesh"
              onChange={(e) => setfilter_interview_attended(e.target.value)}
            >
              <option defaultValue>Filter</option>
              <option value="selected">selected</option>
              <option value="not_selected">not selected</option>
              <option value="all">all</option>
            </select>
          )}
          {filter_content === "placement" && (
            <select
              className="form-select filter_contents"
              aria-label="ramesh"
              onChange={(e) => setfilter_placement(e.target.value)}
            >
              <option defaultValue>Filter</option>
              <option value="placed">Placed Students</option>
              <option value="not_placed">Not Placed Students</option>
              <option value="all">All</option>
            </select>
          )}
          {filter_content && filter_content !== "Filter" && (
            <button
              className="btn btn-outline-success submit_btn"
              type="submit"
              onClick={PostData}
            >
              Submit
            </button>
          )}
        </div>
      )}
    </Container>
  );
};

export default SearchAreaCollege;
