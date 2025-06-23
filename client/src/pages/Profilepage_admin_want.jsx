import React, { useState, useEffect } from "react";
import styled from "styled-components";
import profile from "../assets/profile_dummy/profile1.png";
import bg1 from "../assets/profilepage/bg1.svg";
import loader_logo from "../assets/loader/onetouch_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Buffer } from "buffer";
import { api, apiUrl, token } from "../data/api";
import Navbar from "../components/Navbar";
import DateTimePicker from "react-datetime-picker";
import { CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import PDFFile from "./generatePdf";
import generatePdf from "./generatePdf";
import GeneratePdf from "./generatePdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Cookies from "universal-cookie";

const Profilepage_admin_want = () => {
  const [block, setblock] = useState(1);
  const [resignations, setResignations] = useState([]);
  const [data, setdata] = useState();
  const [role, setrole] = useState();
  const [yes_no, setyes_no] = useState();
  const [train, settrain] = useState(false);
  const [loader, setloader] = useState(false);
  const [loader_addbtn, setloader_addbtn] = useState(false);
  const [mail_basic_loader, setmail_basic_loader] = useState(false);
  const navigate = useNavigate();
  const [rootUserName, setrootUserName] = useState();
  const [rootId, setrootId] = useState();
  const [date_exam, setdate_exam] = useState(0);
  const [level_exam, setlevel_exam] = useState(1);
  const [requirements, setrequirements] = useState({
    laptop: false,
    internet: false,
    more: "",
  });
  const [workHistory, setWorkHistory] = useState(null);
  const [showWorkHistoryModal, setShowWorkHistoryModal] = useState(false);
  const [exam_mode, setexam_mode] = useState("online");
  const [exam_type, setexam_type] = useState("written");
  const [subject, setsubject] = useState("");
  const location = useLocation();
  console.log(location.state.id);
  const id = location.state.id;
  const z = 0;
  const cookies = new Cookies();

  const [showModal, setShowModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salary, setSalary] = useState("");

  const fetchResignations = async () => {
    try {
      const response = await axios.post(
        apiUrl + "/mailsend/resignations",
        { token } // Token in body
      );

      setResignations(response.data.resignations);
    } catch (err) {
      console.error("Error fetching resignations:", err);
    }
  };

  console.log(resignations);

  const getDataProfile = async () => {
    try {
      setloader(true);

      const res = await axios.post(
        apiUrl + `/student/get_stud_admin_want`,
        { id },
        {
          withcredentials: true,
        }
      );

      setdata(res.data);

      setloader(false);

      console.log(res.data);
    } catch (error) {
      console.log(error);
      setloader(false);
    }
  };

  const callNavbar = async () => {
    try {
      const res = await axios.post(
        apiUrl + `/getData`,
        {
          token: token,
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data;

      setrootUserName(data.name);
      setrole(data.Role);
      setrootId(data._id);

      if (res.status !== 200) {
        throw new Error(res.error);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  console.log(rootUserName);

  const changeTrain = async () => {
    try {
      setloader_addbtn(true);

      const res = await axios.post(
        apiUrl + `/mailsend/send_train`,
        { id, train, token: token },
        { withCredentials: true }
      );
      console.log(res.data);
      window.alert(res.data);
      getDataProfile();

      setloader_addbtn(false);
    } catch (error) {
      console.log(error);
      setloader_addbtn(false);
    }
  };

  const SendMail = async () => {
    try {
      setloader_addbtn(true);

      if (yes_no) {
        const res = await axios.post(
          apiUrl + `/mailsend/sendmail`,
          { id, token },
          { withCredentials: true }
        );
        console.log(res.data);
        window.alert(res.data);
        getDataProfile();
      } else {
        window.alert("Select Student Next Time");
      }
      setloader_addbtn(false);
    } catch (error) {
      console.log(error);
      setloader_addbtn(false);
    }
  };

  const sendMailBasic = async () => {
    try {
      setmail_basic_loader(true);
      const res = await axios.post(
        apiUrl + `/mailsend/sendmail_basic`,
        { id, subject, token: token },
        { withCredentials: true }
      );

      window.alert(res.data);

      setmail_basic_loader(false);
    } catch (error) {
      console.log(error);
      setmail_basic_loader(false);
    }
  };

  const SendMail_Exam_Level = async () => {
    if (date_exam === 0) {
      window.alert("Please fill properly");
    } else {
      const date_new = new Date(date_exam).toLocaleString();
      try {
        setloader_addbtn(true);

        const res = await axios.post(
          apiUrl + `/mailsend/sendmail`,
          {
            id,
            date_new,
            requirements,
            level_exam,
            exam_type,
            exam_mode,
            token: token,
          },
          { withCredentials: true }
        );
        setloader_addbtn(false);

        console.log(res.data);
        window.alert(res.data);
        getDataProfile();
      } catch (error) {
        console.log(error);
        setloader_addbtn(false);
      }
    }
  };

  // React Frontend Update

  const fetchWorkHistory = async () => {
    try {
      const res = await axios.post(
        apiUrl + `/work-history/${id}`,
        { token },
        {
          withCredentials: true,
        }
      );
      setWorkHistory(res.data.workHistory);
      console.log(res.data.workHistory);
    } catch (error) {
      console.log("Error fetching work history:", error);
    }
  };

  const requestWorkHistory = async () => {
    console.log("request work history");

    try {
      await axios.post(
        apiUrl + "/work-history/request/sent",
        { employee_id: id, token, jobTitle, jobDescription, salary },
        { withCredentials: true }
      );
      alert("Request Sent!");
      fetchWorkHistory();
    } catch (error) {
      console.log("Error requesting work history:", error);
    }
  };

  useEffect(() => {
    getDataProfile();
    callNavbar();
    fetchResignations();
  }, []);

  return (
    <div className="main">
      <Navbar />
      <Container
        bg={bg1}
        block={block}
        loader={loader}
        training={data && data.Train}
      >
        {loader ? (
          <div className="loader">
            <div className="loader_image">
              <img src={loader_logo} alt="" />
            </div>
            <div className="loader_line_container">
              <div className="line_loader"></div>
            </div>
          </div>
        ) : (
          <div className="profile_container_main">
            <div
  
  className="left p-3"
  style={{
    backgroundColor: "rgb(249, 227, 187)", // Light yellow
    borderRadius: "10px",
    position: "sticky",
    top: "0",
    width: "250px",
    minHeight: "2000vh", // Ensures full height coverage
    height: "100%", // Adjusts dynamically
    overflowY: "auto", // Enables scrolling
  }}
>
  <div className="profile_buttons d-flex flex-column">
    <div
      className="profile_btn text-center p-2 mb-2 rounded"
      style={{
        backgroundColor: "rgb(245, 181, 19)", // Yellow button
        color: "black",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "orange")} // Orange on hover
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(245, 181, 19)")}
      onClick={() => setblock(1)}
    >
      Profile
    </div>

    <div
      className="profile_btn text-center p-2 mb-2 rounded"
      style={{
        backgroundColor: "rgb(245, 181, 19)",
        color: "black",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "orange")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(245, 181, 19)")}  
      onClick={() => setblock(4)}
    >
      Worked At
    </div>

    <div
      className="profile_btn text-center p-2 mb-2 rounded"
      style={{
        backgroundColor: "rgb(245, 181, 19)",
        color: "black",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "orange")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(245, 181, 19)")}
      onClick={() => setblock(11)}
    >
      Work History
    </div>

    <div
      className="profile_btn text-center p-2 mb-2 rounded"
      style={{
        backgroundColor: "rgb(245, 181, 19)",
        color: "black",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "orange")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(245, 181, 19)")}
      onClick={() => setblock(12)}
    >
      Interview
    </div>

    {role === 1 && (
      <div
        className="Select_stud_btn text-center p-2 mb-2 rounded"
        style={{
          fontSize: "15px",
          backgroundColor: "rgb(245, 181, 19)",
          color: "black",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "orange")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(245, 181, 19)")}
        onClick={() => setblock(5)}
      >
        Select
      </div>
    )}

    {(role === 2 || role === 3 || role === 4 || role === 5) && (
      <div
        className="Select_stud_btn_college text-center p-2 mb-2 rounded"
        style={{
          backgroundColor: "rgb(245, 181, 19)",
          color: "black",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "orange")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(245, 181, 19)")}
        onClick={() => setblock(7)}
      >
        Select Student
      </div>
    )}
  </div>
</div>

            <div className="right">
              {block === 1 && (
                <div className="container mt-4">
                  <div className="row justify-content-center">
                    {/* Profile Card */}
                    <div className="col-md-10">
                      <div className="card shadow-lg">
                        <div className="card-body">
                          <div className="row align-items-center">
                            {/* Profile Image & Name */}
                            <div className="col-md-4 text-center">
                            <img
  src={data && data.profile ? api + data.profile : profile}
  alt="Profile"
  className="rounded-circle img-fluid border border-3"
  style={{
    width: "150px",
    height: "150px",
    borderColor: "rgb(204, 117, 73) !important", // Ensuring orange color
    borderStyle: "solid", // Making sure the border is visible
  }}
/>

                              <h4 className="mt-3 fw-bold">{data?.name}</h4>
                              <span className="badge bg-success">
                                {data?.current_status === 1
                                  ? "Working Professional"
                                  : "Unemployed"}
                              </span>
                            </div>

                            {/* Profile Details */}
                            <div className="col-md-8">
                            <h5 className="fw-bold" style={{ color: "rgb(204, 117, 73)" }}>
  Profile Information
</h5>

                              <hr />
                              <div className="row">
                                <div className="col-sm-6 mb-3">
                                  <i className="bi bi-envelope-fill  me-2" style={{ color: "rgb(204, 117, 73)" }}></i>
                                  <strong>Email:</strong> <br />
                                  <span className="text-muted">
                                    {data?.email}
                                  </span>
                                </div>
                                <div className="col-sm-6 mb-3">
  <a
    href={api + data?.resume}
    target="_blank"
    rel="noopener noreferrer"
    className="btn w-100"
    style={{
      color: "rgb(204, 117, 73)", // Text color
      borderColor: "rgb(204, 117, 73)", // Border color
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = "rgb(204, 117, 73)"; // Fill orange on hover
      e.target.style.color = "white"; // Text turns white on hover
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "transparent"; // Revert to transparent
      e.target.style.color = "rgb(204, 117, 73)"; // Text back to orange
    }}
  >
    View Resume
  </a>
</div>


                                <div className="col-sm-6 mb-3">
                                  <i className="bi bi-telephone-fill  me-2" style={{ color: "rgb(204, 117, 73)" }}></i>
                                  <strong>Phone:</strong> <br />
                                  <span className="text-muted">
                                    {data?.phone}
                                  </span>
                                </div>

                                <div className="col-sm-12 mb-3">
                                  <i className="bi bi-briefcase-fill  me-2" style={{ color: "rgb(204, 117, 73)" }}></i>
                                  <strong>Current Status:</strong> <br />
                                  <span className="text-muted">
                                    {data?.current_status === 1
                                      ? `Working at ${data.company_name}`
                                      : "Unemployed"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Skills Section */}
                          <div className="mt-4">
                            <h5 className="text-dark fw-bold">
                              Skills & Expertise
                            </h5>
                            <hr />
                            <h6 className="fw-bold " style={{color:"rgb(204, 117, 73)"}}>
                              Programming Languages
                            </h6>
                            <div className="row">
                              {data?.coding?.[0]?.languages?.length > 0 ? (
                                data.coding[0].languages.map((item, index) =>
                                  item.language_name &&
                                  item.language_name !== "null" ? (
                                    <div key={index} className="col-md-4 mb-2">
                                      <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded shadow-sm">
                                        <span className="fw-bold "style={{color:"orange"}}>
                                          {item.language_name}
                                        </span>
                                        <span className="badge bg-success" >
                                          {item.language_level === "undefined"
                                            ? "Beginner"
                                            : item.language_level}
                                        </span>
                                      </div>
                                    </div>
                                  ) : null
                                )
                              ) : (
                                <div className="col-12 text-muted">
                                  No languages available.
                                </div>
                              )}
                            </div>
                            <div className="text-center mt-4">
                              {data?.coding?.[0]?.dev_status &&
                              data.coding[0].dev_status !== "undefined" ? (
                                <div className="alert alert-info p-2">
                                  Job Title-{" "}
                                  <strong>{data.coding[0].dev_status}</strong>
                                </div>
                              ) : (
                                <div className="alert alert-danger p-2">
                                  He is not a developer
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {block === 3 && (
                <div className="certificates_container">
                  <div className="college_id_certificate">
                    <div className="name_id">College Id</div>
                    <div className="view">View</div>
                  </div>
                  <div className="sslc_certificate">
                    <div className="name_sslc">SSLC Certificate</div>
                    <div className="view">View</div>
                  </div>
                  <div className="plustwo_certificate">
                    <div className="name_plustwo">+2 Certificate</div>
                    <div className="view">View</div>
                  </div>
                  <div className="udemy_certificate">
                    <div className="name_udemy">Udemy</div>
                    <div className="view">View</div>
                  </div>
                </div>
              )}
              {block === 4 && (
                <div className="container py-5">
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-header bg-dark text-white text-center rounded-top-4">
                      <h4 className="mb-0">Worked At</h4>
                    </div>
                    <div className="card-body bg-light">
                      {data?.experience?.length > 0 ? (
                        <div className="row g-3">
                          {data.experience.map((item, index) => (
                            <div key={index} className="col-md-6">
                              <div className="p-3 bg-white rounded-3 shadow-sm border-start border-4 border-primary">
                                <h5 className="text-dark fw-bold">
                                  {item.company_name}
                                </h5>
                                <p className="mb-1">
                                  <strong>Start Date:</strong>{" "}
                                  {new Date(
                                    item.start_date
                                  ).toLocaleDateString()}
                                </p>
                                <p className="mb-0">
                                  <strong>End Date:</strong>{" "}
                                  {item.end_date
                                    ? new Date(
                                        item.end_date
                                      ).toLocaleDateString()
                                    : "Present"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="alert alert-secondary text-center"
                          role="alert"
                        >
                          No previous experiences available.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {block === 6 && (
                <div className="educ_main_container">
                  {data && data.education[0] && (
                    <div className="education_details_container">
                      <div className="btech_details">
                        <div className="title_btech">Educational Details</div>
                        <div className="element_detail">
                          <div className="title_element">College</div>
                          <div className="content_btech">
                            {" "}
                            {data.education[0].institution_name}
                          </div>
                        </div>{" "}
                        <div className="element_detail">
                          <div className="title_element">Branch</div>
                          <div className="content_btech">
                            {" "}
                            {data.education[0].branch}
                          </div>
                        </div>
                        <div className="element_detail">
                          <div className="title_element">Year</div>
                          <div className="content_btech">
                            {" "}
                            {data.education[0].year}
                          </div>
                        </div>
                        <div className="element_detail">
                          <div className="title_element">CGPA</div>
                          <div className="content_btech">
                            {" "}
                            {data.education[0].cgpa}
                          </div>
                        </div>{" "}
                        <div className="element_detail">
                          <div className="title_element">Backpapers</div>
                          <div className="content_btech">
                            {" "}
                            {data.education[0].back_papers}
                          </div>
                        </div>
                        <div className="element_detail">
                          <div className="title_element">Certificate</div>
                          <div className="content_btech">
                            <a
                              className="view"
                              href={api + data.education[0].certificate}
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {block === 5 && (
  <div className="container mt-4">
    <div className="card shadow-lg border-0 p-4">
      <div className="card-body">
        <h4 className="text-center fw-bold mb-4 " style={{color:"#3F170E"}}>
          <i>Employee Selection Request</i>
        </h4>

        {data &&
        data.placement.filter((element) => element.company_id === rootId)[0] ? (
          data.placement
            .filter((element) => element.company_id === rootId)
            .map((item) =>
              item.response === 0 ? (
                <div className="alert alert-warning text-center fw-bold" key={item._id}>
                  ✅ Mail sent successfully! Please wait for the employee’s response.
                </div>
              ) : (
                <div className="card p-4 border-0 shadow-sm" key={item._id}>
                  <h5 className="text-center fw-semibold mb-3 text-dark">
                    Do you want to select this employee?
                  </h5>
                  <div className="d-flex justify-content-center gap-4">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="Yes"
                        checked={yes_no === true}
                        onChange={() => setyes_no(true)}
                      />
                      <label className="form-check-label fw-medium text-dark" htmlFor="Yes">
                        Yes
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="No"
                        checked={yes_no === false}
                        onChange={() => setyes_no(false)}
                      />
                      <label className="form-check-label fw-medium text-dark" htmlFor="No">
                        No
                      </label>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    {loader_addbtn ? (
                      <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <button
                        className="btn btn-lg rounded-pill px-5"
                        onClick={SendMail}
                        style={{
                          backgroundColor: "rgb(204, 117, 73)",
                          color: "white",
                          border: "none",
                          transition: "0.3s",
                          boxShadow: "0 4px 10px rgba(204, 117, 73, 0.3)",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.boxShadow =
                            "0 0 15px rgba(204, 117, 73, 0.8), 0 0 30px rgba(204, 117, 73, 0.6)";
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.boxShadow = "0 4px 10px rgba(204, 117, 73, 0.3)";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                </div>
              )
            )
        ) : (
          <div className="card p-4 border-0 shadow-sm">
            <h5 className="text-center fw-semibold mb-3 text-dark">
              Do you want to select this employee?
            </h5>
            <div className="d-flex justify-content-center gap-4">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="Yes"
                  checked={yes_no === true}
                  onChange={() => setyes_no(true)}
                />
                <label className="form-check-label fw-medium text-dark" htmlFor="Yes">
                  Yes
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="No"
                  checked={yes_no === false}
                  onChange={() => setyes_no(false)}
                />
                <label className="form-check-label fw-medium text-dark" htmlFor="No">
                  No
                </label>
              </div>
            </div>

            <div className="text-center mt-4">
              {loader_addbtn ? (
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <button
                  className="btn btn-lg rounded-pill px-5"
                  onClick={SendMail}
                  style={{
                    backgroundColor: "rgb(204, 117, 73)",
                    color: "white",
                    border: "none",
                    transition: "0.3s",
                    boxShadow: "0 4px 10px rgba(204, 117, 73, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.boxShadow =
                      "0 0 15px rgba(204, 117, 73, 0.8), 0 0 30px rgba(204, 117, 73, 0.6)";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.boxShadow = "0 4px 10px rgba(204, 117, 73, 0.3)";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

              {block === 7 && (
                <div className="placement_select_container">
                  <div className="title_block_7_mail_send">
                    Send Mail Or Notification To This Student
                  </div>
                  <div className="subject">
                    <label htmlFor="subject">Subject </label>
                    <textarea
                      name=""
                      id="subject"
                      placeholder="write here.."
                      value={subject}
                      onChange={(e) => setsubject(e.target.value)}
                    ></textarea>{" "}
                  </div>
                  {mail_basic_loader ? (
                    <CircularProgress
                      style={{
                        display: "flex",
                      }}
                    />
                  ) : (
                    <div className="send_mail_basic" onClick={sendMailBasic}>
                      Send
                    </div>
                  )}
                </div>
              )}
              {block === 8 && (
                <div className="doyou trainig_shell">
                  <div className="text_doyou">Are you sure he is genuine</div>
                  <div className="yes_no_doyou">
                    <input
                      type="radio"
                      name="train_not"
                      id="Trained"
                      checked={train === true}
                      onChange={() => settrain(true)}
                    />
                    <label htmlFor="Trained">Yes</label>
                    <input
                      type="radio"
                      name="train_not"
                      id="Untrained"
                      checked={train === false}
                      onChange={() => settrain(false)}
                    />
                    <label htmlFor="Untrained">No</label>
                  </div>
                  {loader_addbtn ? (
                    <CircularProgress
                      style={{
                        display: "flex",
                      }}
                    />
                  ) : (
                    <div className="confirm_doyou" onClick={changeTrain}>
                      Confirm
                    </div>
                  )}
                </div>
              )}
              {block === 9 && <GeneratePdf data={data} />}
              {block === 10 && (
                <div className="resignation_container">
                  <h2>Resignation Requests</h2>
                  {resignations.length > 0 ? (
                    <ul className="list-group">
                      {resignations.map((resign) => (
                        <li key={resign._id} className="list-group-item">
                          <h5>{resign.company?.name}</h5>
                          <p>
                            <strong>Reason:</strong> {resign.resignReason}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(resign.resignDate).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No resignation requests found.</p>
                  )}
                </div>
              )}
              {block === 11 && (
  <div className="container mt-4">
    <h4 className="fw-bold text-center" style={{ color: "#3F170E" }}>
      <i>Work History</i>
    </h4>
    <div className="d-flex justify-content-center gap-3 mt-3">
    <button
  className="btn fw-bold shadow-sm text-white"
  style={{ backgroundColor: "rgb(204, 117, 73)", border: "none" }}
  onClick={() => setShowModal(true)}
>
  Request Work History
</button>


      <button
        className="btn btn-success fw-bold shadow-sm"
        onClick={fetchWorkHistory}
      >
        📂 View Work History
      </button>
    </div>

    {workHistory && workHistory.length > 0 ? (
      workHistory.map((history, index) => (
        <div key={index} className="card mt-4 shadow-sm border-0">
          <div className="card-body">
            <h5 className="fw-bold">{history?.jobTitle}</h5>
            <p className="text-muted">
              <strong>Company:</strong> {history?.company_id?.name}
            </p>
            <p>
              <strong>Description:</strong> {history?.jobDescription}
            </p>
            <p>
              <strong>Salary:</strong> <span className="text-success fw-bold">{history?.salary} Rs</span>
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(history?.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`badge ${history?.status === "Approved" ? "bg-success" : "bg-warning text-dark"}`}>
                {history?.status}
              </span>
            </p>
            {history?.file && (
              <a
                href={`${api}uploads/${history?.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm mt-2"
              >
                📁 View File
              </a>
            )}
          </div>
        </div>
      ))
    ) : (
      <div className="alert alert-info mt-4 text-center">
        No work history available.
      </div>
    )}
  </div>
)}

{/* Modal */}
{showModal && (
  <div className="modal fade show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content shadow-lg">
        <div className="modal-header  text-white" style={{backgroundColor:"rgb(204, 117, 73)"}}>
          <h5 className="modal-title fw-bold"> Request Work History</h5>
          <button className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body p-4">
          <div className="mb-3">
            <label className="fw-bold">Job Title:</label>
            <input
              type="text"
              className="form-control"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title"
            />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Job Description:</label>
            <textarea
              className="form-control"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter job description"
              rows="3"
            />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Salary:</label>
            <input
              type="number"
              className="form-control"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter salary"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-success" onClick={requestWorkHistory}>
            ✅ Submit
          </button>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}


              {block === 12 && (
                <div className="container mt-4 p-4 bg-white rounded shadow-lg">
                  <h4 className="text-center fw-bold text-primary mb-3">
                    Exam Details
                  </h4>

                  {/* Exam Level Selection */}
                  <div className="mb-3">
                    <label className="fw-bold text-secondary">Exam Level</label>
                    <select
                      className="form-select border-primary"
                      name="exam_level"
                      id="exam_level"
                      defaultValue={level_exam}
                      onChange={(e) => setlevel_exam(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Exam Date Picker */}
                  <div className="mb-3">
                    <label className="fw-bold text-secondary">Exam Date</label>
                    <div className="input-group">
                      <DateTimePicker
                        className="form-control border-primary"
                        value={date_exam}
                        onChange={setdate_exam}
                        minDate={new Date()}
                        minutePlaceholder="mm"
                        hourPlaceholder="hh"
                        dayPlaceholder="DD"
                        monthPlaceholder="MM"
                        yearPlaceholder="YYYY"
                      />
                    </div>
                  </div>

                  {/* Exam Requirements */}
                  <div className="mb-3">
                    <label className="fw-bold text-secondary">
                      Requirements
                    </label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="laptop"
                          checked={requirements.laptop}
                          onChange={() =>
                            setrequirements((prev) => ({
                              ...prev,
                              laptop: !prev.laptop,
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="laptop">
                          Laptop
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="internet"
                          checked={requirements.internet}
                          onChange={() =>
                            setrequirements((prev) => ({
                              ...prev,
                              internet: !prev.internet,
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="internet">
                          Internet
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Link / Description */}
                  <div className="mb-3">
                    <label className="fw-bold text-secondary">
                      Meeting Link
                    </label>
                    <textarea
                      className="form-control border-primary"
                      placeholder="Paste the Meeting Link..."
                      value={requirements.description}
                      onChange={(e) =>
                        setrequirements((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    ></textarea>
                  </div>

                  {/* Exam Type */}
                  <div className="mb-3">
                    <label className="fw-bold text-secondary">Exam Type</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="written"
                          checked={exam_type === "written"}
                          onChange={() => setexam_type("written")}
                        />
                        <label className="form-check-label" htmlFor="written">
                          Written
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="interview"
                          checked={exam_type === "interview"}
                          onChange={() => setexam_type("interview")}
                        />
                        <label className="form-check-label" htmlFor="interview">
                          Interview
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Exam Mode */}
                  <div className="mb-3">
                    <label className="fw-bold text-secondary">Exam Mode</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="online"
                          checked={exam_mode === "online"}
                          onChange={() => setexam_mode("online")}
                        />
                        <label className="form-check-label" htmlFor="online">
                          Online
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="Offline"
                          checked={exam_mode === "offline"}
                          onChange={() => setexam_mode("offline")}
                        />
                        <label className="form-check-label" htmlFor="Offline">
                          Offline
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notify Button */}
                  <div className="text-center mt-4">
                    {loader_addbtn ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <button
                        className="btn btn-lg btn-primary px-5 shadow"
                        onClick={SendMail_Exam_Level}
                      >
                        Notify
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Profilepage_admin_want;

const Container = styled.div`
  position: relative;
  /* 
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
  }

  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  } */

  .update_details {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #4a5a96;
    border: 1px solid #4a5a96;
    border-radius: 10px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height */
    display: flex;
    align-items: center;
    justify-content: center;

    width: 150px;
    height: 38px;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    :hover {
      transform: scale(1.05);
      background: #4a5a96;
      color: white;
    }
  }
  @media screen and (max-width: 450px) {
    .update_details {
      font-size: 15px;
      width: 120px;
      height: 28px;
    }
  }

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

  .button_container {
    display: flex;
  }
  .update {
    display: flex;
    margin: 20px 30px 10px auto;
  }
  .signout {
    display: flex;
    margin: 20px auto 10px 30px;
  }
  .profile_container_main {
    height: calc(100vh - 95px);
    background-color: #fff;
    display: flex;
  }
  .left {
    height: 100%;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid rgba(0, 0, 0, 0.22);
  }

  .image {
    width: 159px;
    height: 159px;
    margin: 20px 0 15px 0;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  }
  .name {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 32px;
    line-height: 39px;
    /* identical to box height */

    color: #4a5a96;
    margin-bottom: 5px;
  }
  .detail1 {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    text-align: center;

    color: #000000;

    margin-bottom: 10px;
  }
  .trainig_shell {
    padding: 20px;
  }
  .training_status {
    margin-bottom: 40px;

    background: #ffffff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.14);

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 18px;
    text-align: center;

    color: ${(props) => (props.training ? "#32cd32" : "red")};

    padding: 10px 20px;

    border-radius: 20px;
    border: 2px solid ${(props) => (props.training ? "#32cd32" : "red")};
  }

  .profile_btn,
  .skills_btn,
  .certificate_btn,
  .interview_btn,
  .Select_stud_btn,
  .Select_stud_btn_college,
  .edu_btn {
    border: 1px solid #4a5a96;
    border-radius: 10px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height */
    display: flex;
    align-items: center;
    justify-content: center;

    width: 130px;
    height: 38px;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    :hover {
      transform: scale(1.05);
    }
  }

  .profile_btn {
    margin: 20px 0;
    /* color: ${(props) => (props.block === 1 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 1 ? "#4a5a96" : "white")}; */
  }
  .skills_btn {
    margin-bottom: 20px;
    /* color: ${(props) => (props.block === 2 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 2 ? "#4a5a96" : "white")}; */
  }
  .edu_btn {
    margin-bottom: 20px;
    /* color: ${(props) => (props.block === 6 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 6 ? "#4a5a96" : "white")}; */
  }
  .interview_btn {
    margin-bottom: 20px;
    /* color: ${(props) => (props.block === 4 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 4 ? "#4a5a96" : "white")}; */
  }
  .certificate_btn {
    margin-bottom: 20px;
    /* color: ${(props) => (props.block === 3 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 3 ? "#4a5a96" : "white")}; */
  }
  .Select_stud_btn {
    /* color: ${(props) => (props.block === 5 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 5 ? "#4a5a96" : "white")}; */
  }
  .Select_stud_btn_college {
    /* color: ${(props) => (props.block === 7 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 7 ? "#4a5a96" : "white")}; */
  }

  .right {
    display: flex;
    width: 100%;
  }

  .profile_container {
    display: flex;
    flex-direction: column;
    padding: 160px 0 0 60px;
  }

  .style_profile_elements_bold {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #000000;
    display: flex;

    margin-bottom: 50px;
  }
  .width_profile_elements {
    width: 300px;
  }

  .style_profile_elements_light {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;

    color: #000000;
    margin-right: 20px;
  }
  .view {
    width: 120px;
    height: 35px;

    text-decoration: none;

    background: #4a5a96;
    border: 1px solid #4a5a96;
    border-radius: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height */

    text-align: center;

    color: #ffffff;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
  }

  @media screen and (max-width: 1057px) {
    .left {
      min-width: 200px;
    }
    .image {
      width: 129px;
      height: 129px;
      margin: 20px 0 15px 0;
    }
    .name {
      font-size: 28px;
    }
    .detail1 {
      font-size: 16px;
    }
    .training_status {
      margin-bottom: 20px;
    }
    .profile_btn,
    .skills_btn,
    .certificate_btn,
    .interview_btn,
    .Select_stud_btn,
    .Select_stud_btn_college,
    .edu_btn {
      width: 110px;
      height: 35px;
      font-size: 14px;
    }
    .profile_container {
      padding: 70px 0 0 30px;
    }
    .width_profile_elements {
      width: 200px;
    }
    .style_profile_elements_bold {
      font-size: 20px;
      margin-bottom: 30px;
    }
    .style_profile_elements_light {
      font-size: 20px;
    }
  }
  @media screen and (max-width: 709px) {
    .profile_container_main {
      flex-direction: column;
    }
    .left {
      border-bottom: 1px solid rgba(0, 0, 0, 0.22);
      border-right: 0;
      width: 100%;
      height: auto;
    }
    .image {
      margin: 20px 0 5px 0;
    }
    .detail1 {
      font-size: 16px;
    }
    .training_status {
      margin-bottom: 10px;
    }
    .profile_container {
      padding: 10px 0 0 10px;
    }
    .profile_buttons {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    }
    .profile_btn,
    .skills_btn,
    .certificate_btn,
    .interview_btn,
    .Select_stud_btn,
    .Select_stud_btn_college,
    .edu_btn {
      margin: 5px;
    }
    .width_profile_elements {
      max-width: 130px;
    }
    .style_profile_elements_bold {
      font-size: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .style_profile_elements_light {
      font-size: 20px;
    }
  }
  .skills_container {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
  }
  .first_skill,
  .third_skill,
  .known_languages {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 38px;
    line-height: 46px;
    margin-bottom: 10px;

    color: #484848;
  }
  .second_skill {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 38px;
    line-height: 46px;

    color: #000854;
  }
  li {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 28px;
    line-height: 46px;
    margin-bottom: 8px;

    color: #484848;
  }
  .current_status_skill {
    margin-top: 30px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-size: 38px;
    line-height: 46px;

    color: #000854;
  }

  .certificates_container {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
  }

  .college_id_certificate,
  .sslc_certificate,
  .plustwo_certificate,
  .udemy_certificate {
    display: flex;
  }
  .name_id,
  .name_sslc,
  .name_plustwo,
  .name_udemy {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    line-height: 36px;
    display: flex;
    align-items: center;

    color: #545454;
    width: 500px;
    margin-bottom: 40px;
  }
  @media screen and (max-width: 1057px) {
    .name_id,
    .name_sslc,
    .name_plustwo,
    .name_udemy {
      width: 300px;
    }
  }
  @media screen and (max-width: 709px) {
    .name_id,
    .name_sslc,
    .name_plustwo,
    .name_udemy {
      width: 150px;
      font-size: 20px;
    }
  }

  .interview_container {
    padding: 50px;
    width: 100%;
    position: relative;
  }
  .training_btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #4a5a96;
    color: white;
    border: 1px solid #4a5a96;
    border-radius: 10px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height */
    display: flex;
    align-items: center;
    justify-content: center;

    width: 130px;
    height: 38px;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    :hover {
      transform: scale(1.05);
    }
  }

  .companies_select_title {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 38px;
    margin-bottom: 10px;
  }
  @media screen and (max-width: 709px) {
    .interview_container {
    }
    .companies_select_title {
      font-size: 25px;
    }
  }

  .placement_select_container {
    padding: 100px;
    width: 100%;
    position: relative;
  }

  .final_selection_btn {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;

    color: #ffffff;

    background: #4a5a96;
    border-radius: 10px;

    cursor: pointer;
  }

  .text_doyou {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 32px;
    line-height: 39px;
    /* identical to box height */

    color: #4a5a96;
    margin-bottom: 20px;
  }

  .yes_no_doyou {
    margin-bottom: 30px;
    input {
      width: 23px;
      height: 23px;
      margin-right: 5px;
    }
    label {
      font-family: "Montserrat";
      font-style: normal;
      font-weight: 400;
      font-size: 32px;
      line-height: 39px;
      /* identical to box height */
      margin-right: 20px;

      cursor: pointer;
      color: #000000;
    }
  }
  .confirm_doyou {
    width: 161px;
    height: 49px;
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;

    color: #ffffff;

    background: #4a5a96;
    border-radius: 10px;

    cursor: pointer;
  }

  @media screen and (max-width: 500px) {
    .text_doyou {
      font-size: 22px;
      margin-bottom: 0px;
    }
    .yes_no_doyou {
      align-items: center;
      margin-bottom: 10px;
      input {
        width: 15px;
        height: 15px;
      }
      label {
        font-size: 22px;
      }
    }
    .confirm_doyou {
      width: 101px;
      height: 35px;
      font-size: 18px;
    }
  }
  .level_exam_more_detail {
    position: relative;
    padding: 0 0 100px 0;
    max-width: 900px;
  }

  .notify {
    width: 180px;
    height: 53px;
    position: absolute;
    bottom: 0;
    right: 0;

    background: #4a5a96;
    border-radius: 5px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #ffffff;

    border: none;
    outline: none;
  }
  .progress_notify {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .exam_level_lemd {
    display: flex;
    margin-bottom: 30px;
  }
  .title_exam_level_lemd {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #000000;

    width: 250px;
    height: 29px;
  }

  .exam_level_lemd select {
    border: 1px solid #000000;
    border-radius: 10px;

    width: 56px;
    height: 34px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;

    color: #000000;

    background-color: white;
    cursor: pointer;
  }
  .exam_date_lemd {
    display: flex;
    margin-bottom: 30px;
  }
  .title_examdate_lemd {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #000000;

    width: 250px;
    height: 29px;
  }
  .requirements_lemd {
    display: flex;
    margin-bottom: 10px;
  }
  .title_require_lemd {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #000000;

    width: 250px;
    height: 29px;
  }
  .requirement_each_lemd input {
    border: 1px solid #000000;

    width: 12px;
    height: 12px;
  }
  .requirement_each_lemd label {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;

    color: #000000;

    width: 86px;
    height: 29px;
    margin-right: 20px;
  }

  .description_requirement_lemd textarea {
    width: 306px;
    height: 111px;

    border: 1px solid #000000;
    border-radius: 5px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;

    color: rgba(0, 0, 0, 0.6);

    margin-bottom: 30px;
    margin-left: 250px;
  }
  .exam_type_lemd {
    display: flex;
    margin-bottom: 30px;
  }
  .title_examtype {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #000000;

    width: 250px;
    height: 29px;
  }
  .examtype_each_lemd input {
    border: 1px solid #000000;

    width: 12px;
    height: 12px;
  }
  .examtype_each_lemd label {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;

    color: #000000;

    width: 86px;
    height: 29px;
    margin-right: 20px;
  }
  .exam_mode_lemd {
    display: flex;
  }
  .title_exammode {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #000000;

    width: 250px;
    height: 29px;
  }
  .exammode_each_lemd input {
    border: 1px solid #000000;

    width: 12px;
    height: 12px;
  }
  .exammode_each_lemd label {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;

    color: #000000;

    width: 86px;
    height: 29px;
    margin-right: 20px;
  }

  @media screen and (max-width: 1057px) {
    .placement_select_container {
      padding: 30px;
    }
    .final_selection_btn {
      font-size: 18px;
      padding: 5px;
    }
    .title_exam_level_lemd,
    .title_exammode,
    .title_examtype,
    .title_require_lemd,
    .title_examdate_lemd {
      width: 180px;
      height: 29px;
    }
    .description_requirement_lemd textarea {
      width: 206px;
      height: 71px;
      margin-left: 180px;
    }
    .notify {
      width: 120px;
      height: 43px;
      font-size: 20px;
    }
  }
  @media screen and (max-width: 515px) {
    .placement_select_container {
      padding: 50px 10px 10px;
    }

    .title_exam_level_lemd,
    .title_exammode,
    .title_examtype,
    .title_require_lemd,
    .title_examdate_lemd {
      width: 180px;
      height: 29px;

      font-size: 20px;
    }
    .exam_level_lemd select {
      font-size: 15px;
      width: 50px;
    }
    .exam_date_lemd {
      flex-direction: column;
    }
    .requirements_lemd {
      flex-direction: column;
    }
    .requirements_lemd {
      label {
        font-size: 20px;
      }
    }
    .requirement_each_lemd {
      margin-left: 30px;
    }
    .description_requirement_lemd textarea {
      margin-left: 30px;
    }
    .exam_type_lemd {
      flex-direction: column;
      .examtype_each_lemd {
        margin-left: 30px;
      }
      label {
        font-size: 20px;
      }
    }
    .exam_mode_lemd {
      flex-direction: column;
      .exammode_each_lemd {
        margin-left: 30px;
      }
      label {
        font-size: 20px;
      }
    }

    .notify {
      width: 80px;
      height: 33px;
      bottom: 50px;
      right: 50px;

      background: #4a5a96;
      border-radius: 5px;

      font-size: 20px;
      line-height: 29px;
    }
  }

  .education_details_container {
    padding: 30px;
  }
  .btech_details {
    margin-bottom: 50px;
  }
  .title_btech {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 34px;

    color: #4a5a96;

    margin-bottom: 15px;
  }
  .element_detail {
    display: flex;
    margin-bottom: 15px;
  }
  .pending_response {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #000000;
  }
  .title_element {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #000000;

    width: 300px;
  }
  .content_btech {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;

    color: #000000;
  }
  .sslc,
  .plustwo {
    position: relative;
  }
  .sslc .view {
    position: absolute;
    top: 88px;
    left: 400px;
  }
  .plustwo .view {
    position: absolute;
    top: 105px;
    left: 400px;
  }
  @media screen and (max-width: 769px) {
    .education_details_container {
      padding: 10px;
    }
  }
  @media screen and (max-width: 533px) {
    .title_btech {
      font-size: 24px;
    }
    .title_element {
      font-size: 20px;
      width: 230px;
    }
    .content_btech {
      font-size: 20px;
    }
    .sslc .view {
      top: 0px;
      left: 230px;
    }
    .plustwo .view {
      top: 0px;
      left: 230px;
    }
  }
  @media screen and (max-width: 533px) {
    .education_details_container {
      padding: 5px;
    }
    .title_btech {
      font-size: 22px;
    }
    .sslc .view {
      top: 0px;
      left: 220px;
      width: 80px;
    }
    .plustwo .view {
      top: 0px;
      left: 220px;
      width: 80px;
    }
  }
  .title_block_7_mail_send {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 32px;
    line-height: 39px;
    /* identical to box height */

    color: #4a5a96;
    margin-bottom: 50px;
  }
  .subject {
    display: flex;
    margin-bottom: 50px;

    label {
      font-family: "Montserrat";
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      line-height: 29px;

      color: #000000;

      width: 165px;
      height: 29px;
    }
    textarea {
      border: 1px solid #000000;
      border-radius: 5px;

      width: 506px;
      height: 111px;

      font-family: "Montserrat";
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 24px;

      color: rgba(0, 0, 0, 0.6);
    }
  }
  .send_mail_basic {
    background: #4a5a96;
    border-radius: 5px;

    width: 150px;
    height: 53px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    color: #ffffff;
    display: flex;

    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  @media screen and (max-width: 937px) {
    .title_block_7_mail_send {
      font-size: 25px;
      margin-bottom: 20px;
    }
    .subject {
      label {
        font-size: 21px;
        width: 125px;
      }
      textarea {
        width: 306px;
      }
    }
    .send_mail_basic {
      width: 120px;
      height: 33px;

      font-size: 21px;
    }
  }
`;
