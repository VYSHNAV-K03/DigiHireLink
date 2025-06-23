import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { apiUrl, token } from "../data/api";

const CompanyResignations = ({ }) => {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResignations();
  }, []);

  const fetchResignations = async () => {
    try {
      const response = await axios.post(apiUrl + "/mailsend/resignations", {
        token: token,
      });

      if (response.data.success) {
        setResignations(response.data.resignations);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching resignations:", err);
      setError("Failed to load resignation requests.");
    } finally {
      setLoading(false);
    }
  };


  console.log(resignations);
  

  const updateResignationStatus = async (id, status) => {
    try {
      const response = await axios.put(
        apiUrl + `/mailsend/update-resignation/${id}`,
        { status ,token},
        { withCredentials: true }
      );

      if (response.data.success) {
        alert(response.data.message);
        fetchResignations(); // Refresh the list
      }
    } catch (err) {
      console.error("Error updating resignation:", err);
      alert("Error updating resignation status.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mt-4">
      <h2 className="mb-3">Resignation Requests</h2>

      {loading ? (
          <p>Loading...</p>
        ) : error ? (
            <p className="text-danger">{error}</p>
        ) : resignations.length > 0 ? (
            <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {resignations.map((resign) => (
                <tr key={resign._id}>
                <td>{resign.employee?.name}</td>
                <td>{resign.employee?.email}</td>
                <td>{resign.resignReason}</td>
                <td>{new Date(resign.resignDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      resign.status === "Pending"
                        ? "bg-warning text-dark"
                        : resign.status === "Accepted"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {resign.status}
                  </span>
                </td>

                <td>
                  {resign.status === "Pending" && (
                      <>
                      <button
                        className="btn btn-success btn-sm mx-1"
                        onClick={() => updateResignationStatus(resign._id, "Approved")}
                        >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateResignationStatus(resign._id, "Rejected")}
                        >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
          <p>No resignation requests found.</p>
        )}
    </div>
        </>
  );
};

export default CompanyResignations;
