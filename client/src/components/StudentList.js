import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api, apiUrl } from "../data/api";
import profile1 from "../assets/profile_dummy/profile1.png";
import { useDispatch } from "react-redux";
import { local_storage_off } from "../actions";

const StudentList = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [employmentFilter, setEmploymentFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const role = localStorage.getItem("role");

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
      console.error("Error fetching students", error);
      setLoader(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.post(apiUrl + `/student/delete_stud`, { id });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  useEffect(() => {
    getStudentList();
  }, []);

  const filteredData = data.filter((student) => {
    return (
      (employmentFilter === "" ||
        String(student.current_status) === employmentFilter) &&
      (skillFilter === "" ||
        student.coding.some((coding) => coding.dev_status === skillFilter)) &&
      (searchTerm === "" ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="container my-4">
      {role !== "2" && (
        <div className="mb-3">
          <button
            className="btn"
            style={{
              backgroundColor: "rgb(204, 117, 73)",
              color: "white",
              marginRight: "10px",
              transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 0 10px rgba(204, 117, 73, 0.8)")
            }
            onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
            onClick={() => navigate("/postjob")}
          >
            Post Job
          </button>

          <button
            className="btn"
            style={{
              backgroundColor: "rgb(204, 117, 73)",
              color: "white",
              transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 0 10px rgba(204, 117, 73, 0.8)")
            }
            onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
            onClick={() => navigate("/applications")}
          >
            Job Applications
          </button>
        </div>
      )}

      {role !== "2" && (
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="text-center" style={{ color: "rgb(204, 117, 73)" }}>
            Filter Employees
          </h4>

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
                <option value="Social Media Manager">
                  Social Media Manager
                </option>
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
          <div className="mb-3">
            <label className="form-label">Search by Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {loader ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Fetching Employees...</p>
        </div>
      ) : (
        <div className="row mt-4">
          {filteredData
            .filter((student) => student.Role == 0)
            .map((student) => (
              <div className="col-md-4 mb-4" key={student._id}>
                <div
                  className="card border-0 shadow rounded-3 employee-card"
                  style={{ transition: "transform 0.3s ease-in-out" }}
                >
                  <div className="card-header text-center bg-light">
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
                    <h5 className="fw-bold">{student.name}</h5>
                    <p className="text-muted">
                      {student.company_name || "Unemployed"}
                    </p>
                    <span className="badge bg-success">
                      {student.coding[0]?.dev_status || "Not provided"}
                    </span>
                  </div>
                  <div className="card-footer d-flex justify-content-around bg-light">
                    {role !== "2" ? (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{
                          backgroundColor: "orange",
                          borderColor: "orange",
                          color: "white",
                          transition: "box-shadow 0.3s ease-in-out",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 0 15px rgba(255, 165, 0, 0.8)";
                          e.currentTarget.closest(
                            ".employee-card"
                          ).style.transform = "translateY(-5px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.closest(
                            ".employee-card"
                          ).style.transform = "translateY(0px)";
                        }}
                        onClick={() =>
                          navigate("/profile_admin_want", {
                            state: { id: student._id },
                          })
                        }
                      >
                        View Profile
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteStudent(student._id)}
                      >
                        Delete User
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;
