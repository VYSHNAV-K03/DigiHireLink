import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl, token } from "../data/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.post(apiUrl + "/jobs/applications/company", {
        token: token,
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching job applications:", error);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="container mt-5">
  <h2 className="text-center fw-bold mb-4" style={{ color: "#3F170E" }}>
    <i>Job Applications</i>
  </h2>

  <div className="row justify-content-center">
    {applications.length > 0 ? (
      applications.map((application) => (
        <div key={application._id} className="col-md-4 col-sm-6 mb-4">
          <div
            className="card shadow-lg border-0 text-center p-3 h-100"
            style={{
              backgroundColor: "rgb(249, 227, 187)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div className="card-body">
              <h5 className="card-title fw-bold text-dark">{application.applicantName}</h5>
              <button
                className="btn fw-bold mt-3"
                style={{
                  backgroundColor: "rgb(204, 117, 73)",
                  color: "#fff",
                  transition: "filter 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.filter = "brightness(1.1)")}
                onMouseLeave={(e) => (e.target.style.filter = "brightness(1.)")}
                onClick={() =>
                  navigate("/profile_admin_want", {
                    state: { id: application.applicant_id },
                  })
                }
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-muted fw-bold">No applications found.</p>
    )}
  </div>
</div>

  );
};

export default ApplicationsPage;

