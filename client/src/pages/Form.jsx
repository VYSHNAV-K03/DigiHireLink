import React, { useEffect, useState } from "react";
import styled from "styled-components";
import code_bro from "../assets/form/Code typing-bro.svg";
import appdevsvg from "../assets/form/App development-bro.svg";
import discussionsvg from "../assets/form/Discussion-amico.svg";
import axios from "axios";
import { apiUrl, token } from "../data/api";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";

const Form = () => {
  const cookies = new Cookies();

  const [component, setcomponent] = useState(5);

  const [btnloader, setbtnloader] = useState(false);

  const navigate = useNavigate();

  const [python, setpython] = useState(false);
  const [c, setc] = useState(false);
  const [cplus, setcplus] = useState(false);
  const [js, setjs] = useState(false);
  const [sql, setsql] = useState(false);

  const [python_level, setpython_level] = useState();
  const [c_level, setc_level] = useState();
  const [cplus_level, setcplus_level] = useState();
  const [js_level, setjs_level] = useState();
  const [sql_level, setsql_level] = useState();

  const [git, setgit] = useState("");
  const [linkedin, setlinkedin] = useState("");

  const [english, setenglish] = useState(false);
  const [hindi, sethindi] = useState(false);
  const [malayalam, setmalayalam] = useState(false);

  const [developer_status, setdeveloper_status] = useState();
  const [dev_description, setdev_description] = useState();
  const [nodev_status, setnodev_status] = useState();

  const PostData = async (e) => {
    e.preventDefault();

    try {
      setbtnloader(true);

      const formData = new FormData();
      formData.append("python", python);
      formData.append("python_level", python_level);
      formData.append("c", c);
      formData.append("c_level", c_level);
      formData.append("cplus", cplus);
      formData.append("cplus_level", cplus_level);
      formData.append("js", js);
      formData.append("js_level", js_level);
      formData.append("sql", sql);
      formData.append("sql_level", sql_level);
      formData.append("english", english);
      formData.append("hindi", hindi);
      formData.append("malayalam", malayalam);
      formData.append("developer_status", developer_status);
      formData.append("dev_description", dev_description);
      formData.append("nodev_status", nodev_status);
      formData.append("git", git);
      formData.append("linkedin", linkedin);
      formData.append("token", token);

      const res = await axios.post(apiUrl + `/student/upload_stud`, formData, {
        withCredentials: true,
      });
      console.log(res.data);

      navigate("/profile");
      setbtnloader(false);
    } catch (error) {
      setbtnloader(false);
      console.log(error);
    }
  };

  const callNavbar = async () => {
    try {
      const res = await axios.post(
        apiUrl + `/getData`,
        {
          token: token,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status !== 200) {
        throw new Error(res.error);
      }
    } catch (e) {
      navigate("/login");
    }
  };

  // console.log(login);

  useEffect(() => {
    callNavbar();
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        {component === 0 && (
          <Coc>
            <div className="left_coc">
              <div className="logo_coc">
                <img src={code_bro} alt="" />
              </div>
              <div className="buttons_coc">
                <button
                  className="submit_btn_coc"
                  onClick={() => setcomponent(5)}
                >
                  Back
                </button>
                <button
                  className="done_btn_coc"
                  onClick={() => setcomponent(4)}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="right_coc">
              <div className="title_coc">Skills You Have</div>
              <div className="la_level_coc">
                <label className="la_title_coc" htmlFor="python">
                  SEO
                  <input
                    type="checkbox"
                    name=""
                    id="python"
                    onClick={() => setpython(!python)}
                    checked={python === true}
                    readOnly
                  />
                </label>
                {python && (
                  <div className="le_coc">
                    <div
                      className="level beginner_coc"
                      style={
                        python_level === "beginner"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setpython_level("beginner")}
                    >
                      Beginner
                    </div>
                    <div
                      className="level intermediate_coc"
                      style={
                        python_level === "intermediate"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setpython_level("intermediate")}
                    >
                      Intermediate
                    </div>
                    <div
                      className="level advanced_coc"
                      style={
                        python_level === "advanced"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setpython_level("advanced")}
                    >
                      Advanced
                    </div>
                  </div>
                )}
              </div>
              <div className="la_level_coc">
                <label className="la_title_coc" htmlFor="c">
                  SMM
                  <input
                    type="checkbox"
                    name=""
                    id="c"
                    onClick={() => setc(!c)}
                    checked={c === true}
                    readOnly
                  />
                </label>
                {c && (
                  <div className="le_coc">
                    <div
                      className="level beginner_coc"
                      style={
                        c_level === "beginner"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setc_level("beginner")}
                    >
                      Beginner
                    </div>
                    <div
                      className="level intermediate_coc"
                      style={
                        c_level === "intermediate"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setc_level("intermediate")}
                    >
                      Intermediate
                    </div>
                    <div
                      className="level advanced_coc"
                      style={
                        c_level === "advanced"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setc_level("advanced")}
                    >
                      Advanced
                    </div>
                  </div>
                )}
              </div>
              <div className="la_level_coc">
                <label className="la_title_coc" htmlFor="cplus">
                  ADS
                  <input
                    type="checkbox"
                    name=""
                    id="cplus"
                    onClick={() => setcplus(!cplus)}
                    checked={cplus === true}
                    readOnly
                  />
                </label>
                {cplus && (
                  <div className="le_coc">
                    <div
                      className="level beginner_coc"
                      style={
                        cplus_level === "beginner"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setcplus_level("beginner")}
                    >
                      Beginner
                    </div>
                    <div
                      className="level intermediate_coc"
                      style={
                        cplus_level === "intermediate"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setcplus_level("intermediate")}
                    >
                      Intermediate
                    </div>
                    <div
                      className="level advanced_coc"
                      style={
                        cplus_level === "advanced"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setcplus_level("advanced")}
                    >
                      Advanced
                    </div>
                  </div>
                )}
              </div>{" "}
              <div className="la_level_coc">
                <label className="la_title_coc" htmlFor="js">
                  Email Marketing
                  <input
                    type="checkbox"
                    name=""
                    id="js"
                    onClick={() => setjs(!js)}
                    checked={js === true}
                    readOnly
                  />
                </label>
                {js && (
                  <div className="le_coc">
                    <div
                      className="level beginner_coc"
                      style={
                        js_level === "beginner"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setjs_level("beginner")}
                    >
                      Beginner
                    </div>
                    <div
                      className="level intermediate_coc"
                      style={
                        js_level === "intermediate"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setjs_level("intermediate")}
                    >
                      Intermediate
                    </div>
                    <div
                      className="level advanced_coc"
                      style={
                        js_level === "advanced"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setjs_level("advanced")}
                    >
                      Advanced
                    </div>
                  </div>
                )}
              </div>{" "}
              <div className="la_level_coc">
                <label className="la_title_coc" htmlFor="sql">
                  WORDPRESS
                  <input
                    type="checkbox"
                    name=""
                    id="sql"
                    onClick={() => setsql(!sql)}
                    checked={sql === true}
                    readOnly
                  />
                </label>
                {sql && (
                  <div className="le_coc">
                    <div
                      className="level beginner_coc"
                      style={
                        sql_level === "beginner"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setsql_level("beginner")}
                    >
                      Beginner
                    </div>
                    <div
                      className="level intermediate_coc"
                      style={
                        sql_level === "intermediate"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setsql_level("intermediate")}
                    >
                      Intermediate
                    </div>
                    <div
                      className="level advanced_coc"
                      style={
                        sql_level === "advanced"
                          ? { backgroundColor: "#001aff", color: "#ffffff" }
                          : { backgroundColor: "#ffffff", color: "#001aff" }
                      }
                      onClick={() => setsql_level("advanced")}
                    >
                      Advanced
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Coc>
        )}
        {component === 1 && (
          <Don>
            <div className="title_don"></div>
            <div className="logo_don">
              <img src={appdevsvg} alt="" />
            </div>
            <div className="buttons_don">
              <button className="yes_btn_don" onClick={() => setcomponent(5)}>
                Yes
              </button>
              <button className="no_btn_don" onClick={() => setcomponent(2)}>
                No
              </button>
            </div>
          </Don>
        )}
        {component === 2 && (
          <Wsta>
            <div className="desc_wsta">
              Okey..! Then please let us know about your working status
            </div>
            <div className="text_button_wsta">
              <div className="text_wsta">Type Here</div>
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                className="ta_wsta"
                onChange={(e) => setnodev_status(e.target.value)}
                defaultValue={nodev_status}
              ></textarea>
              <div className="buttons_wsta">
                <button className="submit_wsta" onClick={() => setcomponent(1)}>
                  Back
                </button>
                <button className="done_wsta" onClick={() => setcomponent(0)}>
                  Next
                </button>
              </div>
            </div>
          </Wsta>
        )}
        {component === 3 && (
          <Cs>
            <div className="logo_cs">
              <img src={discussionsvg} alt="" />
            </div>
            <div className="title_cs">Communication skill</div>
            <div className="lang_cs">
              <div className="english_cs">
                <label htmlFor="english">English</label>
                <input
                  type="checkbox"
                  name=""
                  className="input_en_cs"
                  id="english"
                  onClick={() => setenglish(!english)}
                  checked={english === true}
                  readOnly
                />
              </div>
              <div className="english_cs">
                <label htmlFor="hindi">Hindi</label>
                <input
                  type="checkbox"
                  name=""
                  className="input_en_cs"
                  id="hindi"
                  onClick={() => sethindi(!hindi)}
                  checked={hindi === true}
                  readOnly
                />
              </div>{" "}
              <div className="english_cs">
                <label htmlFor="malayalam">Malayalam</label>
                <input
                  type="checkbox"
                  name=""
                  className="input_en_cs"
                  id="malayalam"
                  onClick={() => setmalayalam(!malayalam)}
                  checked={malayalam === true}
                  readOnly
                />
              </div>
            </div>
            <div className="links_cs">
              <div className="git_cs">
                <div className="title_git_cs">Github </div>
                <input
                  type="text"
                  placeholder="  paste here"
                  onChange={(e) => setgit(e.target.value)}
                  value={git}
                />
              </div>
              <div className="linkd_cs">
                <div className="title_linked_cs">Linkedin</div>
                <input
                  type="text"
                  placeholder="  paste here"
                  onChange={(e) => setlinkedin(e.target.value)}
                  value={linkedin}
                />
              </div>
            </div>
            <div className="buttons_cs">
              <button className="submit_cs" onClick={() => setcomponent(0)}>
                Back
              </button>
              <button className="done_cs" onClick={() => setcomponent(4)}>
                Next
              </button>
            </div>
          </Cs>
        )}
        {component === 4 && (
          <Edu>
            <div className="title_edu">"Ready? Let’s Get Started!"</div>
            {/* <div className="btech_edu">
              <div className="co_name_btech">
                <div className="name_btech">College name</div>
                <input
                  type="text"
                  className="inpconame_btech"
                  onChange={(e) => setcollege_name(e.target.value)}
                  value={college_name}
                  placeholder=""
                />
              </div>
              <div className="co_name_btech">
                <div className="name_btech">Branch</div>
                <input
                  type="text"
                  className="inpconame_btech"
                  onChange={(e) => setbranch(e.target.value)}
                  value={branch}
                  placeholder=""
                />
              </div>{" "}
              <div className="co_name_btech">
                <div className="name_btech">Passout Year</div>
                <input
                  type="text"
                  className="inpconame_btech"
                  onChange={(e) => setyear(e.target.value)}
                  value={year}
                  placeholder=""
                />
              </div>{" "}
              <div className="co_name_btech">
                <div className="name_btech">CGPA</div>
                <input
                  type="Number"
                  className="inpcgpa_btech"
                  onChange={(e) => setcgpa(e.target.value)}
                  value={cgpa}
                />
              </div>
              <div className="co_name_btech">
                <div className="name_btech">No of back papers</div>
                <input
                  type="Number"
                  className="inpcgpa_btech"
                  onChange={(e) => setbackpapers(e.target.value)}
                  value={backpapers}
                />
              </div>
              <div className="co_name_btech">
                <div className="name_btech">Certificate</div>
                <input
                  type="file"
                  name="plustwo_certificate"
                  id=""
                  onChange={(e) => setcertificate(e.target.files[0])}
                />
              </div>
            </div> */}

            <div className="buttons_edu">
              <button className="submit_edu" onClick={() => setcomponent(0)}>
                Back
              </button>
              {btnloader ? (
                <CircularProgress />
              ) : (
                <button className="done_edu" onClick={PostData}>
                  Submit
                </button>
              )}
            </div>
          </Edu>
        )}
        {component === 5 && (
          <Devy>
            <div className="logo_devy">
              <img src={appdevsvg} alt="" />
            </div>
            <div className="title_devy"> <h2><b>Before you get started, please take a moment to complete your profile.</b></h2></div>
            <div className="devanddomain_devy">
              {/* <div className="devtitle_devy">Developer</div> */}
              <select
                name=""
                id=""
                className="devlist_devy"
                onChange={(e) => setdeveloper_status(e.target.value)}
                defaultValue={developer_status}
              >
                <option value="" disabled defaultValue selected>
                  Select your domain{" "}
                </option>
                <option value="Digital Marketing Specialist">
                  Digital Marketing Specialist
                </option>
                <option value="Social Media Manager">
                  Social Media Manager
                </option>
                <option value="Content Marketing Specialist">
                  Content Marketing Specialist
                </option>
                <option value="SEO Specialist">SEO Specialist</option>
                <option value="Email Marketing Specialist">
                  Email Marketing Specialist
                </option>
              </select>
            </div>
            <div className="none_devy">
              <div className="nonedesc_devy">
              <i>If your domain or working status is not mentioned, please provide the relevant details below to ensure your profile is complete and up to date.</i>


              </div>
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                className="nonetextarea_devy"
                onChange={(e) => setdev_description(e.target.value)}
                defaultValue={dev_description}
              ></textarea>
            </div>
            <div className="buttons_devy">
              <button className="next_devy" onClick={() => setcomponent(0)}>
                Next
              </button>
            </div>
          </Devy>
        )}
      </Container>
    </>
  );
};

export default Form;

const Coc = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .left_coc {
    margin-right: 30px;
  }
  .logo_coc {
    width: 400px;
    height: 400px;
  }
  @media screen and (max-width: 1029px) {
    flex-direction: column;
    .left_coc {
      order: 1;
    }
    .logo_coc {
      display: none;
    }
  }
  .logo_coc img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .buttons_coc {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .submit_btn_coc {
    background: #0029ff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;
    text-align: center;
    width: 109px;
    height: 47px;
    color: #ffffff;
    margin-right: 50px;
    outline: none;
    border: none;
  }
  .done_btn_coc {
    background: #ffffff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;
    text-align: center;
    width: 109px;
    height: 47px;
    color: #0029ff;
    outline: none;
    border: none;
  }
  .right_coc {
    width: min(600px, 95vw);
    padding: 20px;
  }
  .title_coc {
    font-size: 39px;
    margin-bottom: 25px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    line-height: 47px;
    text-align: center;

    color: rgba(0, 34, 156, 0.75);
  }
  .la_level_coc {
    margin-bottom: 30px;
  }
  .la_title_coc {
    margin-bottom: 10px;
    width: 158px;
    font-size: 25px;
    position: relative;
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    line-height: 42px;
    color: #000000;
    cursor: pointer;
  }
  .la_title_coc input {
    position: absolute;
    right: 0;
    top: 14px;
    width: 16px;
    height: 16px;
    cursor: pointer;

    background: #407bff;
  }
  .le_coc {
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
  }
  .level {
    background: #ffffff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 19px;
    line-height: 23px;
    text-align: center;
    width: 152px;
    height: 47px;
    color: #001aff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media screen and (max-width: 544px) {
    .submit_btn_coc {
      border-radius: 9px;

      font-size: 16px;

      width: 89px;
      height: 37px;

      margin-right: 30px;
    }
    .done_btn_coc {
      font-size: 16px;
      width: 89px;
      height: 37px;
    }
    .right_coc {
      padding: 10px;
    }
    .title_coc {
      font-size: 29px;
      margin-bottom: 15px;
    }
    .la_title_coc {
      margin-bottom: 5px;
      width: 118px;
      font-size: 18px;
    }
    .la_level_coc {
      margin-bottom: 15px;
    }
    .la_title_coc input {
      top: 14px;
      width: 14px;
      height: 14px;
    }
    .level {
      width: 102px;
      height: 30px;
      font-size: 15px;
      border-radius: 5px;
    }
  }
`;

const Don = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  .title_don {
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-size: 52px;
    line-height: 63px;
    display: flex;
    align-items: center;
    text-align: center;

    color: rgba(0, 34, 156, 0.75);
  }
  .logo_don {
    height: 500px;
    width: 500px;
  }
  .buttons_don {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .yes_btn_don {
    border-radius: 9px;
    width: 119px;
    height: 57px;
    font-size: 21px;

    background: #0029ff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    line-height: 25px;
    text-align: center;

    color: #ffffff;
    outline: none;
    border: none;

    margin-right: 30px;
  }
  .no_btn_don {
    background: #ffffff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;

    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;
    text-align: center;

    color: #0029ff;
    outline: none;
    border: none;

    width: 119px;
    height: 57px;
  }

  @media screen and (max-width: 528px) {
    .title_don {
      font-size: 42px;
    }
    .logo_don {
      height: 300px;
      width: 300px;
    }
    .yes_btn_don {
      border-radius: 9px;
      width: 99px;
      height: 47px;
      font-size: 19px;
    }
    .no_btn_don {
      border-radius: 9px;
      width: 99px;
      height: 47px;
      font-size: 19px;
    }
  }
`;

const Wsta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  height: 700px;

  .desc_wsta {
    font-size: 45px;
    width: 465px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    line-height: 54px;
    text-align: center;

    color: rgba(0, 34, 156, 0.75);

    text-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  }

  .text_wsta {
    font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;

    color: #000000;
    margin-bottom: 10px;
  }

  .ta_wsta {
    border: 2px solid rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    width: 631px;
    height: 372px;
  }

  .buttons_wsta {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .submit_wsta {
    font-size: 21px;
    background: #0029ff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;
    border: none;
    outline: none;

    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    line-height: 25px;
    text-align: center;

    color: #ffffff;
    width: 119px;
    height: 57px;

    margin-right: 30px;
  }

  .done_wsta {
    background: #ffffff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;

    width: 119px;
    height: 57px;

    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;
    text-align: center;

    color: #0029ff;

    border: none;
    outline: none;
  }
  @media screen and (max-width: 668px) {
    height: 500px;

    .ta_wsta {
      border: 2px solid rgba(0, 0, 0, 0.5);
      border-radius: 10px;
      width: 90vw;
      height: 172px;
    }
    .desc_wsta {
      font-size: 35px;
    }
    .submit_wsta {
      font-size: 18px;
      width: 99px;
      height: 47px;
    }
    .done_wsta {
      font-size: 18px;
      width: 99px;
      height: 47px;
    }
  }
`;

const Cs = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 800px;
  .logo_cs {
    position: absolute;
    top: 50px;
    left: 50px;
    width: 250px;
    height: 250px;
  }
  @media screen and (max-width: 998px) {
    .logo_cs {
      display: none;
    }
  }

  .logo_cs img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .title_cs {
    font-size: 32px;
    margin-bottom: 20px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    line-height: 39px;
    text-align: center;

    color: rgba(0, 34, 156, 0.75);
  }

  .lang_cs {
    margin-bottom: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .english_cs {
    margin-right: 30px;
  }
  .english_cs label {
    font-size: 28px;
    margin-right: 10px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    line-height: 34px;

    cursor: pointer;

    color: #000000;
  }

  .english_cs input {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .links_cs {
    display: flex;
    flex-direction: column;
  }
  .git_cs {
    display: flex;
    margin-bottom: 20px;
  }
  .title_git_cs {
    font-size: 28px;
    width: 200px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    line-height: 34px;

    color: #000000;
  }

  .git_cs input {
    width: 375px;
    height: 40px;
    border: 1px solid #000000;
  }
  .linkd_cs {
    display: flex;
  }
  .title_linked_cs {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 28px;
    line-height: 34px;

    width: 200px;

    color: #000000;
  }

  .linkd_cs input {
    width: 375px;
    height: 40px;
    border: 1px solid #000000;
  }

  .buttons_cs {
    margin-top: 40px;
  }

  .submit_cs {
    background: #0029ff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;
    width: 109px;
    height: 50px;

    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;
    text-align: center;

    color: #ffffff;

    outline: none;
    border: none;

    margin-right: 20px;
  }

  .done_cs {
    background: #ffffff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;

    width: 109px;
    height: 50px;

    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;
    text-align: center;

    color: #0029ff;

    outline: none;
    border: none;
  }

  @media screen and (max-width: 998px) {
    height: 500px;
    .title_cs {
      font-size: 26px;
      margin-bottom: 10px;
    }
    .lang_cs {
      margin-bottom: 100px;
    }

    .english_cs {
      margin-right: 20px;
    }
    .english_cs label {
      font-size: 18px;
      margin-right: 5px;
    }

    .english_cs input {
      width: 15px;
      height: 15px;
    }
    .title_git_cs {
      font-size: 22px;
      width: 120px;
    }
    .title_linked_cs {
      font-size: 22px;
      width: 120px;
    }
    .git_cs input {
      width: 275px;
      height: 30px;
    }
    .linkd_cs input {
      width: 275px;
      height: 30px;
    }
    .submit_cs {
      width: 85px;
      height: 38px;
      border-radius: 5px;
      font-size: 18px;
    }
    .done_cs {
      width: 85px;
      height: 38px;
      border-radius: 5px;
      font-size: 18px;
    }
  }
  @media screen and (max-width: 422px) {
    .linkd_cs input {
      width: 175px;
      height: 30px;
    }
    .git_cs input {
      width: 175px;
      height: 30px;
    }
  }
`;

const Edu = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title_edu {
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 38px;
    line-height: 46px;
    text-align: center;

    color: rgba(0, 34, 156, 0.75);

    text-shadow: 0px 0px 11px rgba(0, 0, 0, 0.1);

    margin-bottom: 20px;
  }
  .btech_edu {
    background: #ffffff;
    border: 3px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.1);

    width: min(1037px, 95vw);

    padding: 50px 20px;
    margin-bottom: 20px;
  }
  .co_name_btech {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
  }
  .name_btech {
    font-size: 30px;
    width: 278px;
    height: 52px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    line-height: 46px;

    color: #000000;
  }
  .inpbranch_btech {
    border: 3px solid rgba(0, 0, 0, 0.4);

    width: 209px;
    height: 35px;
    background: white;
    cursor: pointer;
  }
  .inpconame_btech {
    border: 3px solid rgba(0, 0, 0, 0.4);

    width: 509px;
    height: 35px;
    background: white;
    cursor: pointer;
  }
  @media screen and (max-width: 874px) {
    .inpconame_btech {
      width: 209px;
      font-size: 12px;
    }
  }

  .inpyear_btech {
    border: 3px solid rgba(0, 0, 0, 0.4);

    width: 49px;
    height: 35px;
    background: white;
    cursor: pointer;
  }
  .inpcgpa_btech {
    border: 3px solid rgba(0, 0, 0, 0.4);

    width: 129px;
    height: 35px;
    background: white;
    cursor: pointer;
  }
  .title_sslc {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    font-size: 38px;
    line-height: 46px;
    text-align: center;

    color: rgba(0, 34, 156, 0.75);

    text-shadow: 0px 0px 11px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
  }
  .desc_sslc {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    text-align: center;

    color: #000000;

    margin-bottom: 10px;
  }
  .sslc_edu {
    background: #ffffff;
    border: 3px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.1);

    width: min(1037px, 95vw);

    padding: 50px 20px;
    margin-bottom: 20px;
  }
  .maths_section_sslc {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
  }
  .mathsname_sslc {
    font-size: 30px;
    width: 278px;
    height: 52px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    line-height: 46px;

    color: #000000;
  }

  .input_maths_sslc {
    width: 209px;
    height: 35px;
    background: white;
    border: 3px solid rgba(0, 0, 0, 0.4);
    cursor: pointer;

    margin-right: 10px;
  }
  .file_section_sslc {
    display: flex;
    background: coral;
    background: #ffffff;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;

    width: 229px;
    height: 50px;
    padding: 10px;
    margin: 50px auto 0 auto;
  }
  .hint_plustwo {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 46px;

    color: #9a9a9a;
  }
  @media screen and (max-width: 730px) {
    .name_btech {
      font-size: 20px;
      width: 178px;
      height: 52px;
    }
    .mathsname_sslc {
      font-size: 20px;
      width: 178px;
      height: 52px;
    }
    .hint_plustwo {
      font-size: 12px;
    }
  }
  @media screen and (max-width: 552px) {
    .hint_plustwo {
      display: none;
    }
  }

  .buttons_edu {
    margin-top: 20px;
  }
  .submit_edu {
    width: 119px;
    height: 57px;
    background: #0029ff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 26px;
    text-align: center;

    color: #ffffff;

    border: none;
    outline: none;
    margin-right: 20px;
  }
  .done_edu {
    width: 119px;
    height: 57px;

    background: #ffffff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 26px;
    text-align: center;

    color: #0029ff;

    border: none;
    outline: none;
  }

  @media screen and (max-width: 433px) {
    .inpconame_btech {
      width: 129px;
      font-size: 10px;
      font-weight: bold;
    }
    .inpbranch_btech {
      width: 129px;
    }
    .input_maths_sslc {
      width: 129px;
      height: 35px;
    }
    .name_btech {
      font-size: 18px;
      width: 138px;
      height: 52px;
    }
    .mathsname_sslc {
      font-size: 18px;
      width: 138px;
      height: 52px;
    }
    .hint_plustwo {
      font-size: 12px;
    }
    .submit_edu {
      width: 99px;
      height: 47px;
      font-size: 19px;
    }
    .done_edu {
      width: 99px;
      height: 47px;
      font-size: 19px;
    }
  }
`;

const Devy = styled.div`
  position: relative;
  padding: 50px;
  .logo_devy {
    position: absolute;
    bottom: 0;
    top: 0;
    right: 0;
    margin: auto;
    width: 500px;
    height: 500px;
  }
  @media screen and (max-width: 1123px) {
    .logo_devy {
      display: none;
    }
  }
  .logo_devy img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .title_devy {
    font-size: 52px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 700;
    line-height: 63px;
    display: flex;
    align-items: center;
    text-align: center;

    color: rgba(0, 34, 156, 0.75);
    margin-bottom: 20px;
  }
  .devtitle_devy {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height */

    color: #333333;
    margin-bottom: 5px;
  }
  .devanddomain_devy {
    margin-bottom: 200px;
  }

  .devlist_devy {
    background: #ffffff;
    box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    width: 280px;
    height: 50px;
    cursor: pointer;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height */

    color: #666666;
    outline: none;
    border: none;
  }
  .none_devy {
    font-size: 23px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    line-height: 28px;
    text-align: center;

    color: rgba(0, 0, 0, 0.75);

    text-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);

    width: min(618px, 95vw);
    margin-bottom: 20px;
  }

  .nonedesc_devy {
    margin-bottom: 20px;
  }
  .nonetextarea_devy {
    width: 457px;
    width: min(457px, 100%);
    height: 143px;

    border: 2px solid rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
  .buttons_devy {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .back_devy {
    background: #0029ff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;

    width: 119px;
    height: 57px;
    font-size: 21px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    line-height: 26px;
    text-align: center;

    color: #ffffff;

    border: none;
    outline: none;

    margin-right: 50px;
  }
  .next_devy {
    background: #ffffff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    border-radius: 9px;

    width: 119px;
    height: 57px;

    font-family: "Montserrat";
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 26px;
    text-align: center;

    color: #0029ff;

    border: none;
    outline: none;
  }
  @media screen and (max-width: 593px) {
    padding: 20px;

    .title_devy {
      font-size: 38px;
    }
    .devanddomain_devy {
      margin-bottom: 50px;
    }
    .none_devy {
      font-size: 18px;
    }
    .back_devy {
      width: 99px;
      height: 47px;
      font-size: 18px;

      margin-right: 20px;
    }
    .next_devy {
      width: 99px;
      height: 47px;
      font-size: 18px;

      margin-right: 20px;
    }
  }
`;

const Container = styled.div``;
