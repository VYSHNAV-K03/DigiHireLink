import React, { useState } from "react";
import axios from "axios";
import { apiUrl } from "../data/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUp() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [Resume, setResume] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loader_addbtn, setLoaderAddbtn] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => {
      const updatedUser = { ...prevUser, [name]: value };

      // Validate field immediately after updating state
      validateField(name, value, updatedUser);
      return updatedUser;
    });
  };

  const validateField = (name, value, updatedUser) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case "name":
        fieldErrors[name] = value.length >= 3 ? "" : "Name must be at least 3 characters long";
        break;
      case "email":
        fieldErrors[name] = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email format";
        break;
      case "phone":
        fieldErrors[name] = /^\d{10}$/.test(value) ? "" : "Phone number must be 10 digits";
        break;
      case "password":
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
          fieldErrors[name] = "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
        } else {
          fieldErrors[name] = "";
        }
        // Validate confirm password again when password changes
        fieldErrors["cpassword"] = updatedUser.cpassword && updatedUser.cpassword !== value ? "Passwords do not match" : "";
        break;
      case "cpassword":
        fieldErrors[name] = value !== updatedUser.password ? "Passwords do not match" : "";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const isFormValid = () => {
    return !Object.values(errors).some((err) => err !== "") && Object.values(user).every((val) => val !== "");
  };

  const Postdata = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => formData.append(key, value));
    if (profileImage) formData.append("file", profileImage);
    if (Resume) formData.append("resume", Resume);

    try {
      setLoaderAddbtn(true);
      const res = await axios.post(apiUrl + `/signup`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.status === 422) alert(res.data.error);
      else navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setLoaderAddbtn(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h3 className="text-center">Employee Sign Up</h3>
            <form onSubmit={Postdata} noValidate>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInput}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInput}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleInput}
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                />
                {errors.phone && <div className="text-danger">{errors.phone}</div>}
              </div>
              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleInput}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </div>
              <div className="mb-3 position-relative">
                <label className="form-label">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="cpassword"
                    value={user.cpassword}
                    onChange={handleInput}
                    className={`form-control ${errors.cpassword ? "is-invalid" : ""}`}
                  />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.cpassword && <div className="text-danger">{errors.cpassword}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Profile Image</label>
                <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Resume</label>
                <input type="file" onChange={(e) => setResume(e.target.files[0])} className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={!isFormValid()}>
                {loader_addbtn ? "Loading..." : "Sign Up"}
              </button>
            </form>
            <div className="text-center mt-3">
              <a href="/register_company">Sign Up as Company</a>
            </div>
            <div className="text-center mt-3">
              <a href="/login">Already have an account? Sign In</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
