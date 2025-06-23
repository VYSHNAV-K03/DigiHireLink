import React from "react";
import Navbar from "../components/Navbar";
import StudentListProject from "../components/StudentListProject";

const ProjectManager = () => {
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        {/* Welcome Section */}
        <div className="card shadow-sm p-4 text-center border-0 bg-light">
        <h2 className="fw-bold" style={{ color: "rgb(204, 117, 73)" }}>
  "Welcome to your Management Hub"
</h2>

          <p className="text-muted">
            Oversee your team, assign tasks, track employee performance, and maintain work history seamlessly.
          </p>
        </div>

        {/* Employee List Section */}
        <div className="mt-4">
          <h4 className="fw-bold text-dark">Employees Under Your Supervision</h4>
          <p className="text-muted">Here is the list of employees currently working under your management:</p>

          <StudentListProject />
        </div>
      </div>
    </>
  );
};

export default ProjectManager;

