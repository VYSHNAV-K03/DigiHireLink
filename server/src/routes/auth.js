const express = require("express");
const USER = require("../modelschemas/userschema");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");
const cookieParser = require("cookie-parser"); //this is used for getting req.cookies in middleware otherwise we dont get cookies in req in middleware
const { upload } = require("../helpers/filehelper");
const Authenticate = require("../middleware/authenticate");
const wbm = require("wbm");
const { emitWarning } = require("process");
const jwt = require("jsonwebtoken");

router.use(cookieParser());

router.post("/uploadstudinfo", (req, res) => {
  const name = req.body.name;
});

// Fetch all registered companies (users with role 1)
router.get("/companies", async (req, res) => {
  try {
    const companies = await USER.find({ Role: 1 }); // Fetch users with role 1
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching companies" });
  }
});

router.post(
  "/signup",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const filePath = req.files["file"] ? req.files["file"][0].path : null;
    const resumePath = req.files["resume"] ? req.files["resume"][0].path : null;

    try {
      const { name, email, phone, password, cpassword } = req.body;

      if (!name || !email || !phone || !password || !cpassword) {
        res.send("pls fill the field properly");
      }

      const userExist = await USER.findOne({ email: email });

      if (userExist) {
        res.send({ status: 422, error: "Email is already present" });
      } else if (password === cpassword) {
        const user = new USER({
          name,
          email,
          phone,
          password,
          cpassword,
          verfication:true,
          Role: 0,
          profile: filePath,
          resume: resumePath,
        });

        const userRegister = await user.save();

        if (userRegister) {
          res.send({ status: 200, message: "user registered successfully" });
        } else {
          res.send({ status: 422, error: "Failed to Registered" });
        }
      } else {
        res.send({ status: 422, error: "password must be equal" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/register-company", upload.single("logo"), async (req, res) => {
  const final_path = req.file ? req.file.path : "";

  console.log(final_path);

  try {
    const {
      name,
      email,
      phone,
      password,
      cpassword,
      website,
      tagline,
      about,
      address,
    } = req.body;

    if (!name || !email || !phone || !password || !cpassword) {
      res.send("pls fill the field properly");
    }

    const userExist = await USER.findOne({ email: email });

    if (userExist) {
      res.send({ status: 422, error: "Email is already present" });
    } else if (password === cpassword) {
      const user = new USER({
        name,
        email,
        phone,
        website,
        tagline,
        about,
        address,
        password,
        cpassword,
        profile: final_path,
        Role: 1,
      });

      const userRegister = await user.save();

      if (userRegister) {
        res.send({ status: 200, message: "user registered successfully" });
      } else {
        res.send({ status: 422, error: "Failed to Registered" });
      }
    } else {
      res.send({ status: 422, error: "password must be equal" });
    }
  } catch (error) {
    console.log(error);
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "3d",
  });
};

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(404).send("pls fill properly");
    } else {
      const userExist = await USER.findOne({ email: req.body.email });
      if (userExist) {
        if (userExist.verfication) {
          const isMatch = await bcrypt.compare(password, userExist.password);
          if (!isMatch) {
            res.status(404).send("check password");
          } else {
            // const token = await generateToken(userExist._id);
            const token = await userExist.generateAuthToken();
            // res.cookie("jwt", token);

            res
              .status(201)
              .json({ token: token, role: userExist.Role, user: userExist });
          }
        } else {
          res.status(404).send("User is not verified");
        }
      } else {
        res.status(404).send("Invalid Credentials");
        //hacker dont know the problem is email or password
      }
    }
  } catch (e) {
    res.send("error");
    console.log("error", e);
  }
});

// {
//   // sameSite: "strict",
//   secure: true,
//   expires: new Date(Date.now() + 300000),
//   httpOnly: true,
// }

router.get("/signout", Authenticate, (req, res) => {
  res.clearCookie("jwt", { path: "/" }); //path : cookie path
  res.status(200).send("User logout");
});

//for getting data for frontend
router.post("/getData", Authenticate, async (req, res) => {
  try {
    // wbm
    //   .start()
    //   .then(async () => {
    //     const phones = ["9048920962"];
    //     const message = "Good Morning.";
    //     await wbm.send(phones, message);
    //     await wbm.end();
    //   })
    //   .catch((err) => console.log(err));

    res.status(200).send(req.rootUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getstudent_notification", Authenticate, async (req, res) => {
  try {
    const id = req.body.id;
    const user = await USER.findOne({ _id: id });
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("user not found");
  }
});

module.exports = router;
