const express = require("express");
const { upload } = require("../helpers/filehelper");
const Authenticate = require("../middleware/authenticate");
const USER = require("../modelschemas/userschema");
const router = express.Router();
const fs = require("fs");
const wbm = require("wbm");
const { Certificate } = require("crypto");

router.post(
  "/upload_stud",
  upload.single("certificate"),
  Authenticate,
  async (req, res) => {
    // console.log(req.files);

    const {
      python,
      c,
      cplus,
      js,
      sql,
      python_level,
      c_level,
      js_level,
      sql_level,
      cplus_level,
      english,
      hindi,
      malayalam,
      developer_status,
      dev_description,
      nodev_status,
      git,
      linkedin,
      college_name,
      branch,
      year,
      cgpa,
      backpapers,
    } = req.body;

    console.log(python);

    var user_id = req.userID;
    const userUpdate = await USER.findByIdAndUpdate(user_id, {
      education: [
        {
          institution_name: college_name,
          branch: branch,
          year: year,
          cgpa: cgpa,
          back_papers: backpapers,
          certificate: req.file ? req.file.path : "",
        },
      ],
      coding: [
        {
          nodev_desc: nodev_status,
          dev_desc: dev_description,

          dev_status: developer_status,

          languages: [
            python === "true"
              ? {
                  language_name: "SEO",
                  language_level: python_level,
                }
              : {
                  language_name: "null",
                  language_level: "null",
                },
            c === "true"
              ? {
                  language_name: "SMM",
                  language_level: c_level,
                }
              : {
                  language_name: "null",
                  language_level: "null",
                },
            js === "true"
              ? {
                  language_name: "ADS",
                  language_level: js_level,
                }
              : {
                  language_name: "null",
                  language_level: "null",
                },
            cplus === "true"
              ? {
                  language_name: "EMAIL MARKETING",
                  language_level: cplus_level,
                }
              : {
                  language_name: "null",
                  language_level: "null",
                },
            sql === "true"
              ? {
                  language_name: "WORDPRESS",
                  language_level: sql_level,
                }
              : {
                  language_name: "null",
                  language_level: "null",
                },
          ],
          communication_languages: [
            english === "true"
              ? {
                  language_name: "english",
                }
              : {
                  language_name: "null",
                },
            hindi === "true"
              ? {
                  language_name: "hindi",
                }
              : {
                  language_name: "null",
                },
            malayalam === "true"
              ? {
                  language_name: "malayalam",
                }
              : {
                  language_name: "null",
                },
          ],

          links: [
            {
              github: git,
              linkedin: linkedin,
            },
          ],
        },
      ],
    });
    res.send(userUpdate);
    console.log(req.body);
    // console.log(userUpdate);
  }
);

