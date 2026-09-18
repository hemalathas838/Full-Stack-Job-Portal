import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyRecruiter.css";

const VerifyRecruiter = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch recruiter details
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recruiters/${id}`);
        setCompany(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  // Approve
  const handleApprove = async () => {
    await axios.put(`http://localhost:5000/api/recruiters/approve/${id}`);
    alert("Approved!");
    navigate("/manage-recruiters");
  };

  // Reject
  const handleReject = async () => {
    await axios.put(`http://localhost:5000/api/recruiters/reject/${id}`);
    alert("Rejected!");
    navigate("/manage-recruiters");
  };

  // Delete
  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/recruiters/${id}`);
    alert("Deleted!");
    navigate("/manage-recruiters");
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="verify-container">
      <h1>🏢 Verify Recruiter</h1>

      <div className="card">
        {/* <h2>{company.companyName}</h2> */}
<div className="company-header">
  <div className="logo">
    {company.companyName?.charAt(0).toUpperCase()}
  </div>
  <h2>{company.companyName}</h2>
</div>
        <p><strong>Email:</strong> {company.email}</p>
        <p><strong>Location:</strong> {company.location}</p>
        <p><strong>Status:</strong> {company.status}</p>
        <p><strong>Registered On:</strong> {new Date(company.createdAt).toLocaleDateString()}</p>

        <div className="actions">
          <button className="approve" onClick={handleApprove}>Approve</button>
          <button className="reject" onClick={handleReject}>Reject</button>
          <button className="delete" onClick={handleDelete}>Delete</button>
          <button className="back-btn" onClick={() => navigate(-1)}>
  ← Back
</button>
        </div>
      </div>
    </div>
  );
};

export default VerifyRecruiter;
