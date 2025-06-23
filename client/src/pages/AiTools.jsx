import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const AiTools = () => {
    const navigate = useNavigate()
  return (
    <>
    <Navbar/>
    <div className="container mt-5">
      <h2 className="text-center mb-4">🚀 AI Digital Marketing Tools</h2>
      <p className="text-center text-muted">
        Explore AI-powered marketing tools to enhance your digital strategies.
      </p>

      <div className="row gy-4">
        {/* AI Content Generation */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center">
              <h5 className="card-title">📝 AI Content Generator</h5>
              <p className="card-text">Generate high-quality blog posts, ad copies, and SEO content.</p>
              <button className="btn btn-primary w-100" onClick={() => navigate("/ai/content")} >Try Now</button>
            </div>
          </div>
        </div>

       

        {/* AI Image & Video Generator */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center">
              <h5 className="card-title">🎨 AI Image </h5>
              <p className="card-text">Create AI-generated images and videos for marketing campaigns.</p>
              <button className="btn btn-warning w-100" onClick={() => navigate("/ai/img")} >Generate Now</button>
            </div>
          </div>
        </div>

        {/* AI Email Marketing */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center">
              <h5 className="card-title">📧 AI Email Marketing</h5>
              <p className="card-text">Automate personalized email campaigns with AI.</p>
              <button className="btn btn-danger w-100" onClick={() => navigate("/ai/email")}>Start Campaign</button>
            </div>
          </div>
        </div>

        {/* AI Social Media Automation */}
        {/* <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center">
              <h5 className="card-title">📱 AI Social Media</h5>
              <p className="card-text">Automate and analyze social media posts effortlessly.</p>
              <button className="btn btn-info w-100" onClick={() => navigate("/ai/social")}>Manage Now</button>
            </div>
          </div>
        </div> */}

        {/* AI SEO Optimization */}
        {/* <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center">
              <h5 className="card-title">🔍 AI SEO Optimization</h5>
              <p className="card-text">Boost your rankings with AI-powered SEO tools.</p>
              <button className="btn btn-dark w-100" onClick={() => navigate("/ai/seo")}>Improve SEO</button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
    </>

  );
};

export default AiTools;
