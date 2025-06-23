import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import videoBg from "../assets/vdo background.mp4";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "#fff" }}>
      {/* Background Video with Brown Overlay */}
      <div style={{ position: "absolute", width: "100%", height: "100%", zIndex: "-1" }}>
        <video
          autoPlay
          loop
          muted
          style={{
            width: "100%",
            height: "38%",
            objectFit: "cover",
          }}
        >
          <source src={videoBg} type="video/mp4" />
        </video>

        {/* Brown Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "38%",
            backgroundColor: "rgba(124, 108, 96, 0.1)", // Brown with 50% transparency
          }}
        ></div>
      </div>

      <Navbar role={true} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container text-left" style={{ marginTop: "320px" }}>
          <h1 className="display-3 fw-bold" >DigitalHireLink</h1>
          <i><p className="lead" style={{ color: "rgb(251, 250, 248)" }}>Where Digital Marketing Careers Thrive</p></i>
          <button
            className="btn btn-warning btn-lg mt-3"
            onMouseOver={(e) => (e.target.style.backgroundColor = "rgb(240, 173, 15)")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "rgb(255, 206, 57)")}
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-5" >
        <h2 className="text-center fw-bold mb-4" style={{ marginTop: "200px", color: "black" }}>
          How It Works
        </h2>

        <div className="accordion" id="howItWorks" style={{ marginTop: "80px" }}>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#stepOne">
                Step 1: Sign Up
              </button>
            </h2>
            <div id="stepOne" className="accordion-collapse collapse show">
              <div className="accordion-body">Create an account and get started immediately.</div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#stepTwo">
                Step 2: Post Jobs & Manage Tasks
              </button>
            </h2>
            <div id="stepTwo" className="accordion-collapse collapse">
              <div className="accordion-body">Post job listings and assign tasks seamlessly.</div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#stepThree">
                Step 3: Hire & Optimize
              </button>
            </h2>
            <div id="stepThree" className="accordion-collapse collapse">
              <div className="accordion-body">Use AI tools to find the best candidates and optimize workflows.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{ background: "#fff", marginTop: "20px", color: "#000" }}>
        <div className="container text-center" style={{ marginTop: "20px" }}>
          <h2 className="fw-bold mb-4">What Our Clients Say</h2>
          <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators" >
              <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" className="active"></button>
              <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1" className="active"></button>
              <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="2" className="active"></button>
            </div>
            <div className="carousel-inner" style={{ marginTop: "100px" }}>
              <div className="carousel-item active">
                <p className="lead fst-italic">"DigitalHireLink made hiring a breeze!"</p>
                <h5 className="fw-bold">- Sarah, HR Manager</h5>
              </div>
              <div className="carousel-item active" style={{ textAlign: "left" }}>
                <p className="lead fst-italic">"The AI tools are a game-changer for our marketing!"</p>
                <h5 className="fw-bold">- Alex, Marketing Director</h5>
              </div>
              <div className="carousel-item active" style={{ textAlign: "right" }}>
                <p className="lead fst-italic">"Task management has never been easier!"</p>
                <h5 className="fw-bold">- James, Project Lead</h5>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=" text-white text-center py-5" style={{ backgroundColor: " #3F170E", marginTop: "150px" }}>
        <div className="container" >
          <div className="row">
            {/* Quick Links */}
            <div className="col-md-4">
              <h5 className="fw-bold">Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white text-decoration-none">Home</a></li>
                <li><a href="#" className="text-white text-decoration-none">About Us</a></li>
                <li><a href="#" className="text-white text-decoration-none">Services</a></li>
                <li><a href="#" className="text-white text-decoration-none">Contact</a></li>
              </ul>
            </div>
            {/* Contact Info */}
            <div className="col-md-4">
              <h5 className="fw-bold" >Contact Us</h5> {/* Brown Color */}
              <p>Email: support@digitalhirelink.com</p>
              <p>Phone: +1 234 567 890</p>
              <p>Address: 123 Digital St, Tech City</p>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;