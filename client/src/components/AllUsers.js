import React, { useEffect, useState } from "react";
import styled from "styled-components";
import image1 from "../assets/studentprofileimages/chikkubhai.png";
import DoneIcon from "@mui/icons-material/Done";
import LoopIcon from "@mui/icons-material/Loop";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import loader_logo from "../assets/loader/onetouch_logo.png";
import { api, apiUrl, token } from "../data/api";
import profile1 from "../assets/profile_dummy/profile1.png";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useNavigate } from "react-router-dom";
import search_by_name from "../assets/icons/search_filter_name.png";
import send_icon from "../assets/icons/send_icon.png";
import untrained from "../assets/icons/untrained.png";
import trained from "../assets/icons/trained.png";
import { useDispatch, useSelector } from "react-redux";
import { local_storage_off } from "../actions";
import { CircularProgress } from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import Cookies from "universal-cookie";
import bulk_select_btn from "../assets/icons/bulk_select_btn.png";
import "animate.css";
const AllUsers = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [employmentFilter, setEmploymentFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setrole] = useState(localStorage.getItem("role"));

  console.log(role);

  const getStudentList = async () => {
    try {
      setLoader(true);
      const res = await axios.post(apiUrl + `/student/get_stud`, {
        id: JSON.parse(localStorage.getItem("ids")),
      });
      setData(res.data);
      setLoader(false);
      dispatch(local_storage_off());
    } catch (error) {
      console.log("Error fetching students", error);
      setLoader(false);
    }
  };

  const verifyStudent = async (id) => {
    try {
      await axios.post(apiUrl + `/student/verify_stud`, { id });
      // setData((prevData) =>
      //   prevData.map((student) =>
      //     student._id === id ? { ...student, verfication: true } : student
      //   )
      // );
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log("Error verifying student", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.post(apiUrl + `/student/delete_stud`, { id });
      window.location.reload();
    } catch (error) {
      console.log("Error fetching students", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getStudentList();
  }, []);

  const filteredData = data.filter((student) => {
    const matchesEmployment =
      employmentFilter === "" ||
      String(student.current_status) === employmentFilter;
    const matchesSkill =
      skillFilter === "" ||
      student.coding.some((coding) => coding.dev_status === skillFilter);
    const matchesSearch =
      searchTerm === "" ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesEmployment && matchesSkill && matchesSearch;
  });

  return (
    <Container>
      {role != 2 && (
        <div className="mt-3">
          <button
            className="btn btn-primary btn-sm px-3 me-3"
            onClick={() => navigate("/postjob")}
          >
            Post Job
          </button>
          <button
            className="btn btn-primary btn-sm px-3"
            onClick={() => navigate("/applications")}
          >
            Job Applications
          </button>
        </div>
      )}
      <div className="container mt-4 p-4 bg-white rounded-4 shadow-lg">
        <h4 className="text-center fw-bold text-primary">Filter Students</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Employment Status</label>
            <select
              className="form-select"
              onChange={(e) => setEmploymentFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="1">Employed</option>
              <option value="0">Unemployed</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Skills</label>
            <select
              className="form-select"
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Digital Marketing Specialist">
                Digital Marketing Specialist
              </option>
              <option value="Social Media Manager">Social Media Manager</option>
              <option value="Content Marketing Specialist">
                Content Marketing Specialist
              </option>
              <option value="SEO Specialist">SEO Specialist</option>
              <option value="Email Marketing Specialist">
                Email Marketing Specialist
              </option>
            </select>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <label className="form-label">Search by Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loader ? (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Fetching Students...</p>
        </div>
      ) : (
        <div className="container mt-4">
          <div className="row">
            {filteredData.map((student) => (
              <div className="col-md-4 col-sm-6 mb-4" key={student._id}>
                <div className="card border-0 shadow-lg rounded-4 p-3">
                  <div className="card-header text-center bg-transparent p-4">
                    <img
                      src={student.profile ? api + student.profile : profile1}
                      alt="profile"
                      className="rounded-circle img-fluid border border-primary"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="fw-bold text-dark">{student.name}</h5>
                    {student.Role == 0 && (
                      <>
                        <p className="text-muted">
                          {student.current_status == 1
                            ? "Working at " + student.company_name
                            : "Unemployed"}
                        </p>
                        <p className="text-muted">
                          {student.coding[0]?.dev_status || "Not provided"}
                        </p>
                      </>
                    )}
                    <span className="badge bg-success">
                      {student.verfication ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <div className="card-footer d-flex justify-content-around bg-light rounded-bottom">
                    <button
                      className="btn btn-primary btn-sm px-3"
                      onClick={() => deleteStudent(student._id)}
                    >
                      Delete User
                    </button>
                    {!student.verfication && (
                      <button
                        className="btn btn-success btn-sm px-3"
                        onClick={() => verifyStudent(student._id)}
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default AllUsers;

const Container = styled.div`
  position: relative;
  width: min(100vw, 1300px);
  margin: auto;
  .loader {
    position: absolute;
    width: 300px;
    left: 0;
    right: 0;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0 auto;
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

  .input_search_name {
    height: 80px;
    padding: 20px;

    background: rgba(61, 86, 178, 0.04);
    border-radius: 10px;

    margin: 20px auto 20px auto;
  }
  .input_search_name_1 {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 10px;
    padding: 5px;

    display: flex;
    align-items: center;
  }
  .search_name_icon {
    width: 43px;
    height: 41px;
    margin-right: 5px;
  }
  .search_name_icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .input_search_name_1 input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;

    color: rgba(61, 86, 178, 0.5);
  }
  .bulk_select_items {
    padding: 10px;
    display: flex;
    align-items: center;
  }
  .bulkmsg_button {
    width: 50px;
    height: 50px;
    cursor: pointer;
    margin: 5px 10px;
  }
  .bulkmsg_button img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .bulk_btn {
    margin-right: 5px;
    min-width: 80px;
  }
  .bulk_msg_input {
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.24);
    border-radius: 10px;
    width: 700px;
    height: 100px;
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
  .send_btn img {
    width: 100%;
    height: 100;
    object-fit: cover;
    cursor: pointer;
  }
  .bulk_select_check {
    margin-right: 5px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .all_select_check {
    margin: 0 5px;
  }
  .bulk_select_label {
    font-size: 20px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    cursor: pointer;

    margin: 5px 0px 5px 0;
    /* identical to box height */

    color: #000000;
  }
  .studenteach {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.22);
    padding: 5px;
  }
  .image {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 10px;
  }
  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
  .center_content {
    display: flex;
    flex-direction: column;
    margin-right: auto;
  }
  .first_row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .name {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 22px;

    margin-right: 10px;
    /* identical to box height */

    color: #000000;
  }
  .college_name {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 18px;

    color: #000000;
  }

  .second_row {
    display: flex;
    flex-wrap: wrap;
  }
  .year,
  .branch,
  .cgpa,
  .backpaper,
  .icon_right {
    margin-right: 25px;
    margin-bottom: 10px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height */

    color: #4a5a96;
  }
  .last_content {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 137px;
    height: 39px;

    margin: 0 10px;

    background: #4a5a96;
    border-radius: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;

    color: #ffffff;
    cursor: pointer;
  }
  .train_image {
    width: 30px;
    height: 30px;
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .train_image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media screen and (max-width: 723px) {
    .bulk_btn {
      margin-right: 5px;
      min-width: 80px;
    }

    .bulkmsg_button {
      width: 30px;
      height: 30px;
      cursor: pointer;
      margin: 5px;
    }

    .bulk_msg_input {
      margin-right: 5px;
      width: 300px;
      height: 60px;
    }
    .send_btn {
      width: 60px;
      height: 30px;
      font-size: 18px;
      padding: 5px 5px;
      text-align: center;
    }
    .send_btn img {
      width: 100%;
      height: 100;
      object-fit: cover;
      cursor: pointer;
    }
    .bulk_select_check {
      margin-right: 5px;
    }
    .input_search_name {
      max-width: 584px;
      height: 60px;
      padding: 10px;
      margin: 0 auto 20px auto;
    }
    .search_name_icon {
      width: 33px;
      height: 31px;
    }
    .input_search_name_1 input {
      font-size: 18px;
      line-height: 14px;
    }
    .image {
      min-width: 50px;
      min-height: 50px;
    }
    .first_row {
      margin-bottom: 5px;
    }
    .name {
      font-size: 18px;
    }
    .college_name {
      font-size: 15px;
    }
    .year,
    .branch,
    .cgpa,
    .backpaper,
    .icon_right {
      margin-right: 10px;
      font-size: 14px;
    }
    .last_content {
      max-width: 55px;
      max-height: 30px;
      font-size: 12px;
    }
    .icon_right {
      width: 20px;
      height: 20px;
    }
    .icon_right img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .train_image {
      width: 20px;
      height: 20px;
      margin: 0 5px;
    }
  }
`;