router.post("/get_stud", async (req, res) => {
  try {
    console.log(req.body);

    const user = await USER.find();
    res.send(user);
    // console.log(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/verify_stud", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await USER.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.verfication = true; // Update verification status
    await student.save();

    res.status(200).json({ message: "Student verified successfully", student });
  } catch (error) {
    console.error("Error verifying student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/get_stud_admin_want", async (req, res) => {
  try {
    var id = req.body.id;
    const user = await USER.findById(id);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/get_stud_profile", Authenticate, async (req, res) => {
  var id = req.userID;
  console.log(id);
  try {
    const user = await USER.findById(id);

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/get_filter_stud", Authenticate, async (req, res) => {
  const {
    python,
    c,
    cplus,
    js,
    sql,
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
    english,
    hindi,
    malayalam,
    level_placement,
    response,
    compa_name,
    train,
  } = req.body;

  console.log("filtering_students", req.body);

  const user = await USER.find({
    $and: [
      python
        ? {
            "coding.languages": {
              $elemMatch: {
                language_name: "python",
              },
            },
          }
        : {
            Role: 0,
          },
      c
        ? {
            "coding.languages": {
              $elemMatch: { language_name: "c" },
            },
          }
        : {
            Role: 0,
          },
      js
        ? {
            "coding.languages": {
              $elemMatch: { language_name: "js" },
            },
          }
        : {
            Role: 0,
          },
      sql
        ? {
            "coding.languages": {
              $elemMatch: {
                language_name: "sql",
              },
            },
          }
        : {
            Role: 0,
          },
      cplus
        ? {
            "coding.languages": {
              $elemMatch: {
                language_name: "c++",
              },
            },
          }
        : {
            Role: 0,
          },
      dev_tech
        ? {
            coding: {
              $elemMatch: {
                dev_status: dev_tech,
              },
            },
          }
        : {
            Role: 0,
          },

      sslc_maths
        ? {
            "education.sslc": { $elemMatch: { maths: { $gte: sslc_maths } } },
          }
        : {
            Role: 0,
          },

      sslc_che
        ? {
            "education.sslc": { $elemMatch: { che: { $gte: sslc_che } } },
          }
        : {
            Role: 0,
          },
      sslc_phy
        ? {
            "education.sslc": {
              $elemMatch: { phy: { $gte: sslc_phy } },
            },
          }
        : {
            Role: 0,
          },
      plustwo_maths
        ? {
            "education.plustwo": {
              $elemMatch: { maths: { $gte: plustwo_maths } },
            },
          }
        : {
            Role: 0,
          },
      plustwo_che
        ? {
            "education.plustwo": { $elemMatch: { che: { $gte: plustwo_che } } },
          }
        : {
            Role: 0,
          },
      plustwo_phy
        ? {
            "education.plustwo": {
              $elemMatch: { phy: { $gte: plustwo_phy } },
            },
          }
        : {
            Role: 0,
          },
      year
        ? {
            education: {
              $elemMatch: { year: { $eq: year } },
            },
          }
        : {
            Role: 0,
          },
      cgpa
        ? {
            education: {
              $elemMatch: { cgpa: { $gte: cgpa } },
            },
          }
        : {
            Role: 0,
          },
      suppli
        ? {
            education: {
              $elemMatch: { back_papers: { $lte: suppli } },
            },
          }
        : {
            Role: 0,
          },
      branch
        ? {
            education: {
              $elemMatch: { branch: branch },
            },
          }
        : {
            Role: 0,
          },

      level_placement
        ? {
            placement: {
              $elemMatch: {
                company_name: req.rootUser.name,
                level_of_placement: level_placement,
              },
            },
          }
        : {
            Role: 0,
          },

      response && response !== ""
        ? {
            placement: {
              $elemMatch: {
                company_name: req.rootUser.name,
                response: response === "p" ? 0 : response === "a" ? 1 : 2,
              },
            },
          }
        : {
            Role: 0,
          },

      train && train !== ""
        ? {
            Train: train === "t" ? true : false,
          }
        : {
            Role: 0,
          },

      compa_name && compa_name !== ""
        ? {
            placement: {
              $elemMatch: {
                company_name: compa_name,
              },
            },
          }
        : {
            Role: 0,
          },
      english
        ? {
            "coding.communication_languages": {
              $elemMatch: {
                language_name: "english",
              },
            },
          }
        : {
            Role: 0,
          },
      hindi
        ? {
            "coding.communication_languages": {
              $elemMatch: {
                language_name: "hindi",
              },
            },
          }
        : {
            Role: 0,
          },
      malayalam
        ? {
            "coding.communication_languages": {
              $elemMatch: {
                language_name: "malayalam",
              },
            },
          }
        : {
            Role: 0,
          },
    ],
  });
  res.send(user);
});

router.post("/get_filter_stud_college_admin", async (req, res) => {
  console.log(req.body);

  const {
    filter_content,
    filter_interview,
    filter_interview_attended,
    filter_placement,
  } = req.body;

  const user = await USER.find({
    $or: [
      filter_content === "interview"
        ? {
            "college_admin.interview": {
              $elemMatch: filter_interview && {
                attended: filter_interview,
                selected:
                  filter_interview !== "Filter" && filter_interview_attended,
              },
            },
          }
        : {},
    ],
  });

  res.send(user);
});

// delete student with id
router.post("/delete_stud", async (req, res) => {
  try {
    console.log(req.body);
    const user = await USER.findByIdAndDelete(req.body.id);
    if (!user) return res.status(404).send("User not found.");
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
