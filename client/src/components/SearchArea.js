import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { apiUrl, token } from "../data/api";
import { useNavigate } from "react-router-dom";
import filter_icon from "../assets/icons/filter_icon.png";
import down_icon from "../assets/icons/search_down_icon.png";
import logo_skill from "../assets/icons/Ellipse 1.png";
import logo_edu from "../assets/icons/Ellipse 2.png";
import logo_comm from "../assets/icons/Ellipse 3.png";
import logo_placement from "../assets/icons/placement_logo_filter.png";
import right_arrow from "../assets/icons/right_arrow.png";
import { useDispatch } from "react-redux";
import { local_storage_clear } from "../actions";
import Cookies from "universal-cookie";

const SearchArea = () => {
  // hish

  const cookies = new Cookies();

  const [filter_hish, setfilter_hish] = useState(0);

  //hish
  const [filter_content, setfilter_content] = useState("coding");

  const [filter_skill, setfilter_skill] = useState();

  const [filter_education, setfilter_education] = useState();

  const [filter_communication, setfilter_communication] = useState();

  const [popup, setpopup] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [data, setdata] = useState();

  const [role, setrole] = useState();

  const [btnloader, setbtnloader] = useState(false);

  const [python, setpython] = useState(false);
  const [c, setc] = useState(false);
  const [cplus, setcplus] = useState(false);
  const [js, setjs] = useState(false);
  const [sql, setsql] = useState(false);

  const [python_level, setpython_level] = useState("beginner");
  const [c_level, setc_level] = useState("beginner");
  const [cplus_level, setcplus_level] = useState("beginner");
  const [js_level, setjs_level] = useState("beginner");
  const [sql_level, setsql_level] = useState("beginner");

  const [dev_tech, setdev_tech] = useState();

  const [sslc_maths, setsslc_maths] = useState();
  const [sslc_phy, setsslc_phy] = useState();
  const [sslc_che, setsslc_che] = useState();

  const [plustwo_phy, setplustwo_phy] = useState();
  const [plustwo_che, setplustwo_che] = useState();
  const [plustwo_maths, setplustwo_maths] = useState();

  const [year, setyear] = useState();
  const [cgpa, setcgpa] = useState();
  const [suppli, setsuppli] = useState();
  const [branch, setbranch] = useState();

  const [level_placement, setlevel_placement] = useState();
  const [response, setresponse] = useState();
  const [train, settrain] = useState();

  const [compa_name, setcompa_name] = useState();

  const [english, setenglish] = useState(false);
  const [hindi, sethindi] = useState(false);
  const [malayalam, setmalayalam] = useState(false);

  const PostData = async () => {
    try {
      setbtnloader(true);
      const res = await axios.post(
        apiUrl + `/student/get_filter_stud`,
        {
          python,
          c,
          cplus,
          js,
          sql,
          english,
          hindi,
          malayalam,
          dev_tech,
          sslc_maths,
          sslc_phy,
          sslc_che,
          plustwo_phy,
          plustwo_che,
          plustwo_maths,
          year,
          cgpa,
          suppli,
          branch,
          level_placement,
          response,
          compa_name,
          train,
          token: token
        },
        {
          withCredentials: true,
        }
      );

      // console.log(res.data);

      setdata(
        res.data &&
          res.data.map((element, index) => {
            return element._id;
          })
      );

      navigate("/", {
        state: {
          id:
            res.data &&
            res.data.map((element, index) => {
              return element._id;
            }),
        },
      });

      localStorage.setItem(
        "ids",
        JSON.stringify(
          res.data &&
            res.data.map((element, index) => {
              return element._id;
            })
        )
      );

      localStorage.setItem(
        "company_name",
        JSON.stringify(compa_name ? compa_name : null)
      );

      setpopup(false);
      setpython(false);
      setc(false);
      setcplus(false);
      setjs(false);
      setsql(false);
      setbtnloader(false);
      setfilter_content(false);
      setfilter_communication(false);
      setfilter_education(false);
      setfilter_skill(false);
      setdev_tech();
      setsslc_maths();
      setsslc_phy();
      setsslc_che();
      setplustwo_phy();
      setplustwo_che();
      setplustwo_maths();
      setyear();
      setcgpa();
      setsuppli();
      setbranch();
      setenglish(false);
      sethindi(false);
      setlevel_placement();
      setresponse();
      settrain();
      setcompa_name();

      setbtnloader(false);

      setfilter_hish(0);
    } catch (error) {
      console.log(error);
      setbtnloader(false);
    }
  };

  const callNavbar = async () => {
    try {
      const res = await axios.post(
        apiUrl + `/getData`,
        {
          token: token
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data;

      setrole(res.data.Role);

      if (res.status !== 200) {
        throw new Error(res.error);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const myBtn = useRef();
  useEffect(() => {
    callNavbar();
    console.log("btn", myBtn.current);

    // document.addEventListener("keyup", (event) => {
    //   event.preventDefault();
    //   if (event.key === "Enter") {
    //     myBtn.current.click();
    //   }
    // });

    // document.body.addEventListener("click", (e) => {
    //   console.log(e.path[0].id);
    //   if (e.path[0].id !== "filter_section") {
    //     // setfilter_hish(0);
    //   }
    // });
  }, []);

  return (
    <Container>
      <div
        className="clear_search_filter"
        onClick={() => {
          localStorage.removeItem("ids");
          localStorage.removeItem("company_name");
          dispatch(local_storage_clear());
        }}
      >
        Clear Filters
      </div>
      <div className="searchbyfilter_btn">
        <div
          className="filter_icon_btn"
          // id={filter_hish === 0 && "filter_section"}
          onClick={() =>
            filter_hish === 0 ? setfilter_hish(1) : setfilter_hish(0)
          }
        >
          <img src={filter_icon} alt="" />
        </div>
        <div
          className="filter_name_btn"
          onClick={() =>
            filter_hish === 0 ? setfilter_hish(1) : setfilter_hish(0)
          }
        >
          Search by filter
        </div>
        {filter_hish === 0 && (
          <div className="down_icon_btn" onClick={() => setfilter_hish(1)}>
            <img src={down_icon} alt="" />
          </div>
        )}
        {filter_hish !== 0 && (
          <div
            className="down_icon_btn_reverse"
            onClick={() => {
              setfilter_hish(0);
            }}
          >
            <img src={down_icon} alt="" />
          </div>
        )}
        {filter_hish === 1 && (
          <div className="first_filter_section outside">
            <div className="skillbased" onClick={() => setfilter_hish(2)}>
              <div className="logo_skill">
                <img src={logo_skill} alt="" />
              </div>
              <div className="titile_skill">Skill based</div>
              <div className="icon_skill">
                <img src={right_arrow} alt="" />
              </div>
            </div>
            <div className="educationbased" onClick={() => setfilter_hish(3)}>
              <div className="logo_education">
                <img src={logo_edu} alt="" />
              </div>
              <div className="titile_education">Education</div>
              <div className="icon_edu">
                <img src={right_arrow} alt="" />
              </div>
            </div>
            <div
              className="communicationbased"
              onClick={() => setfilter_hish(4)}
            >
              <div className="logo_communication">
                <img src={logo_comm} alt="" />
              </div>
              <div className="titile_communication">Communication</div>
              <div className="icon_comm">
                <img src={right_arrow} alt="" />
              </div>
            </div>
            {role === 1 && (
              <div
                className="educationbased"
                onClick={() => setfilter_hish(10)}
              >
                <div className="logo_communication">
                  <img src={logo_placement} alt="" />
                </div>
                <div className="titile_communication">Placement</div>
                <div className="icon_comm">
                  <img src={right_arrow} alt="" />
                </div>
              </div>
            )}
            {(role === 2 || role === 3 || role === 4 || role === 5) && (
              <div
                className="educationbased"
                onClick={() => setfilter_hish(11)}
              >
                <div className="logo_communication">
                  <img src={logo_placement} alt="" />
                </div>
                <div className="titile_communication">Placement</div>
                <div className="icon_comm">
                  <img src={right_arrow} alt="" />
                </div>
              </div>
            )}
          </div>
        )}
        {filter_hish === 2 && (
          <div className="skill_filter_select">
            <div className="coding_based" onClick={() => setfilter_hish(5)}>
              Coding Languages
            </div>
            <div
              className="development_based"
              onClick={() => setfilter_hish(6)}
            >
              Development
            </div>
            <div className="hardware_based">Hardware</div>
          </div>
        )}
        {filter_hish === 3 && (
          <div className="education_filter_select">
            <div className="sslc_based" onClick={() => setfilter_hish(7)}>
              SSLC
            </div>
            <div className="plustwo_based" onClick={() => setfilter_hish(8)}>
              Plus 2
            </div>
            <div className="btech_based" onClick={() => setfilter_hish(9)}>
              B.Tech
            </div>
          </div>
        )}
        {filter_hish === 4 && (
          <div className="communication_filter_select">
            <div className="filter_english">
              <input
                type="checkbox"
                id="english"
                name="communication_language_name"
                onClick={() => setenglish(!english)}
              />
              <label htmlFor="english">English</label>
            </div>
            <div className="filter_hindi">
              <input
                type="checkbox"
                id="hindi"
                name="communication_language_name"
                onClick={() => sethindi(!hindi)}
              />
              <label htmlFor="hindi">Hindi</label>
            </div>
            <div className="filter_malayalam">
              <input
                type="checkbox"
                id="malayalam"
                name="communication_language_name"
                onClick={() => setmalayalam(!malayalam)}
              />
              <label htmlFor="malayalam">malayalam</label>
            </div>
            <button
              className="submit_communication"
              id="button"
              ref={myBtn}
              onClick={() => {
                PostData();
                localStorage.setItem("filter", JSON.stringify("communication"));
              }}
            >
              {btnloader ? "loading" : "Submit"}
            </button>
          </div>
        )}
        {filter_hish === 5 && (
          <div className="codinglanguages_filter_select">
            <div
              className="coding_title_filter5"
              onClick={() => {
                setfilter_hish(2);
              }}
            >
              Coding Languages
            </div>
            <div className="languages_filter5">
              <div className="filter5_python">
                <input
                  type="checkbox"
                  id="python"
                  name="coding_language_name"
                  onClick={() => setpython(!python)}
                />
                <label htmlFor="python">Python</label>
              </div>
              {/* c */}
              <div className="filter5_c">
                <input
                  type="checkbox"
                  id="c"
                  name="coding_language_name"
                  value="c"
                  onClick={() => setc(!c)}
                />
                <label htmlFor="c">C</label>
              </div>

              {/* c++ */}
              <div className="filter5_cplus">
                <input
                  type="checkbox"
                  id="c++"
                  name="coding_language_name"
                  value="c++"
                  onClick={() => setcplus(!cplus)}
                />
                <label htmlFor="c++">C++</label>
              </div>
              {/* js */}
              <div className="filter5_js">
                <input
                  type="checkbox"
                  id="js"
                  name="coding_language_name"
                  value="js"
                  onClick={() => setjs(!js)}
                />
                <label htmlFor="js">Javascript</label>
              </div>

              {/* sql */}
              <div className="filter5_sql">
                <input
                  type="checkbox"
                  id="sql"
                  name="coding_language_name"
                  value="sql"
                  onClick={() => setsql(!sql)}
                />
                <label htmlFor="sql">SQL</label>
              </div>
              <button
                className="submit_communication"
                ref={myBtn}
                onClick={() => {
                  PostData();
                  localStorage.setItem("filter", JSON.stringify("coding"));
                }}
              >
                {btnloader ? "loading" : "Submit"}
              </button>
            </div>
          </div>
        )}
        {filter_hish === 6 && (
          <div className="development_filter_select">
            <div
              className="development_title_filter6"
              onClick={() => {
                setfilter_hish(2);
              }}
            >
              Development
            </div>
            <div className="development_filter6">
              <div className="web_filter6">
                <label>Domain : </label>
                <select
                  name="dev"
                  style={{ marginLeft: "10px", marginBottom: "10px" }}
                  onChange={(e) => setdev_tech(e.target.value)}
                >
                  <option value=""></option>
                  <option value="Web Developer">Web Developer</option>
                  <option value="App Developer">App Developer</option>
                  <option value="Game Developer">Game Developer</option>
                  <option value="AI Developer">Ai Developer</option>
                </select>
              </div>

              <button
                className="submit_communication"
                ref={myBtn}
                onClick={() => {
                  PostData();
                  localStorage.setItem("filter", JSON.stringify("coding"));
                }}
              >
                {btnloader ? "loading" : "Submit"}
              </button>
            </div>
          </div>
        )}
        {filter_hish === 7 && (
          <div className="education_sslc_filter_select">
            <div
              className="sslc_title_filter7"
              onClick={() => {
                setfilter_hish(3);
              }}
            >
              SSLC
            </div>
            <div className="sslc_filter7">
              <div className="filter7_phy">
                <label htmlFor="phy_sslc">Physics</label>
                <input
                  type="text"
                  id="phy_sslc"
                  placeholder="Percentage"
                  onChange={(e) => setsslc_phy(e.target.value)}
                />
              </div>
              <div className="filter7_che">
                <label htmlFor="che_sslc">Chemistry</label>
                <input
                  type="text"
                  id="che_sslc"
                  placeholder="Percentage"
                  onChange={(e) => setsslc_che(e.target.value)}
                />
              </div>{" "}
              <div className="filter7_maths">
                <label htmlFor="maths_sslc">Mathematics</label>
                <input
                  type="text"
                  id="maths_sslc"
                  placeholder="Percentage"
                  onChange={(e) => setsslc_maths(e.target.value)}
                />
              </div>
              <button
                className="submit_communication"
                ref={myBtn}
                onClick={() => {
                  PostData();
                  localStorage.setItem("filter", JSON.stringify("sslc"));
                }}
              >
                {btnloader ? "loading" : "Submit"}
              </button>
            </div>
          </div>
        )}
        {filter_hish === 8 && (
          <div className="education_sslc_filter_select">
            <div
              className="sslc_title_filter7"
              onClick={() => {
                setfilter_hish(3);
              }}
            >
              Plus 2
            </div>
            <div className="sslc_filter7">
              <div className="filter7_phy">
                <label htmlFor="phy_plus">Physics</label>
                <input
                  type="text"
                  id="phy_plus"
                  placeholder="Percentage"
                  onChange={(e) => setplustwo_phy(e.target.value)}
                />
              </div>
              <div className="filter7_che">
                <label htmlFor="che_plus">Chemistry</label>
                <input
                  type="text"
                  id="che_plus"
                  placeholder="Percentage"
                  onChange={(e) => setplustwo_che(e.target.value)}
                />
              </div>{" "}
              <div className="filter7_maths">
                <label htmlFor="maths_plus">Mathematics</label>
                <input
                  type="text"
                  id="maths_plus"
                  placeholder="Percentage"
                  onChange={(e) => setplustwo_maths(e.target.value)}
                />
              </div>
              <button
                className="submit_communication"
                ref={myBtn}
                onClick={() => {
                  PostData();
                  localStorage.setItem("filter", JSON.stringify("plustwo"));
                }}
              >
                {btnloader ? "loading" : "Submit"}
              </button>
            </div>
          </div>
        )}
        {filter_hish === 9 && (
          <div className="education_sslc_filter_select">
            <div
              className="sslc_title_filter7"
              onClick={() => {
                setfilter_hish(3);
              }}
            >
              B.Tech
            </div>
            <div className="sslc_filter7">
              <div className="filter7_phy">
                <label htmlFor="year_btech">Year</label>
                <select
                  name="year"
                  id="year_btech"
                  onChange={(e) => setyear(e.target.value)}
                >
                  <option value=""></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>{" "}
              </div>
              <div className="filter7_che">
                <label htmlFor="branch_btech">Branch</label>
                <select
                  name="branch"
                  id="branch_btech"
                  onChange={(e) => setbranch(e.target.value)}
                >
                  <option value=""></option>
                  <option value="CSE">CSE</option>
                  <option value="MECH">MECH</option>
                  <option value="IT">IT</option>
                  <option value="EC">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="CIVIL">CIVIL</option>
                </select>{" "}
              </div>{" "}
              <div className="filter7_maths">
                <label htmlFor="cgpa_btech">CGPA</label>
                <input
                  type="text"
                  id="cgpa_btech"
                  onChange={(e) => setcgpa(e.target.value)}
                />
              </div>
              <div className="filter7_maths">
                <label htmlFor="suppli_btech">Backpapers</label>
                <input
                  type="text"
                  id="suppli_btech"
                  onChange={(e) => setsuppli(e.target.value)}
                />
              </div>
              <button
                className="submit_communication"
                ref={myBtn}
                onClick={() => {
                  PostData();
                  localStorage.setItem("filter", JSON.stringify("btech"));
                }}
              >
                {btnloader ? "loading" : "Submit"}
              </button>
            </div>
          </div>
        )}
        {filter_hish === 10 && (
          <div className="education_sslc_filter_select">
            <div
              className="sslc_title_filter7"
              onClick={() => {
                setfilter_hish(1);
              }}
            >
              Placement
            </div>
            <div className="sslc_filter7">
              <div className="filter7_phy">
                <label htmlFor="year_btech">Level</label>
                <select
                  name="year"
                  id="year_btech"
                  onChange={(e) => setlevel_placement(e.target.value)}
                >
                  <option value=""></option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>{" "}
              </div>
              <div className="filter7_che">
                <label htmlFor="branch_btech">Response</label>
                <select
                  name="branch"
                  id="branch_btech"
                  onChange={(e) => setresponse(e.target.value)}
                >
                  <option value=""></option>
                  <option value="p">Pending</option>
                  <option value="a">Accept</option>
                  <option value="r">Reject</option>
                </select>{" "}
              </div>{" "}
              <div className="filter7_che">
                <label htmlFor="branch_btech">Verification</label>
                <select
                  name="branch"
                  id="branch_btech"
                  onChange={(e) => settrain(e.target.value)}
                >
                  <option value=""></option>
                  <option value="t">Verified</option>
                  <option value="u">Not Verified</option>
                </select>{" "}
              </div>{" "}
              <button
                id="sumesh"
                className="submit_communication"
                ref={myBtn}
                onClick={() => {
                  PostData();
                  localStorage.setItem("filter", JSON.stringify("placement"));
                }}
              >
                {btnloader ? "loading" : "Submit"}
              </button>
            </div>
          </div>
        )}
        {filter_hish === 11 && (
          <div className="education_sslc_filter_select">
            <div
              className="sslc_title_filter7"
              onClick={() => {
                setfilter_hish(1);
              }}
            >
              Placement
            </div>
            <div className="sslc_filter7">
              <div className="filter7_che">
                <label htmlFor="branch_btech">company</label>
                <select
                  name="branch"
                  id="branch_btech"
                  onChange={(e) => setcompa_name(e.target.value)}
                >
                  <option value=""></option>
                  <option value="infosys">Infosys</option>
                  <option value="TCS">TCS</option>
                  <option value="wipro">Wipro</option>
                </select>{" "}
              </div>{" "}
              <div className="filter7_che">
                <label htmlFor="branch_btech">Training</label>
                <select
                  name="branch"
                  id="branch_btech"
                  onChange={(e) => settrain(e.target.value)}
                >
                  <option value=""></option>
                  <option value="t">Trained</option>
                  <option value="u">Untrained</option>
                </select>{" "}
              </div>{" "}
              <button
                className="submit_communication"
                ref={myBtn}
                onClick={() => {
                  PostData();
                  localStorage.setItem(
                    "filter",
                    JSON.stringify("placement_company")
                  );
                }}
              >
                {btnloader ? "loading" : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default SearchArea;




const Container = styled.div`
  padding: 50px 0 50px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .clear_search_filter {
    position: absolute;
    right: 15vw;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 137px;
    height: 39px;

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
  @media screen and (max-width: 1130px) {
    .clear_search_filter {
      right: 5vw;
    }
  }
  .searchbyfilter_btn {
    background: #3d56b2;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;

    width: 504px;
    height: 60px;
    display: flex;
    align-items: center;

    padding: 10px 20px;

    cursor: pointer;
    position: relative;
  }

  .first_filter_section,
  .skill_filter_select,
  .education_filter_select {
    position: absolute;
    width: 504px;
    height: 180px;
    top: 65px;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }
  .communication_filter_select {
    position: absolute;
    width: 504px;
    height: 240px;
    top: 65px;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    background: #7282be;
    cursor: pointer;
    label {
      cursor: pointer;
    }
    input {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      cursor: pointer;
    }
  }

  .skillbased,
  .educationbased,
  .communicationbased,
  .coding_based,
  .development_based,
  .hardware_based,
  .sslc_based,
  .plustwo_based,
  .btech_based,
  .filter_english,
  .filter_hindi,
  .filter_malayalam {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    line-height: 32px;
    /* identical to box height */

    color: #ffffff;
  }

  .skillbased {
    background: #adb7de;
  }
  .educationbased {
    background: #7282be;
  }
  .communicationbased {
    background: #adb7de;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  .coding_based {
    background: #adb7de;
  }
  .development_based {
    background: #7282be;
  }
  .hardware_based {
    background: #adb7de;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  .sslc_based {
    background: #adb7de;
  }
  .plustwo_based {
    background: #7282be;
  }
  .btech_based {
    background: #adb7de;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  .logo_skill,
  .logo_education,
  .logo_communication {
    width: 43px;
    height: 43px;
    margin-right: 10px;
  }
  .logo_skill img,
  .logo_education img,
  .logo_communication img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .titile_skill,
  .titile_education,
  .titile_communication {
    margin-right: auto;
  }

  .filter_icon_btn {
    width: 35px;
    height: 35px;
    margin-right: 5px;
  }
  .filter_icon_btn img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .filter_name_btn {
    display: flex;
    width: 100%;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    line-height: 32px;
    margin-right: auto;

    color: #ffffff;
  }
  .down_icon_btn {
    width: 31px;
    height: 31px;
  }
  .down_icon_btn_reverse {
    width: 31px;
    height: 31px;
    transform: rotate(-180deg);
  }
  .down_icon_btn img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .submit_communication {
    width: 103px;
    height: 31px;
    background: #4a5a96;
    border: 2px solid #4a5a96;
    border-radius: 20px;
    margin: 20px 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;

    color: #ffffff;
    cursor: pointer;
  }

  //filter 5 coding detail

  .codinglanguages_filter_select {
    position: absolute;
    width: 504px;
    min-height: 240px;
    top: 65px;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }
  .coding_title_filter5 {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    line-height: 32px;
    /* identical to box height */

    color: #ffffff;
    background: #adb7de;
  }
  .languages_filter5 {
    width: 100%;
    padding: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    line-height: 32px;
    /* identical to box height */

    color: #ffffff;

    background: #7282be;
    border-radius: 5px;

    margin-top: 2px;
    label {
      cursor: pointer;
    }
    input {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      cursor: pointer;
    }
  }

  //filter 6

  .development_filter_select {
    position: absolute;
    width: 504px;
    min-height: 240px;
    top: 65px;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }
  .development_title_filter6 {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    line-height: 32px;
    /* identical to box height */

    color: #ffffff;
    background: #adb7de;
  }
  .development_filter6 {
    width: 100%;
    padding: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    line-height: 32px;
    /* identical to box height */

    color: #ffffff;

    background: #7282be;
    border-radius: 5px;

    margin-top: 2px;
    padding: 10px;
    label {
      cursor: pointer;
    }
    select {
      border: 2px solid #ffffff;
      border-radius: 5px;
    }
    option {
      background: #4a5a96;
      font-family: "Montserrat";
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 20px;
      /* identical to box height */

      color: #ffffff;
    }
  }
  .education_sslc_filter_select {
    position: absolute;
    width: 504px;
    min-height: 240px;
    top: 65px;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }
  .sslc_title_filter7 {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    line-height: 32px;
    /* identical to box height */

    color: #ffffff;
    background: #adb7de;
  }
  .sslc_filter7 {
    width: 100%;
    padding: 10px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    line-height: 32px;
    /* identical to box height */

    color: #ffffff;

    background: #7282be;
    border-radius: 5px;

    margin-top: 2px;
    padding: 10px;
    label {
      font-size: 26px;
      line-height: 32px;
      width: 195px;
      height: 36px;
      cursor: pointer;

      font-family: "Montserrat";
      font-style: normal;
      font-weight: 400;

      color: #ffffff;

    }
    input {
      width: 165px;
      height: 31px;

      border: 2px solid #ffffff;
      border-radius: 5px;

      font-family: "Montserrat";
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      /* identical to box height */

      position: relative;
    }
    select {
      border: 2px solid #ffffff;
      border-radius: 5px;

      font-family: "Montserrat";
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      /* identical to box height */

      cursor: pointer;
    }
  }

  @media screen and (max-width: 723px) {
    padding: 15px 5px 50px 5px;
    .clear_search_filter {
      font-size: 15px;
      width: 107px;
      height: 29px;
    }
    .searchbyfilter_btn {
      width: 354px;
      height: 50px;
    }

    .first_filter_section,
    .skill_filter_select,
    .education_filter_select {
      width: min(354px, 90vw);
      top: 55px;
    }
    .communication_filter_select {
      width: min(354px, 90vw);
      height: 200px;
      top: 55px;
    }
    .skillbased,
    .educationbased,
    .communicationbased,
    .coding_based,
    .development_based,
    .hardware_based,
    .sslc_based,
    .plustwo_based,
    .btech_based,
    .filter_english,
    .filter_hindi,
    .filter_malayalam {
      font-size: 20px;
      line-height: 22px;
      height: 50px;
      padding: 10px;
    }

    .logo_skill,
    .logo_education,
    .logo_communication {
      width: 35px;
      height: 35px;
    }
    .icon_comm,
    .icon_edu,
    .icon_skill {
      width: 22px;
      height: 22px;
    }
    .icon_comm img,
    .icon_edu img,
    .icon_skill img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .filter_icon_btn {
      width: 25px;
      height: 25px;
    }
    .filter_name_btn {
      font-size: 20px;
    }
    .down_icon_btn {
      width: 25px;
      height: 25px;
    }
    .down_icon_btn_reverse {
      width: 25px;
      height: 25px;
    }
    .codinglanguages_filter_select {
      width: min(354px, 90vw);
      top: 55px;
    }
    .coding_title_filter5 {
      height: 50px;
      font-size: 20px;
      line-height: 22px;
    }
    .languages_filter5 {
      font-size: 20px;

      input {
        width: 16px;
        height: 16px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .development_filter_select {
      width: min(354px, 90vw);
      top: 55px;
    }
    .development_title_filter6 {
      height: 50px;
      font-size: 20px;
      line-height: 22px;
    }
    .development_filter6 {
      font-size: 20px;
      option {
        font-size: 15px;
      }
    }
    .education_sslc_filter_select {
      width: min(354px, 90vw);
      top: 55px;
    }
    .sslc_title_filter7 {
      height: 50px;
      font-size: 20px;
      line-height: 22px;
    }
    .sslc_filter7 {
      font-size: 20px;
      label {
        font-size: 20px;
        line-height: 32px;
        width: 135px;
        height: 36px;
      }
    }
  }
`;

