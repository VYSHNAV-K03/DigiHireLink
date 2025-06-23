// JobList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { apiUrl } from '../data/api';

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
  width: 300px;
`;

const JobTitle = styled.h2`
  margin-bottom: 10px;
`;

const JobDescription = styled.p``;

const Experience = styled.p`
  margin-top: 10px;
`;

const DeleteButton = styled.button`
  margin-top: 10px;
  background-color: #ff5c5c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
`;

const Salary = styled.p``;


const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [user, setuser] = useState(JSON.parse(localStorage.getItem('user')));


  console.log(user);
  console.log(jobs);
  
  

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(apiUrl + "/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(apiUrl + `/jobs/${id}`);
      fetchJobs(); // Refresh job list after deletion
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Vacancies</h2>

      <div className="row">
        {jobs.map((job) => (
          <div key={job._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">

                <h5 className="card-title text-primary">Company: {job.company_name}</h5>
                <h6 className="fw-bold">Job Title: {job.jobTitle}</h6>
                <p className="card-text text-muted">Description: {job.jobDescription}</p>
                <p className="fw-bold">Experience: {job.experience}</p>
                <p className="fw-bold">Salary: {job.salary}</p>
                {
                  job.comp_id === user._id &&

                <button
                className="btn btn-danger w-100"
                onClick={() => handleDeleteJob(job._id)}
                >
                  Delete
                </button>
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <p className="text-center text-muted">No jobs available.</p>
      )}
    </div>
  );
};

export default JobList;

