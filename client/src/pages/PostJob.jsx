import axios from 'axios';
import React, { useState } from 'react';
import { apiUrl, token } from '../data/api';
import JobList from '../components/JobList';

const PostJob = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    experience: "",
    salary: "",
    token: token,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl + "/jobs", formData);
      console.log("Job posted successfully:", response.data);
      document.getElementById("closeModalBtn").click();
      window.location.reload();
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "20px" }}>
      <div className="container">
        {/* Post Job Button - Pushed More Right */}
        <div className="d-flex">
          <div className="ms-auto">
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#postJobModal"
            >
              Post Job
            </button>
          </div>
        </div>

        {/* Job Posting Modal */}
        <div className="modal fade" id="postJobModal" tabIndex="-1" aria-labelledby="postJobModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Post a Job</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalBtn"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="jobTitle" className="form-label">Job Title:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="jobDescription" className="form-label">Job Description:</label>
                    <textarea
                      className="form-control"
                      id="jobDescription"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="experience" className="form-label">Experience:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="salary" className="form-label">Salary:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-success w-100">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Job List Component */}
        <JobList />
      </div>
    </div>
  );
};

export default PostJob;
