const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.use(express.urlencoded({ extended: false })); //form data to parse
app.use(express.json());

// uploads folder static

app.use(bodyParser.json());

const AuthRoute = require("./routes/auth");
const AIRoute = require("./routes/aiRoutes");
const getStudentInfo = require("./routes/getStudentInfo");
const mailSendRoute = require("./routes/mailsend");
const simpleRoute = require("./routes/simple_routes");
const jobRoutes = require("./routes/jobRoute");
const taskRoutes = require("./routes/taskRoute");
const feedbackRoutes = require("./routes/feedbackRoute");
const workHistoryRoutes = require("./routes/workHistory");

app.use("/api", AuthRoute);
app.use("/api/update", require("./routes/updateProfile"));

app.use("/api/ai", AIRoute);
app.use("/api/student", getStudentInfo);
app.use("/api/mailsend", mailSendRoute);
app.use("/api/simple", simpleRoute);
app.use("/api/jobs", jobRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/work-history", workHistoryRoutes);
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/send-email", require("./routes/emailRoute"));
app.use("/api/generate-image", require("./routes/generateImage"));




app.get("/kdsjs", (req, res) => {});

app.use("/uploads", express.static(path.join("uploads")));
app.use("/public", express.static(path.join("public")));

require("./db/conn");

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV == "production") {
  const path = require("path");
  app.use(express.static(path.join("client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("client/build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
