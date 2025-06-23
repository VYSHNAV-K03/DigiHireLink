import React, { useEffect, useState } from "react";
import styled from "styled-components";
import image1 from "../assets/studentprofileimages/chikkubhai.png";
import DoneIcon from "@mui/icons-material/Done";
import LoopIcon from "@mui/icons-material/Loop";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import loader_logo from "../assets/loader/onetouch_logo.png";
import { api, apiUrl, token } from "../data/api";
import profile1 from "../assets/profile_dummy/profile1.png";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useNavigate } from "react-router-dom";
import search_by_name from "../assets/icons/search_filter_name.png";
import send_icon from "../assets/icons/send_icon.png";
import untrained from "../assets/icons/untrained.png";
import trained from "../assets/icons/trained.png";
import { useDispatch, useSelector } from "react-redux";
import { local_storage_off } from "../actions";
import { CircularProgress } from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import Cookies from "universal-cookie";
import bulk_select_btn from "../assets/icons/bulk_select_btn.png";

const StudentListProject = (props) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [user_login, setUserLogin] = useState(JSON.parse(localStorage.getItem("user")));
  const [role, setRole] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getStudentList = async () => {
    try {
      setLoader(true);
      const res = await axios.post(apiUrl + `/student/get_stud`, {
        id: JSON.parse(localStorage.getItem("ids")),
      });
      setData(res.data);
      setLoader(false);
      dispatch(local_storage_off());
    } catch (error) {
      console.log("get stud error", error);
      setLoader(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoader(true);
      await axios.post(apiUrl + "/student/delete_stud", { id });
      getStudentList();
      setLoader(false);
    } catch (error) {
      console.log("delete stud error", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getStudentList();
  }, []);

  return (
    <div className="container my-5">
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search student by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {loader ? (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {data &&
            data
              .filter((item) => item.company_name === user_login.name)
              .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
              .reverse()
              .map((element) => (
                <div key={element._id} className="col-md-3 mb-4">
                  <div className="card shadow-lg border-0 rounded-3 animate__animated animate__fadeInUp" style={{ transition: '0.3s', background: 'linear-gradient(135deg, #EFFDF5, #ffffff)' }}>
                    <div className="card-body text-center p-4">
                      <img
                        src={element.profile ? api + element.profile : profile1}
                        alt="Profile"
                        className="img-fluid rounded-circle mb-3 shadow-sm"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          border: "3px solid rgb(204, 117, 73)",
                        }}
                      />

                      <h5 className="card-title fw-bold " style={{color:"orange"}}>{element.name}</h5>
                      <button
                        className="btn me-2 rounded-pill px-4"
                        style={{
                          borderColor: "rgb(204, 117, 73)",
                          color: "rgb(204, 117, 73)",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "rgb(204, 117, 73)";
                          e.target.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "rgb(204, 117, 73)";
                        }}
                        onClick={() => navigate("/profile_project", { state: { id: element._id } })}
                      >
                        Profile
                      </button>
                      {role === 2 && (
                        <button
                          className="btn btn-outline-danger rounded-pill px-4"
                          onClick={() => handleDelete(element._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default StudentListProject;

const Container = styled.div`
  position: relative;
  width: min(100vw, 1300px);
  margin: auto;
  .loader{
    position: absolute;
    width:300px;
    left: 0;
    right: 0;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin:0 auto;
  }
  .loader_image{
    width:200px;
    height:200px;

  }
  .loader_image img{
    width:100%;
    height:100%;
    object-fit:cover;
  }
  .loader_line_container{
    width:300px;
    height:10px;

    background: rgba(0, 0, 0, 0.34);
    border-radius: 5px;
    position: relative;

  }
  .line_loader{
    position: absolute;
    background: #4A5A96;
    border-radius: 5px;

    top:0;
    bottom:0;
    left:0;
    width:${(props) => (props.loader ? "250px" : "300px")};
    animation:loader 5s ease ;
  }

  @keyframes loader{
    from{
      width:0px;
    }
    to{
      width:${(props) => (props.loader ? "250px" : "300px")};
    }
  }
  @media screen and (max-width:700px){
    .loader_image{
    width:130px;
    height:130px;

  }
  .loader_line_container{
    width:150px;
    height:8px;
  }
  .line_loader{
width:${(props) => (props.loader ? "120px" : "150px")};

  }

  @keyframes loader{
    from{
      width:0px;
    }
    to{
      width:${(props) => (props.loader ? "120px" : "150px")};
    }
  }
  }

  .input_search_name {
    height: 80px;
    padding: 20px;

    background: rgba(61, 86, 178, 0.04);
    border-radius: 10px;

    margin: 20px auto 20px auto;
  }
  .input_search_name_1 {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 10px;
    padding: 5px;

    display: flex;
    align-items: center;
  }
  .search_name_icon {
    width: 43px;
    height: 41px;
    margin-right: 5px;
  }
  .search_name_icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .input_search_name_1 input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;

    color: rgba(61, 86, 178, 0.5);
  }
.bulk_select_items{
  padding:10px;
  display: flex;
  align-items: center;

}
.bulkmsg_button{
  width:50px ;
  height:50px;
  cursor: pointer;
  margin:5px 10px;
}
.bulkmsg_button img{
  width:100%;
  height:100%;
  object-fit: cover;
}
.bulk_btn{
  margin-right: 5px;
  min-width: 80px;
}
.bulk_msg_input{
  padding:5px;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 10px;
  width:700px;
  height:100px;
}
.send_btn{
  background: #4A5A96;
  padding:5px 15px;
border-radius: 5px;
cursor: pointer;

font-family: 'Montserrat';
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 24px;

margin-left: 10px;

color: #FFFFFF;


}
.send_btn img{
  width:100%;
  height: 100;
  object-fit: cover;
  cursor: pointer;
}
.bulk_select_check{
  margin-right: 5px;
  width:20px;
  height:20px;
  cursor: pointer;
}
.all_select_check{
  margin:0 5px;
}
.bulk_select_label{
  font-size:20px ;
  font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    cursor: pointer;

    margin:5px 0px 5px 0;
    /* identical to box height */

    color: #000000;
}
  .studenteach {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.22);
    padding: 5px;
  }
  .image {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 10px;
  }
  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
  .center_content {
    display: flex;
    flex-direction: column;
    margin-right: auto;
  }
  .first_row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .name {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 22px;

    margin-right: 10px;
    /* identical to box height */

    color: #000000;
  }
  .college_name {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 18px;

    color: #000000;
  }

  .second_row {
    display: flex;
    flex-wrap: wrap;
  }
  .year,
  .branch,
  .cgpa,
  .backpaper,
  .icon_right {
    margin-right: 25px;
    margin-bottom: 10px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height */

    color: #4a5a96;
  }
  .last_content {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 137px;
    height: 39px;

    margin:0 10px;

    background: #4a5a96;
    border-radius: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;

    color: #ffffff;
    cursor: pointer;
  }
  .train_image{
    width:30px;
    height:30px;
    margin:0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    
  }
  .train_image img{
    width:100% ;
    height:100% ;
    object-fit:cover;

  }
  @media screen and (max-width: 723px) {
  .bulk_btn{
    margin-right: 5px;
    min-width: 80px;
  }

  .bulkmsg_button{
  width:30px ;
  height:30px;
  cursor: pointer;
  margin:5px;
}

  .bulk_msg_input{
    margin-right: 5px;
    width: 300px;
    height:60px;
  }
  .send_btn{
    width: 60px;
    height: 30px;
    font-size: 18px;
    padding:5px 5px;
    text-align: center;
  }
.send_btn img{
  width:100%;
  height: 100;
  object-fit: cover;
  cursor: pointer;
}
.bulk_select_check{
  margin-right: 5px;
}
    .input_search_name {
      max-width: 584px;
      height: 60px;
      padding: 10px;
      margin: 0 auto 20px auto;
    }
    .search_name_icon {
      width: 33px;
      height: 31px;
    }
    .input_search_name_1 input {
      font-size: 18px;
      line-height: 14px;
    }
    .image {
      min-width: 50px;
      min-height: 50px;
    }
    .first_row {
      margin-bottom: 5px;
    }
    .name {
      font-size: 18px;
    }
    .college_name {
      font-size: 15px;
    }
    .year,
    .branch,
    .cgpa,
    .backpaper,
    .icon_right {
      margin-right: 10px;
      font-size: 14px;
    }
    .last_content {
      max-width: 55px;
      max-height: 30px;
      font-size: 12px;
    }
    .icon_right {
      width: 20px;
      height: 20px;
    }
    .icon_right img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .train_image{
    width:20px;
    height:20px;
    margin:0 5px;
    
  }
}
`;
