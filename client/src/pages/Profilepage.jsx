import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import profile from "../assets/profile_dummy/profile1.png";
import bg1 from "../assets/profilepage/bg1.svg";
import loader_logo from "../assets/loader/onetouch_logo.png";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Buffer } from "buffer";
import { api, apiUrl, token } from "../data/api";
import Navbar from "../components/Navbar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GeneratePdf from "./generatePdf";
import Cookies from "universal-cookie";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { borderColor } from "@mui/system";

const Profilepage = () => {
  const [block, setblock] = useState(1);
  const [data, setdata] = useState();
  const [yes_no, setyes_no] = useState();
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [tasks, setTasks] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showResignModal, setShowResignModal] = useState(false);
  const [showModal, setShowModal] = useState(null);


  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [feedback, setfeedback] = useState([]);
  const [role, setrole] = useState(localStorage.getItem("role"));
  const [resignReason, setResignReason] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: null,
  });
  const profileRef = useRef();
  const [feedbacks, setFeedbacks] = useState([]);

  const [workHistory, setWorkHistory] = useState(null);
  const [showWorkHistoryModal, setShowWorkHistoryModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingWorkHistoryId, setUploadingWorkHistoryId] = useState(null);

  const [editData, setEditData] = useState({
    name: data?.name || "",
    phone: data?.phone || "",
    email: data?.email || "",
    address: data?.address || "",
    website: data?.website || "",
    dev_status: data?.coding?.[0]?.dev_status || "",
    profileImage: null,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (task) => {
    setShowModal(task); // Set the task for which the modal should open
  };
  
  const handleCloseModal = () => {
    setShowModal(null); // Close the modal
  };

  useEffect(() => {
    if (data) {
      setEditData({
        name: data?.name || "",
        phone: data?.phone || "",
        email: data?.email || "",
        address: data?.address || "",
        website: data?.website || "",
        dev_status: data?.coding?.[0]?.dev_status || "",
        profileImage: null,
        token: token,
      });
    }
  }, [data]);

  console.log(data?.coding?.[0]?.dev_status);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleFileChangeedit = (e) => {
    setEditData({ ...editData, profileImage: e.target.files[0] });
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.keys(editData).forEach((key) => {
      if (key === "profileImage" && editData.profileImage) {
        console.log(editData.profileImage);

        formData.append("profile", editData.profileImage);
      } else {
        formData.append(key, editData[key]);
      }
    });

    try {
      await axios.put(`${apiUrl}/update/update-profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile!");
    }
  };

  useEffect(() => {
    axios
      .get(apiUrl + "/companies") // Backend API endpoint
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
    axios
      .post(
        apiUrl + "/feedback/get_feedback",
        { token },
        { withCredentials: true }
      ) // Backend API endpoint
      .then((response) => {
        setfeedback(response.data.feedbacks);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
  }, []);

  const fetchWorkHistory = async () => {
    try {
      const res = await axios.get(apiUrl + `/work-history/${data._id}`, {
        withCredentials: true,
      });
      setWorkHistory(res.data.workHistory);
      console.log(res.data.workHistory);
    } catch (error) {
      console.log("Error fetching work history:", error);
    }
  };

  const uploadFileForWorkHistory = async (workHistoryId) => {
    try {
      if (!selectedFile) return alert("Please select a file.");
      const formData = new FormData();
      formData.append("profile", selectedFile);
      formData.append("token", token);

      await axios.post(
        apiUrl + `/work-history/upload/${workHistoryId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("File uploaded successfully.");
      fetchWorkHistory();
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };
  const handleResign = async () => {
    if (!resignReason.trim()) {
      alert("Please provide a reason for resignation.");
      return;
    }

    try {
      const response = await axios.post(apiUrl + "/mailsend/resign", {
        resignReason,
        companyId: data?.company_id, // Assuming you have companyId in your component state
        token,
      });

      if (response.data.success) {
        alert("You have send your resignation successfully.");
      } else {
        alert(response.data.message || "Resignation failed.");
      }
    } catch (error) {
      console.error("Error resigning:", error);
      alert("Error resigning. Please try again.");
    }

    setShowResignModal(false);
  };

  const handleDownloadPDF = async () => {
    const element = profileRef.current;
    const canvas = await html2canvas(element, { scale: 2 }); // High resolution
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("profile.pdf");
  };

  const callNavbar = async () => {
    try {
      setloader(true);

      const res = await axios.post(
        apiUrl + `/getData`,
        {
          token,
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data;

      setdata(res.data);

      if (!res.data.education[0] && res.data.Role == 0) {
        navigate("/infoform");
      }

      if (res.status !== 200) {
        throw new Error(res.error);
      }
      setloader(false);
    } catch (e) {
      console.log("error", e);
      // navigate("/login");
      setloader(false);
    }
  };

  console.log(data);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(apiUrl + "/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleApplyJob = async (jobId, compid) => {
    try {
      const response = await axios.post(apiUrl + "/jobs/apply", {
        jobId,
        compid,
        token: token,
      });
      console.log("Job application submitted:", response.data);
      window.alert("Job application submitted:", response.data);

      // Optionally, you can update state or perform other actions after successful submission
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  const handleViewProfile = (com_id) => {
    navigate("/profile_emp_want", { state: { id: com_id } });
  };

  console.log(data);

  const getTasks = async () => {
    try {
      const res = await axios.post(
        apiUrl + `/tasks/get_tasks/self`,
        { token },
        { withCredentials: true }
      );

      console.log(res.data.tasks);

      setTasks(res.data.tasks);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    callNavbar();
    getTasks();
    fetchWorkHistory();
    getFeedback();
  }, []);

  const getFeedback = async () => {
    try {
      console.log("getFeedback");

      const res = await axios.post(
        apiUrl + `/feedback/get_feedback`,
        { employee_id: data?._id, token },
        { withCredentials: true }
      );
      setFeedbacks(res.data.feedbacks);
    } catch (error) {
      console.log("Error fetching feedback:", error);
    }
  };

  console.log(feedbacks);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (task) => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("taskFile", file);
    formData.append("task_id", task._id);
    formData.append("token", token);

    try {
      setUploading(true);
      const response = await axios.post(
        apiUrl + "/tasks/upload_task_file",
        formData,
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message);


      alert(response.data.message);
    } catch (error) {
      setMessage("Error uploading file.");
    } finally {
      setUploading(false);
      setFile(null);
      setShowModal(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setEditForm((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("email", editForm.email);
    formData.append("phone", editForm.phone);
    if (editForm.profileImage) {
      formData.append("profile", editForm.profileImage);
    }
    formData.append("token", token);

    try {
      const response = await axios.post(apiUrl + "/updateProfile", formData, {
        withCredentials: true,
      });
      alert("Profile updated successfully!");
      setShowEditModal(false);
      callNavbar();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="main">
      <Navbar />
      <Container bg={bg1} block={block} loader={loader}>
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
              className="left"
              style={{
                backgroundColor: "rgb(249, 227, 187)",
                padding: "20px",
                borderRadius: "0px",
                minHeight: "2000px", // Allows content to expand dynamically
                overflow: "auto", // Enables scrolling if needed
              }}
              
            >
              <div className="profile_buttons">
                {data?.Role == "0" && (
                  <>
                    <div className="d-grid gap-2">
                      <button
                        className="btn mb-2"
                        style={{
                          backgroundColor: "#ffc107",
                          color: "black",
                          borderColor: "#ffc107",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "orange";
                          e.target.style.color = "black";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#ffc107";
                          e.target.style.color = "black";
                        }}
                        onClick={() => setblock(1)}
                      >
                        Profile
                      </button>

                      <button
                        className="btn mb-2"
                        style={{
                          backgroundColor: "#ffc107",
                          color: "black",
                          borderColor: "#ffc107",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "orange";
                          e.target.style.color = "black";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#ffc107";
                          e.target.style.color = "black";
                        }}
                        onClick={() => setblock(8)}
                      >
                        Tasks
                      </button>

                      <button
                        className="btn mb-2"
                        style={{
                          backgroundColor: "#ffc107",
                          color: "black",
                          borderColor: "#ffc107",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "orange";
                          e.target.style.color = "black";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#ffc107";
                          e.target.style.color = "black";
                        }}
                        onClick={() => setblock(10)}
                      >
                        Requests
                      </button>

                      <button
                        className="btn mb-2"
                        style={{
                          backgroundColor: "#ffc107",
                          color: "black",
                          borderColor: "#ffc107",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "orange";
                          e.target.style.color = "black";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#ffc107";
                          e.target.style.color = "black";
                        }}
                        onClick={() => setblock(7)}
                      >
                        Vacancies
                      </button>

                      <button
                        className="btn mb-2"
                        style={{
                          backgroundColor: "#ffc107",
                          color: "black",
                          borderColor: "#ffc107",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "orange";
                          e.target.style.color = "black";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#ffc107";
                          e.target.style.color = "black";
                        }}
                        onClick={() => setblock(9)}
                      >
                        Companies
                      </button>

                      <button
                        className="btn mb-2"
                        style={{
                          backgroundColor: "#ffc107",
                          color: "black",
                          borderColor: "#ffc107",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "orange";
                          e.target.style.color = "black";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#ffc107";
                          e.target.style.color = "black";
                        }}
                        onClick={() => setblock(11)}
                      >
                        Work History
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="right">
              {block === 13 && (
                <div className="profile_container" ref={profileRef}>
                  {role === 0 && (
                    <a
                      href={api + data?.resume}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                      className="training_btn"
                    >
                      Resume
                    </a>
                  )}

                  <div className="email_container style_profile_elements_bold">
                    <div className="width_profile_elements">Email</div>
                    <div className="user_name style_profile_elements_light">
                      {data && data.email}
                    </div>
                  </div>
                  <div className="email_container style_profile_elements_bold">
                    <div className="width_profile_elements">Phone Number</div>
                    <div className="user_name style_profile_elements_light">
                      {data && data.phone}
                    </div>
                  </div>
                  {data?.Role === 0 && (
                    <>
                      <div className="current_status style_profile_elements_bold">
                        <div className="width_profile_elements">
                          Current status
                        </div>
                        <div className="status style_profile_elements_light">
                          {data?.current_status === 1
                            ? `Working at ${data.company_name}`
                            : `Unemployed`}
                        </div>
                        {data?.current_status === 1 && (
                          <button
                            className="resign_btn view"
                            onClick={() => setShowResignModal(true)}
                          >
                            Resign
                          </button>
                        )}
                      </div>

                      <div className="extend" style={{ display: "flex" }}>
                        <div
                          className="edu_btn"
                          style={{ marginRight: "10px" }}
                          onClick={() => setblock(6)}
                        >
                          Education
                        </div>
                        <div className="skills_btn" onClick={() => setblock(2)}>
                          Skills
                        </div>
                      </div>
                    </>
                  )}
                  {data?.Role === 1 && (
                    <>
                      <div className="email_container style_profile_elements_bold">
                        <div className="width_profile_elements">Address</div>
                        <div className="user_name style_profile_elements_light">
                          {data && data.address}
                        </div>
                      </div>
                      <div className="email_container style_profile_elements_bold">
                        <div className="width_profile_elements">Website</div>
                        <div className="user_name style_profile_elements_light">
                          {data && data.website}
                        </div>
                      </div>
                      <div className="email_container style_profile_elements_bold">
                        <div className="width_profile_elements">Email</div>
                        <div className="user_name style_profile_elements_light">
                          {data && data.website}
                        </div>
                      </div>
                      <div className="email_container style_profile_elements_bold">
                        <div className="width_profile_elements">
                          Phone Number
                        </div>
                        <div className="user_name style_profile_elements_light">
                          {data && data.phone}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              {block === 1 && (
                <div className="container mt-4">
                  <div className="row justify-content-center">
                    <div className="col-md-10">
                      <div className="card shadow-lg border-0 rounded-4">
                        {data?.current_status == 1 && (
                          <button
                            className="btn position-absolute top-0 end-0 m-3"
                            style={{
                              backgroundColor: "red",
                              borderColor: "red",
                              color: "white",
                              transition: "0.3s ease-in-out",
                              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                            }}
                            onMouseOver={(e) =>
                            (e.target.style.boxShadow =
                              "0 0 15px rgba(255, 0, 0, 0.8)")
                            }
                            onMouseOut={(e) =>
                            (e.target.style.boxShadow =
                              "0 0 10px rgba(0, 0, 0, 0.2)")
                            }
                            onClick={() => setShowResignModal(true)}
                          >
                            Resign
                          </button>
                        )}
                        <div className="card-body p-4">
                          <div className="row align-items-center">
                            <div className="col-md-4 text-center">
                              <img
                                src={
                                  data?.profile ? api + data.profile : profile
                                }
                                alt="Profile"
                                className="rounded-circle img-fluid shadow-sm"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  border: "3px solid #FF8C00", // Orange border
                                }}
                              />

                              <h4 className="mt-3 fw-bold text-dark">
                                {data?.name}
                              </h4>
                              <button
                                className="btn position-absolute top-0 start-0 m-3"
                                style={{
                                  backgroundColor: "#D56A34",
                                  borderColor: "#D56A34",
                                  color: "white",
                                  transition: "0.3s ease-in-out",
                                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                                }}
                                onMouseOver={(e) =>
                                (e.target.style.boxShadow =
                                  "0 0 15px #D56A34")
                                }
                                onMouseOut={(e) =>
                                (e.target.style.boxShadow =
                                  "0 0 10px rgba(0, 0, 0, 0.2)")
                                }
                                onClick={() => setShowEditModal(true)}
                              >
                                Edit Profile
                              </button>

                              <span
                                className={`badge ${data?.current_status == 1
                                    ? "bg-success"
                                    : "bg-secondary"
                                  }`}
                              >
                                {data?.current_status == 1
                                  ? "Working Professional"
                                  : data?.Role == 0
                                    ? "Unemployed"
                                    : ""}
                              </span>
                            </div>

                            <div className="col-md-8">
                              <h5
                                className="fw-bold"
                                style={{ color: "#D56A34" }}
                              >
                                Profile Information
                              </h5>

                              <hr />
                              <div className="row">
                                <div className="col-sm-6 mb-3">
                                  <i
                                    className="bi bi-envelope-fill me-2"
                                    style={{ color: "#D56A34" }}
                                  ></i>
                                  <strong>Email:</strong> <br />
                                  <span className="text-muted">
                                    {data?.email}
                                  </span>
                                </div>
                                {role == 0 && (
                                  <>
                                    <a
                                      href={api + data?.resume}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn"
                                      style={{
                                        width: "200px",
                                        height: "40px",
                                        color: "black", // Orange text
                                        border: "2px solid #FF8C00", // Orange border
                                        backgroundColor: "transparent", // Transparent background
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        lineHeight: "36px",
                                        transition: "0.3s",
                                      }}
                                      onMouseOver={(e) =>
                                      (e.target.style.backgroundColor =
                                        "#FF8C00")
                                      }
                                      onMouseOut={(e) =>
                                      (e.target.style.backgroundColor =
                                        "transparent")
                                      }
                                    >
                                      View Resume
                                    </a>
                                  </>
                                )}
                                <div className="col-sm-6 mb-3">
                                  <i
                                    className="bi bi-telephone-fill me-2"
                                    style={{ color: "#D56A34" }}
                                  ></i>
                                  <strong>Phone:</strong> <br />
                                  <span className="text-muted">
                                    {data?.phone}
                                  </span>
                                </div>
                                {data?.Role === 0 && (
                                  <div className="col-sm-12 mb-3">
                                    <i
                                      className="bi bi-briefcase-fill me-2"
                                      style={{ color: "#D56A34" }}
                                    ></i>
                                    <strong>Current Status:</strong> <br />
                                    <span className="text-muted">
                                      {data?.current_status == 1
                                        ? `Working at ${data.company_name}`
                                        : "Unemployed"}
                                    </span>
                                  </div>
                                )}
                                {data?.Role === 1 && (
                                  <>
                                    <div className="col-sm-6 mb-3">
                                      <i className="bi bi-house-fill  me-2" style={{ color: "rgb(204, 117, 73)" }}></i>
                                      <strong>Address:</strong> <br />
                                      <span className="text-muted">
                                        {data?.address}
                                      </span>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                      <i className="bi bi-globe  me-2" style={{ color: "rgb(204, 117, 73)" }}></i>
                                      <strong>Website:</strong> <br />
                                      <span className="text-muted">
                                        {data?.website}
                                      </span>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                      <i className="bi bi-chat-quote  me-2" style={{ color: "rgb(204, 117, 73)" }}></i>
                                      <strong>Tagline:</strong> <br />
                                      <span className="text-muted">
                                        {data?.tagline}
                                      </span>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                      <i className="bi bi-info-circle  me-2" style={{ color: "rgb(204, 117, 73)" }}></i>
                                      <strong>About:</strong> <br />
                                      <span className="text-muted">
                                        {data?.about}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>

                              {data?.coding?.[0] && (
                                <div className="mt-3">
                                  <h6
                                    className="fw-bold"
                                    style={{ color: "#D56A34" }}
                                  >
                                    Skills:
                                  </h6>

                                  <ul className="">
                                    {data.coding[0].languages?.map(
                                      (item, index) =>
                                        item.language_name &&
                                          item.language_name !== "null" ? (
                                          <>
                                            <strong key={index} className="">
                                              {item.language_name} :{" "}
                                              {item.language_level ||
                                                "Beginner"}
                                            </strong>
                                            <br />
                                          </>
                                        ) : null
                                    )}
                                  </ul>
                                  <div className="mt-2">
                                    {data.coding[0].dev_status &&
                                      data.coding[0].dev_status !==
                                      "undefined" ? (
                                      <span
                                        className="badge"
                                        style={{
                                          backgroundColor: "#D56A34",
                                          color: "white",
                                        }}
                                      >
                                        Job Title - {data.coding[0].dev_status}
                                      </span>
                                    ) : (
                                      <span
                                        className="badge"
                                        style={{
                                          backgroundColor: "darkorange",
                                          color: "white",
                                        }}
                                      >
                                        Not a Developer
                                      </span>
                                    )}
                                  </div>
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
              {showEditModal && (
                <div className="modal d-block">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Profile</h5>
                        <button
                          className="btn-close"
                          onClick={() => setShowEditModal(false)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              value={editData.name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input
                              type="text"
                              name="phone"
                              className="form-control"
                              value={editData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              value={editData.email}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Profile Image</label>
                            <input
                              type="file"
                              className="form-control"
                              onChange={handleFileChangeedit}
                            />
                          </div>
                          {role == 1 && (
                            <>
                              <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                  type="text"
                                  name="address"
                                  className="form-control"
                                  value={editData.address}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Website</label>
                                <input
                                  type="text"
                                  name="website"
                                  className="form-control"
                                  value={editData.website}
                                  onChange={handleChange}
                                />
                              </div>
                            </>
                          )}

                          {role == 0 && (
                            <div className="mb-3">
                              <label className="form-label">
                                Development Status
                              </label>
                              <input
                                type="text"
                                name="dev_status"
                                className="form-control"
                                value={editData.dev_status}
                                onChange={handleChange}
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleEditSubmit}
                          >
                            Save Changes
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {block === 2 && (
                <div className="skills_container">
                  <div className="known_languages">Languages:</div>
                  <ul>
                    {data &&
                      data.coding[0] &&
                      data.coding[0].languages &&
                      data.coding[0].languages.map(
                        (item, index) =>
                          item.language_name &&
                          item.language_name !== "null" && (
                            <li key={index}>
                              {item.language_name} :{" "}
                              {item.language_level === "undefined"
                                ? "beginner"
                                : item.language_level}
                            </li>
                          )
                      )}
                  </ul>
                  {data &&
                    data.coding[0] &&
                    data.coding[0].dev_status &&
                    data.coding[0].dev_status !== "undefined" ? (
                    <div className="second_skill">
                      He is an {"\t"}
                      {data && data.coding[0] && data.coding[0].dev_status}
                    </div>
                  ) : (
                    <div className="second_skill">He is not a developer</div>
                  )}
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

              {block === 5 && (
                <div className="container mt-4">
                  <h2 className="text-center mb-4">
                    Past working history from previous project managers at the
                    time of resignation
                  </h2>
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
              {block === 7 && (
                <div className="interview_container">
                  <div className="companies_select_title" style={{ color: "#3F170E" }}><h2><i>Vacancies Available</i></h2></div>
                  <div className="companies_select">
  <JobListContainer className="d-flex flex-wrap justify-content-center">
    {jobs.map((job) => (
      <JobCard
        key={job._id}
        className="card shadow-lg p-4 mb-4 rounded-3 border-0 transition"
        style={{
          width: "350px",
          backgroundColor: "rgb(249, 227, 187)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
        }}
      >
        {/* Job Title in Orange */}
        <h4
          className="fw-bold text-center mb-2"
          style={{ color: "rgb(204, 117, 73)" }}
        >
          {job.jobTitle}
        </h4>
        <h6 className="text-muted text-center">{job.company_name}</h6>
        <p className="text-secondary mt-3">{job.jobDescription}</p>
        <p className="fw-semibold">💰 Salary: {job.salary}</p>
        <p className="fw-semibold">Experience Needed: {job.experience}</p>

        {/* Buttons Section */}
        <div className="d-flex justify-content-between mt-3">
          {/* Green Apply Button with Glow Effect */}
          <ApplyButton
            className="btn w-45"
            style={{
              backgroundColor: "#28a745",
              color: "#ffffff",
              transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = "0px 0px 15px #28a745")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = "none")
            }
            onClick={() => handleApplyJob(job._id, job.comp_id)}
          >
            ✅ Apply Job
          </ApplyButton>

          {/* Orange View Profile Button with Glow Effect */}
          <ApplyButton
            className="btn w-45"
            style={{
              backgroundColor: "rgb(204, 117, 73)",
              color: "#ffffff",
              transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = "0px 0px 15px rgb(204, 117, 73)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = "none")
            }
            onClick={() => handleViewProfile(job.comp_id)}
          >
            🔍 View Profile
          </ApplyButton>
        </div>
      </JobCard>
    ))}
  </JobListContainer>
</div>

                </div>
              )}
              {block === 8 && (
  <>
    <div className="container mt-4" ref={profileRef}>
      <h2 className="text-center mb-4" style={{ color: "#3F170E" }}>
        <i>Tasks Assigned</i>
      </h2>

      {tasks.length > 0 ? (
        <div className="row">
          {tasks
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .map((task, index) => (
              <div key={index} className="col-md-6 mb-4">
                {/* Task Card */}
                <div
                  className="card shadow-lg border-0 rounded-3 p-3"
                  style={{
                    backgroundColor: "#fff",
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div className="card-body">
                    {/* Company Name */}
                    <h5 className="card-title  fw-bold" style={{ color: "#3F170E" }}>
                       {task.company_id.name}
                    </h5>

                    {/* Task Details */}
                    <p className="fw-semibold text-dark mb-1">
                      <strong>📝 Task:</strong> {task.task_name}
                    </p>
                    <p className="text-muted mb-3">{task.task_description}</p>

                    {/* Deadline */}
                    <p className="mb-2">
                      <strong>📅 Deadline:</strong>{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>

                    {/* Status Badge */}
                    <p>
                      <strong>📌 Status:</strong>{" "}
                      <span
                        className={`badge ${task.status === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-success"
                          }`}
                      >
                        {task.status}
                      </span>
                    </p>

                    {/* Upload Button (Only for Pending Tasks) */}
                    {task.status === "Pending" && (
                      <button
                        className="btn w-100 fw-semibold"
                        style={{
                          backgroundColor: "rgb(17, 170, 25)",
                          color: "#fff",
                          transition: "box-shadow 0.3s ease-in-out",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.boxShadow = "0px 0px 15px rgb(105, 187, 49)")
                        }
                        onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
                        onClick={() => handleOpenModal(task)} // Pass the specific task
                        >
                        📤 Upload Completion File
                      </button>
                    )}

                    {/* View Uploaded File */}
                    {task.completion_file && (
                      <p className="mt-3 text-center">
                        <a
                          href={api + task.completion_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          📄 View Uploaded File
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {showModal && showModal._id === task._id && ( // Ensure the modal is for the correct task
  <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">📤 Upload Completion File</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleCloseModal} // Close only this modal
          ></button>
        </div>
        <div className="modal-body">
          <input
            type="file"
            className="form-control mb-3"
            onChange={handleFileChange}
          />
          <button
            className="btn btn-success w-100 fw-bold"
            onClick={() => handleUpload(task)}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

                {/* Message Notification */}
                
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-muted">No tasks available.</p>
      )}
    </div>
  </>
)}


{block === 9 && (
  <div className="container mt-5">
    {/* Title */}
    <h2 className="text-center fw-bold mb-4" style={{ color: "rgb(204, 117, 73)" }}>
      <i> Registered Companies</i>
    </h2>

    {/* Search Bar */}
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="🔍 Search for a company..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />
    </div>

    <div className="row">
      {filteredCompanies.length > 0 ? (
        filteredCompanies.map((company) => (
          <div key={company._id} className="col-md-4 mb-4">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "12px",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div className="card-body">
                <h5 className="card-title fw-bold " style={{color:"#3F170E"}}>
                  <i className="bi bi-building me-2"></i> {company.name}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  📧 {company.email}
                </h6>
                <p className="card-text">
                  📍 <strong>Location:</strong> {company.address || "Not Provided"}
                </p>

                {/* View Profile Button */}
                <ApplyButton
                  style={{
                    backgroundColor: "rgb(204, 117, 73)",
                    borderRadius: "8px",
                    padding: "8px 15px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    transition: "0.3s ease-in-out",
                    boxShadow: "0 0 10px rgba(204, 117, 73, 0.8)",
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 20px rgba(204, 117, 73, 1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 10px rgba(204, 117, 73, 0.8)")}
                  onClick={() => handleViewProfile(company._id)}
                >
                  🔍 View Profile
                </ApplyButton>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-danger fw-bold">
          ❌ No registered companies found.
        </p>
      )}
    </div>
  </div>
)}


{block === 10 && (
  <div className="container mt-4">
    {/* Work History Requests Button */}
    <button
      style={{
        backgroundColor: "rgb(204, 117, 73)",
        border: "none",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "16px",
        transition: "0.3s ease-in-out",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
      className="btn"
      onClick={fetchWorkHistory}
    >
       Work History Requests
    </button>

    {workHistory && workHistory.length > 0 ? (
      <div className="row mt-4">
        {workHistory.map((history, index) => (
          <div key={index} className="col-md-6">
            <div
              className="card border-0 shadow-lg p-3 mb-4"
              style={{
                borderRadius: "12px",
                background: "#fff",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div className="card-body">
                <h5 className="fw-bold ">
                  <i className="bi bi-building me-2"></i> {history.company_id.name}
                </h5>
                <p className="text-muted">
                  <i className="bi bi-briefcase me-2"></i> <strong>Job Title:</strong> {history.jobTitle}
                </p>
                <p>
                  <i className="bi bi-file-text me-2"></i> <strong>Description:</strong> {history.jobDescription}
                </p>
                <p>
                  <i className="bi bi-cash-stack me-2"></i> <strong>Salary:</strong> {history.salary}rs
                </p>
                <p>
                  <i className="bi bi-calendar-check me-2"></i> <strong>Date:</strong>{" "}
                  {new Date(history.createdAt).toLocaleDateString()}
                </p>
                <p className="fw-bold">
                  <i className="bi bi-info-circle me-2"></i> <strong>Status:</strong>{" "}
                  <span className={`badge ${history.status === "Approved" ? "bg-success" : "bg-warning"}`}>
                    {history.status}
                  </span>
                </p>

                {history.file && (
                  <p>
                    <a
                      href={`${api}uploads/${history.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      📂 View File
                    </a>
                  </p>
                )}

                {/* File Upload Section */}
                <div className="mt-3">
                  <label className="form-label fw-bold">Upload File:</label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                {/* Glowing Upload Button */}
                <button
                  className="btn mt-3 text-white glowing-btn"
                  style={{
                    backgroundColor: "rgb(86, 210, 41)",
                    borderRadius: "8px",
                    padding: "8px 15px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    transition: "0.3s ease-in-out",
                    boxShadow: "0 0 10px rgba(82, 204, 57, 0.8)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 20px rgb(53, 163, 30)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 10px rgba(97, 204, 73, 0.8)")}
                  onClick={() => uploadFileForWorkHistory(history._id)}
                >
                  📤 Upload File
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="alert alert-info mt-3 text-center">
        📌 No work history available.
      </div>
    )}
  </div>
)}


              {block === 11 && (
                <div className="container mt-5" ref={profileRef}>
                  <button
                    className="training_btn btn fw-bold text-white"
                    style={{ backgroundColor: "rgb(204, 117, 73)", border: "none" }}
                    onClick={handleDownloadPDF}
                  >
                    Download PDF
                  </button>


                  {/* Work History Header */}
                  <h2
                    className="text-center fw-bold my-4 py-2"
                    style={{ color: "#3F170E" }}
                  >
                    <i>Work History</i>
                  </h2>

                  {/* Work History Grid */}
                  <div className="row">
                    {feedback.length > 0 ? (
                      feedback.map((company) => (
                        <div key={company._id} className="col-md-4 mb-4">
                          <div
                            className="card border-0 shadow-lg"
                            style={{
                              backdropFilter: "blur(10px)",
                              background: "rgba(255, 255, 255, 0.1)",
                              borderRadius: "15px",
                              boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                              transition: "transform 0.3s ease-in-out",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          >
                            <div className="card-body">
                              <h5 className="fw-bold text-success">
                                <i className="bi bi-buildings-fill me-2"></i>
                                {company.company_id.name}
                              </h5>
                              <h6 className="card-subtitle mb-2 text-muted">
                                <i className="bi bi-clipboard-check me-2"></i>{" "}
                                Task: {company.title}
                              </h6>
                              <p className="text-dark">
                                <i className="bi bi-file-text me-2"></i>{" "}
                                {company.description}
                              </p>
                              <h6 className="card-subtitle mb-2">
                                ⭐ Rating:{" "}
                                <span className="badge bg-warning text-dark">
                                  {company.rating}/5
                                </span>
                              </h6>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-danger fw-bold">
                        No Feedbacks found.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>

      {/* Resignation Modal */}
      {showResignModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Resignation</h5>
                <button
                  type="button"
                  className="close btn btn-outline-secondary"
                  onClick={() => setShowResignModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to resign?</p>
                <div className="form-group">
                  <label htmlFor="resignationReason">
                    <strong>Reason for Resignation:</strong>
                  </label>
                  <textarea
                    id="resignationReason"
                    className="form-control mt-2"
                    rows="3"
                    placeholder="Enter your reason here..."
                    value={resignReason}
                    onChange={(e) => setResignReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={handleResign}
                  disabled={!resignReason.trim()} // Disables button if reason is empty
                >
                  Yes, Resign
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowResignModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profilepage;

const Container = styled.div`
  position: relative;
  .emergency {
    color: red;
    font-weight: bold;
    margin-left: 5px;
  }

  .task-item {
    border-bottom: 1px solid #ddd;
    padding: 10px;
  }

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
  .update_details_2 {
    position: absolute;
    right: 170px;
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
  @media screen and (max-width: 710px) {
    .update_details_2 {
      right: 0;
      left: 10px;
    }
  }
  @media screen and (max-width: 450px) {
    .update_details {
      font-size: 15px;
      width: 120px;
      height: 28px;
    }
    .update_details_2 {
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

    margin-bottom: 40px;
  }

  .profile_btn,
  .skills_btn,
  .certificate_btn,
  .interview_btn,
  .task_btn,
  .jobs_btn,
  .Select_stud_btn,
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

  .task_btn {
    margin-bottom: 20px;
    /* color: ${(props) => (props.block === 8 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 8 ? "#4a5a96" : "white")}; */
  }

  .certificate_btn {
    margin-bottom: 20px;
    /* color: ${(props) => (props.block === 3 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 3 ? "#4a5a96" : "white")}; */
  }
  .jobs_btn {
    margin-bottom: 20px;
    /* color: ${(props) => (props.block === 7 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 7 ? "#4a5a96" : "white")}; */
  }
  .Select_stud_btn {
    /* color: ${(props) => (props.block === 5 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 5 ? "#4a5a96" : "white")}; */
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
      margin-bottom: 20px;
    }
    .profile_btn,
    .skills_btn,
    .certificate_btn,
    .interview_btn,
    .jobs_btn,
    .Select_stud_btn,
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
    .jobs_btn,
    .Select_stud_btn,
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
  }
  .companies_select_title {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 38px;
    line-height: 46px;
    margin-bottom: 10px;
  }
  @media screen and (max-width: 709px) {
    .interview_container {
      padding: 20px;
    }
    .companies_select_title {
      font-size: 30px;
    }
  }

  .placement_select_container {
    padding: 100px;
    width: 100%;
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
      padding: 10px;
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
    padding: 40px;
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
`;

const JobListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const JobCard = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const JobName = styled.h2`
  margin-bottom: 10px;
`;

const CompanyName = styled.p`
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 22px;
`;

const JobDescription = styled.p``;

const Salary = styled.p``;

const Experience = styled.p`
  margin-top: 10px;
`;

const ApplyButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin: 5px;
`;
