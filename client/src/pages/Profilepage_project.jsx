import React, { useState, useEffect } from "react";
import styled from "styled-components";
import profile from "../assets/profile_dummy/profile1.png";
import bg1 from "../assets/profilepage/bg1.svg";
import loader_logo from "../assets/loader/onetouch_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { api, apiUrl, token } from "../data/api";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";



const Profilepage_Project = () => {
  const [block, setblock] = useState(1);

  const [data, setdata] = useState();

  const [loader, setloader] = useState(false);

  const navigate = useNavigate();

  const [rootUserName, setrootUserName] = useState();

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    task_name: "",
    task_description: "",
    deadline: "",
  });


  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    title: "",
    description: "",
    rating: "",
  });

  // React Frontend Update
  const [workHistory, setWorkHistory] = useState(null);
  const [showWorkHistoryModal, setShowWorkHistoryModal] = useState(false);


  const fetchWorkHistory = async () => {
    try {
      const res = await axios.get(apiUrl + `/work-history/${id}`, { withCredentials: true });
      setWorkHistory(res.data.workHistory);
      console.log(res.data.workHistory);
    } catch (error) {
      console.log("Error fetching work history:", error);
    }
  };

  const requestWorkHistory = async () => {
    try {
      await axios.post(apiUrl + "/work-history/request", { employee_id: id, token }, { withCredentials: true });
      alert("Request Sent!");
      fetchWorkHistory();
    } catch (error) {
      console.log("Error requesting work history:", error);
    }
  };
  const location = useLocation();

  console.log(location.state.id);
  const id = location.state.id;
  const z = 0;

  const cookies = new Cookies();

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

      if (res.status !== 200) {
        throw new Error(res.error);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  console.log(rootUserName);

  const getTasks = async () => {
    try {
      const res = await axios.post(
        apiUrl + `/tasks/get_tasks`,
        { employee_id: id },
        { withCredentials: true }
      );

      console.log(res.data.tasks);

      setTasks(res.data.tasks);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };



  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const uploadTask = async () => {
    if (!newTask.task_name || !newTask.task_description || !newTask.deadline) return;

    try {
      await axios.post(apiUrl + `/tasks/upload_task`, {
        employee_id: id,
        task_name: newTask.task_name,
        task_description: newTask.task_description,
        deadline: newTask.deadline,
        token
      });

      setNewTask({ task_name: "", task_description: "", deadline: "" });
      setShowModal(false);
      getTasks();
    } catch (error) {
      console.log("Error uploading task:", error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.put(apiUrl + `/tasks/update-status/${taskId}`, { status: newStatus });
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === taskId ? { ...task, status: newStatus } : task))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  console.log(data);
  console.log(id);



  useEffect(() => {
    getDataProfile();
    callNavbar();
    getTasks();
    getFeedback();
    fetchWorkHistory();
  }, []);


  const getFeedback = async () => {
    try {
      console.log("getFeedback");


      const res = await axios.post(apiUrl + `/feedback/get_feedback/company/comp`, { employee_id: id, token }, { withCredentials: true });
      setFeedbacks(res.data.feedbacks);
    } catch (error) {
      console.log("Error fetching feedback:", error);
    }
  };

  const uploadFeedback = async () => {
    if (!newFeedback.title || !newFeedback.description || !newFeedback.rating) return;
    try {
      console.log("feedback upload", id);
      await axios.post(apiUrl + `/feedback/upload_feedback`, {
        employee_id: id,
        title: newFeedback.title,
        description: newFeedback.description,
        rating: newFeedback.rating,
        token
      });
      setNewFeedback({ title: "", description: "", rating: "" });
      setShowFeedbackModal(false);
      getFeedback();
    } catch (error) {
      console.log("Error uploading feedback:", error);
    }
  };


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
              {/* <img src={loader_logo} alt="" /> */}
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
    backgroundColor: "rgb(249, 227, 187)",
    borderRadius: "10px",
    height: "2000vh", // Takes full viewport height
    position: "sticky",
    top: "0",
    width: "250px", // Adjust width as needed
    overflowY: "auto",
  }}
>
  <div className="profile_buttons d-flex flex-column">
    {["Profile", "Tasks", "Work History"].map((text, index) => (
      <div
        key={index}
        className="profile_btn text-center p-2 mb-2 rounded"
        style={{
          backgroundColor: "rgb(245, 181, 19)", // Yellow color
          color: "black",
          cursor: "pointer",
          transition: "background-color 0.3s ease-in-out",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "orange")} // Orange on hover
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(245, 181, 19)")} // Yellow when not hovered
        onClick={() => setblock(index + 1)}
      >
        {text}
      </div>
    ))}
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
  style={{ width: "150px", height: "150px", borderColor: "rgb(204, 117, 73)" }}
/>

                              <h4 className="mt-3 fw-bold">{data?.name}</h4>
                              <span className="badge bg-success">
                                {data?.current_status === 1 ? "Working Professional" : "Student"}
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
                                <i className="bi bi-envelope-fill me-2" style={{ color: "rgb(204, 117, 73)" }}></i>

                                  <strong>Email:</strong> <br />
                                  <span className="text-muted">{data?.email}</span>
                                </div>

                                <div className="col-sm-6 mb-3">
                                  <i className="bi bi-telephone-fill  me-2" style={{ color: "rgb(204, 117, 73)" }}></i>
                                  <strong>Phone:</strong> <br />
                                  <span className="text-muted">{data?.phone}</span>
                                </div>

                                <div className="col-sm-12 mb-3">
                                  <i className="bi bi-briefcase-fill  me-2" style={{ color: "rgb(204, 117, 73)" }}></i>
                                  <strong>Current Status:</strong> <br />
                                  <span className="text-muted">
                                    {data?.current_status === 1
                                      ? `Working at ${data.company_name}`
                                      : `Student @ ${data?.education?.[0]?.institution_name || ''}`}
                                  </span>
                                </div>

                                
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}


              {block === 2 && (
                <div className="container mt-4">
                  <div className="card shadow-lg">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className=" fw-bold" style={{color: "#3F170E"}}><i>Assign Tasks</i> </h4>
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>
                          <i className="bi bi-upload me-1"></i> Upload New Task
                        </button>
                      </div>
                      <hr />

                      {tasks.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead className="table-dark">
                              <tr>
                                <th>No</th>
                                <th>Company</th>
                                <th>Task</th>
                                <th>Description</th>
                                <th>Deadline</th>
                                <th>View file</th>
                                <th>Status</th>
                                <th>Action</th>


                              </tr>
                            </thead>
                            <tbody>
                              {tasks
                                .filter((task) => task.company_id._id === data.company_id)
                                .map((task, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{task.company_id.name}</td>
                                    <td>{task.task_name}</td>
                                    <td>{task.task_description}</td>
                                    <td>{new Date(task.deadline).toLocaleDateString()}</td>
                                    <td><a href={api + task.completion_file}>
                                      View
                                    </a></td>

                                    <td>
                                      <span
                                        className={`badge ${task.status === "Pending" ? "bg-warning" : "bg-success"
                                          }`}
                                      >
                                        {task.status}
                                      </span>
                                    </td>
                                    <td>
                                      <button
                                        className={`btn ${task.status === "Pending" ? "btn-outline-success" : "btn-outline-warning"
                                          } btn-sm`}
                                        onClick={() =>
                                          updateTaskStatus(
                                            task._id,
                                            task.status === "Pending" ? "Completed" : "Pending"
                                          )
                                        }
                                      >
                                        {task.status === "Pending" ? "Mark as Completed" : "Mark as Pending"}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-muted text-center">No tasks available.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {block === 3 && (
                <div className="container mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="" style={{color:"#3F170E"}}><i>Work History</i></h2>
                    <button className="btn btn-success" onClick={() => setShowFeedbackModal(true)}>
                      <i className="bi bi-plus-circle"></i> Upload Work History
                    </button>
                  </div>
                  {feedbacks.length > 0 ? (
  <div className="row">
    {feedbacks.map((feedback, index) => (
      <div key={index} className="col-md-6">
        <div 
          className="card mb-4 border-0 shadow-lg" 
          style={{ backgroundColor: "#fff", borderRadius: "12px" }} 
        >
          <div className="card-body">
            <h5 
              className="card-title fw-bold text-dark"
              style={{ borderBottom: "2px solid rgb(204, 117, 73)", paddingBottom: "5px" }}
            >
              {feedback.title}
            </h5>
            <p className="card-text text-muted">{feedback.description}</p>
            <div className="d-flex align-items-center">
              <span className="text-warning me-2">⭐</span>
              <strong className="text-dark">{feedback.rating}/5</strong>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="alert alert-warning text-center fw-bold">No feedback available.</div>
)}

                </div>
              )}




            </div>
          </div>
        )}
        {/* Task Upload Modal */}
      </Container>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload New Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Task Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="task_name"
                      placeholder="Enter task name"
                      value={newTask.task_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Task Description</label>
                    <textarea
                      className="form-control"
                      name="task_description"
                      placeholder="Enter task description"
                      rows="3"
                      value={newTask.task_description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      className="form-control"
                      name="deadline"
                      value={newTask.deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={uploadTask}>
                  <i className="bi bi-upload"></i> Upload
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-circle"></i> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {showFeedbackModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Upload WorkHistory</h5>
                <button type="button" className="btn-close" onClick={() => setShowFeedbackModal(false)}></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Task Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder="Enter Title"
                    value={newFeedback.title}
                    onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Feedback</label>
                  <textarea
                    className="form-control"
                    name="description"
                    placeholder="Enter Description"
                    rows="3"
                    value={newFeedback.description}
                    onChange={(e) => setNewFeedback({ ...newFeedback, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Rating (1-5)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="rating"
                    placeholder="Enter Rating (1-5)"
                    min="1"
                    max="5"
                    value={newFeedback.rating}
                    onChange={(e) => setNewFeedback({ ...newFeedback, rating: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={uploadFeedback}>Upload</button>
                <button className="btn btn-secondary" onClick={() => setShowFeedbackModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profilepage_Project;


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