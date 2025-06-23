import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../assets/landing.png"; // Import background image

const HomeCheck = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar role={true} />
      <div
        className="container-fluid d-flex justify-content-center align-items-center vh-100"
        style={{
          background: `url(${BackgroundImage}) no-repeat center center/cover`,
          minHeight: "100vh",
        }}
      >
        {/* Transparent Section Behind the Cards */}
        <div
          className="text-center p-5 rounded shadow-lg"
          style={{
            background: "rgba(255, 255, 255, 0.6)", // Semi-transparent background
            backdropFilter: "blur(8px)", // Blur effect for a smooth look
            borderRadius: "12px",
            padding: "40px",
            width: "60%", // Adjust width for better alignment
          }}
        >
          <h2 className="mb-4 fw-bold animate__animated animate__fadeInDown">
            Are you a Recruiter or a Project Manager?
          </h2>
          <div className="row g-4 d-flex justify-content-center">
            {/* Recruiter Card */}
            <div className="col-md-6 d-flex justify-content-center">
              <div
                className="card shadow-lg border-0 p-4 text-center animate__animated animate__zoomIn recruiter-card"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  background: "rgb(204, 117, 73)", // Solid background color
                  color: "white",
                  borderRadius: "12px",
                  width: "100%", // Ensure same width
                  minHeight: "250px", // Ensure same height
                }}
                onClick={() => navigate("/recruiter")}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <h4 className="card-title fw-bold">Recruiter</h4>
                  <p className="card-text">
                    <i>
                      Discover and hire top talent for your projects. Get access
                      to a vast pool of professionals.
                    </i>
                  </p>
                  <button className="btn btn-light fw-bold">
                    Explore Hiring
                  </button>
                </div>
              </div>
            </div>

            {/* Project Manager Card */}
            <div className="col-md-6 d-flex justify-content-center">
              <div
                className="card shadow-lg border-0 p-4 text-center animate__animated animate__zoomIn projectmanager-card"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  background: "#C08C46", // Solid background color
                  color: "white",
                  borderRadius: "12px",
                  width: "100%", // Ensure same width
                  minHeight: "250px", // Ensure same height
                }}
                onClick={() => navigate("/projectmanager")}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <h4 className="card-title fw-bold">Project Manager</h4>
                  <p className="card-text">
                    <i>
                      Manage your projects efficiently, track progress, and
                      collaborate with the best talent.
                    </i>
                  </p>
                  <button className="btn btn-light fw-bold">
                    Explore Projects
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect using CSS */}
      <style>
        {`
          .recruiter-card:hover, .projectmanager-card:hover {
            transform: translateY(-10px); /* Raise the card */
            box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3); /* Add shadow */
          }
        `}
      </style>
    </>
  );
};

export default HomeCheck;
