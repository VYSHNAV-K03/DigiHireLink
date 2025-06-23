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



const Profilepage_emp_want = () => {
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

  const [exam_mode, setexam_mode] = useState("online");
  const [exam_type, setexam_type] = useState("written");

  const [subject, setsubject] = useState("");

  const location = useLocation();

  console.log(location.state.id);
  const id = location.state.id;
  const z = 0;

  const cookies = new Cookies();



  const fetchResignations = async () => {
    try {
      const response = await axios.post(
        apiUrl + "/mailsend/resignations",
        { token }, // Token in body

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


  
  useEffect(() => {
    getDataProfile();
    callNavbar();
    fetchResignations()
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

            <div className="right">
              {block === 1 && (
                <div className="container d-flex justify-content-center mt-5">
                  <div className="card shadow-lg border-0 rounded-4 animate__animated animate__fadeIn" style={{ width: "40rem", backgroundColor: "#ffffff" }}>
                    <div className="card-header bg-dark text-white text-center rounded-top-4 py-4">
                      <h3 className="mb-0">{data && data.name ? data.name : "Company Name"}</h3>
                      {/* <p className="mb-0 text-light">{data && data.tagline ? data.tagline : "Your Company Tagline Here"}</p> */}
                    </div>
                    <div className="card-body text-center">
                      <img
                        src={data && data.profile ? api + data.profile : profile}
                        alt="profile"
                        className="rounded-circle mb-4 border border-4 border-dark"
                        style={{ width: "130px", height: "130px", objectFit: "cover" }}
                      />
                      <div className="px-4">
                        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
                          <strong>Email:</strong>
                          <span className="text-secondary">{data && data.email}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
                          <strong>Phone:</strong>
                          <span className="text-secondary">{data && data.phone}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
                          <strong>Address:</strong>
                          <span className="text-secondary">{data && data.address}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center py-3">
                          <strong>Website:</strong>
                          <a href={data && data.website} target="_blank" rel="noopener noreferrer" className="text-dark fw-bold">
                            {data && data.website}
                          </a>
                        </div>
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
              {block === 4 && (
                <div className="interview_container">
                  {/* {(role === 2 || role === 3) && (
                    <div className="training_btn" onClick={() => setblock(8)}>
                      Verification
                    </div>
                  )} */}
                  <div className="companies_select_title">Previous Experiences</div>
                  <div className="companies_select">
                    <ul>
                      {data?.experience?.length > 0 ? (
                        data.experience.map((item, index) => (
                          <li key={index} className="experience_item">
                            <h3 className="company_name">{item.company_name}</h3>
                            <p>
                              <strong>Start Date:</strong> {new Date(item.start_date).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>End Date:</strong> {item.end_date
                                ? new Date(item.end_date).toLocaleDateString()
                                : "Present"}
                            </p>
                          </li>
                        ))
                      ) : (
                        <p>No previous experiences available.</p>
                      )}
                    </ul>
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
                        </div> <div className="element_detail">
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
                            <a className="view" href={api + data.education[0].certificate}>
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
                <div className="placement_select_container">
                  {data &&
                    data.placement.filter(
                      (element) => element.company_id === rootId
                    )[0] ? (
                    data.placement
                      .filter((element) => element.company_id === rootId)
                      .map((item) =>
                        item.response === 0 ? (
                          <div className="pending_response" key={item._id}>
                            Mail send successfully . please wait for his
                            response
                          </div>
                        ) : (
                          <div className="doyou" key={item._id}>
                            <div className="text_doyou">
                              Do you want to select this student?{" "}
                            </div>
                            <div className="yes_no_doyou">
                              <input
                                type="radio"
                                name="yesorno"
                                id="Yes"
                                checked={yes_no === true}
                                onChange={() => setyes_no(true)}
                              />
                              <label htmlFor="Yes">Yes</label>
                              <input
                                type="radio"
                                name="yesorno"
                                id="No"
                                checked={yes_no === false}
                                onChange={() => setyes_no(false)}
                              />
                              <label htmlFor="No">No</label>
                            </div>
                            {loader_addbtn ? (
                              <CircularProgress
                                style={{
                                  display: "flex",
                                }}
                              />
                            ) : (
                              <div className="confirm_doyou" onClick={SendMail}>
                                Confirm
                              </div>
                            )}
                          </div>
                        )
                      )
                  ) : (
                    <div className="doyou">
                      <div className="text_doyou">
                        post a job offer with job title, description, salary and required qualification to employee{" "}
                      </div>
                      <div className="yes_no_doyou">
                        <input
                          type="radio"
                          name="yesorno"
                          id="Yes"
                          checked={yes_no === true}
                          onChange={() => setyes_no(true)}
                        />
                        <label htmlFor="Yes">Yes</label>
                        <input
                          type="radio"
                          name="yesorno"
                          id="No"
                          checked={yes_no === false}
                          onChange={() => setyes_no(false)}
                        />
                        <label htmlFor="No">No</label>
                      </div>
                      {loader_addbtn ? (
                        <CircularProgress
                          style={{
                            display: "flex",
                          }}
                        />
                      ) : (
                        <div className="confirm_doyou" onClick={SendMail}>
                          Confirm
                        </div>
                      )}
                    </div>
                  )}
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
                          <p><strong>Reason:</strong> {resign.resignReason}</p>
                          <p><strong>Date:</strong> {new Date(resign.resignDate).toLocaleDateString()}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No resignation requests found.</p>
                  )}
                </div>
              )}
                         </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Profilepage_emp_want;


const Container = styled.div`
  position: relative;

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
    color: ${(props) => (props.block === 1 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 1 ? "#4a5a96" : "white")};
  }
  .skills_btn {
    margin-bottom: 20px;
    color: ${(props) => (props.block === 2 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 2 ? "#4a5a96" : "white")};
  }
  .edu_btn {
    margin-bottom: 20px;
    color: ${(props) => (props.block === 6 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 6 ? "#4a5a96" : "white")};
  }
  .interview_btn {
    margin-bottom: 20px;
    color: ${(props) => (props.block === 4 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 4 ? "#4a5a96" : "white")};
  }
  .certificate_btn {
    margin-bottom: 20px;
    color: ${(props) => (props.block === 3 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 3 ? "#4a5a96" : "white")};
  }
  .Select_stud_btn {
    color: ${(props) => (props.block === 5 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 5 ? "#4a5a96" : "white")};
  }
  .Select_stud_btn_college {
    color: ${(props) => (props.block === 7 ? "white" : "#4a5a96")};
    background: ${(props) => (props.block === 7 ? "#4a5a96" : "white")};
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