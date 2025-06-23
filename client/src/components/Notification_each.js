import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl, token } from "../data/api";
import loader_logo from "../assets/loader/onetouch_logo.png";
import { CircularProgress } from "@mui/material";
import Cookies from "universal-cookie";



const Notification_each = () => {
  const location = useLocation();

  const [notification, setnotification] = useState([]);

  const cookies = new Cookies();

  const navigate = useNavigate();

  const [loader, setloader] = useState(false);
  const [loader_btn, setloader_btn] = useState(false);

  const [name, setname] = useState();
  const [company_email, setcompany_email] = useState();
  const [role, setrole] = useState();
  const [response, setresponse] = useState(false);
  const [already_response, setalready_response] = useState();

  const [notification_id, setnotification_id] = useState();

  const getStudent = async () => {
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

      setcompany_email(res.data.email);
      setrole(res.data.Role);
      setnotification(
        res.data.notifications.filter(
          (element) => element._id === location.state.id
        )
      );
      res.data.notifications
        .filter((element) => element._id === location.state.id)
        .map((item) => setname(item.company_name));
      res.data.placement.map((item) => setalready_response(item.response));

      setloader(false);
    } catch (error) {
      console.log("error_notification", error);
      setloader(false);
    }
  };

  const sendResponse = async (not_id, company_id) => {
    try {
      setloader_btn(true);
      const res = await axios.post(
        apiUrl + `/mailsend/send_student_response`,
        {
          name,
          response,
          not_id,
          company_id,
          token: token
        },
        { withCredentials: true }
      );
      window.alert("send response successfully");
      setloader_btn(false);
      navigate("/notification");
    } catch (error) {
      console.log("send response frontend", error);
      setloader_btn(false);
    }
  };

  const sendResponseInterview = async (not_id, company_id) => {
    try {
      setloader_btn(true);
      const res = await axios.post(
        apiUrl + `/mailsend/send_student_response/interview`,
        {
          name,
          response,
          not_id,
          company_id,
          token: token
        },
        { withCredentials: true }
      );
      window.alert("send response successfully");
      setloader_btn(false);
      navigate("/notification");
    } catch (error) {
      console.log("send response frontend", error);
      setloader_btn(false);
    }
  };

  const viewChange = async (not_id) => {
    try {
      // we should use something while using post

      const res = await axios.post(
        apiUrl + `/simple/change_notification_view`,
        {
          not_id,
          token: token
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  viewChange(location.state.id);

  console.log(location.state.id);

  useEffect(() => {
    getStudent();
  }, []);

  return (
    <MainContainer>
      <Navbar role={false} />
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
        notification &&
        notification.map((item) => (
          <Container key={item._id} loader={loader}>
            <div className="title" style={{color: "#3F170E"}}>{item.company_name}</div>
            <div className="details">
              {item.role === 1 && item.date && (
                <div className="date">
                  <div className="date_title">Date</div>
                  <div className="date_content">{item.date}</div>
                </div>
              )}
              {item.role === 1 && item.level_of_placement ? (
                <div className="date">
                  <div className="date_title">Level</div>
                  <div className="date_content">{item.level_of_placement}</div>
                </div>
              ) : (
                item.role === 1 && (
                  <div className="question_title font-extrabold text-2xl text-green-700 bg-green-200 p-4 rounded-xl  text-center">
                    🎉 Congratulations! You have been selected as an employee! 🎉
                  </div>

                )
              )}
              {item.role === 1 && item.type_exam && (
                <div className="date">
                  <div className="date_title">Exam Type</div>
                  <div className="date_content">{item.type_exam}</div>
                </div>
              )}
              {item.role === 1 && item.mode && (
                <div className="date">
                  <div className="date_title">Exam Mode</div>
                  <div className="date_content">{item.mode}</div>
                </div>
              )}
              {item.role === 1 && item.requirements[0] && (
                <div className="date">
                  <div className="date_title">Requirements</div>
                  <div className="date_content">
                    {item.requirements &&
                      item.requirements.map((require) => {
                        return <>{require.laptop && "laptop"}</>;
                      })}
                    {item.requirements &&
                      item.requirements.map((require) => {
                        return <>{require.internet && ","}</>;
                      })}
                    {item.requirements &&
                      item.requirements.map((require) => {
                        return <>{require.internet && "internet"}</>;
                      })}
                  </div>
                </div>
              )}
              {item.role === 1 && item.requirements[0] && (
                <div className="date">
                  <div className="date_title">Meeting Link</div>
                  <div className="date_content">
                    {item.requirements &&
                      item.requirements.map((require) => {
                        return <p>{require.more}</p>;
                      })}
                  </div>
                </div>
              )}
              {item.role === 1 && (
                <div className="question">
                  <div className="question_title">Do you want to accept?</div>
                  <div className="input_accept_reject">
                    <input
                      type="radio"
                      name="response"
                      id="accept"
                      checked={response === true}
                      onChange={() => setresponse(true)}
                    />
                    <label htmlFor="accept">Yes</label>
                    <input
                      type="radio"
                      name="response"
                      id="reject"
                      checked={response === false}
                      onChange={() => setresponse(false)}
                    />
                    <label htmlFor="reject">No</label>
                  </div>
                  {item.response ? (
                    <button
                      className="confirm"
                      onClick={() => window.alert("you already responded")}
                    >
                      Responded
                    </button>
                  ) : loader_btn ? (
                    <CircularProgress className="circular_progress" />
                  ) : (
                    item.requirements[0] ?
                    <>
                    <button
                      className="confirm"
                      onClick={() => sendResponseInterview(item._id, item.company_id)}
                      >
                      Confirm
                    </button>
                      </>
                      :
                      <>
                    <button
                      className="confirm"
                      onClick={() => sendResponse(item._id, item.company_id)}
                      >
                      Confirm
                    </button>
                      </>
                  )}
                </div>
              )}
              {(item.role === 2 ||
                item.role === 3 ||
                item.role === 4 ||
                item.role === 5) && (
                  <>
                    <div className="task-card">
  <div className="task-item">
    <h3 className="task-title">Task:</h3>
    <p className="task-content">{item.subject}</p>
  </div>

  {item.deadline && (
    <div className="task-item">
      <h3 className="task-title">⏳ Deadline:</h3>
      <p className="task-content deadline">{item.deadline}</p>
    </div>
  )}
</div>

                  </>
                )}
            </div>
          </Container>
        ))
      )}
    </MainContainer>
  );
};

export default Notification_each;



const MainContainer = styled.div`
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

const Container = styled.div`
  padding: 50px;

  .title {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 49px;
    /* identical to box height */

    color: #4a5a96;
  }
  .details {
    padding: 40px 100px;
  }
  .date {
    display: flex;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  .date_title {
    width: 333px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 39px;
    /* identical to box height */

    color: #000000;
  }
  .date_content {
    max-width: 700px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 25px;
    line-height: 39px;
    /* identical to box height */

    color: #000000;
    margin-left: 10px;
  }
  .question {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    max-width: 600px;
    padding: 50px 0;
  }
  .confirm {
    position: absolute;
    bottom: 0;
    right: 0;
    border: none;
    outline: none;

    background: #4a5a96;
    border-radius: 10px;

    width: 141px;
    height: 39px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 22px;
    line-height: 29px;

    color: #ffffff;
  }
  .circular_progress {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .question_title {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 39px;
    /* identical to box height */

    color: #000000;

    margin-right: 50px;
  }
  .input_accept_reject input {
    width: 13px;
    height: 13px;
    cursor: pointer;
  }
  .input_accept_reject label {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 25px;
    line-height: 39px;
    margin-right: 10px;
    /* identical to box height */

    color: #000000;
    cursor: pointer;
  }
  @media screen and (max-width: 861px) {
    padding: 10px;
    .title {
      font-size: 30px;
      text-align: center;
    }
    .details {
      padding: 20px 10px;
      margin: 0 auto;
    }
    .date {
      margin-bottom: 10px;
    }
    .date_title {
      font-size: 20px;
      width: 233px;
    }
    .date_content {
      font-size: 20px;
    }
    .question {
      padding: 50px 0;
    }
    .question_title {
      font-size: 20px;
    }
    .input_accept_reject label {
      font-size: 20px;
    }
    .confirm {
      width: 101px;
      height: 32px;
      font-size: 20px;
    }
  }
`;