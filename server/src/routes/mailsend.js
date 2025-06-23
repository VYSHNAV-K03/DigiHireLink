const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const Authenticate = require("../middleware/authenticate");
const USER = require("../modelschemas/userschema");
const Resignation = require("../modelschemas/Resignation");





const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SEND_GRIDAPI,
    },
  })
);

router.post("/sendmail", Authenticate, async (req, res) => {
  console.log(req.body);
  try {
    const user = await USER.findById(req.body.id);

    console.log(user.email);

    console.log(req.rootUser.name);

    if (user) {
      var c = 0;
      console.log("user id", req.rootUser._id.toString());

      user.placement.map((item) => {
        console.log(item.company_id);
        if (item.company_id === req.userID.toString()) {
          c++;
        }
      });
      if (c === 0) {
        console.log("new");
        user.placement.push({
          company_id: req.userID.toString(),
          company_name: req.rootUser.name,
          level_of_placement: 0, //it will get from body
          current_status: 1,
          response: 0,
        });

        const New_interval = setInterval(async () => {
          console.log("new ramesh", req.body.id);
          console.log("new ramesh1", req.userID);
          const new_user = await USER.findById(req.body.id);
          new_user.placement
            .filter((item) => item.company_id === req.userID.toString())
            .map(async (element) => {
              console.log("new ramesh response", element.response);
              if (element.response === 0) {
                await USER.findOneAndUpdate(
                  {
                    _id: req.body.id,
                    "placement.company_id": req.userID.toString(),
                  },
                  {
                    $set: {
                      "placement.$.level_of_placement": "0",
                      "placement.$.current_status": "1",
                      "placement.$.response": "2",
                    },
                  }
                );
              }
            });
          clearInterval(New_interval);
        }, 120000);
        await user.save();
      } else {
        console.log("already present");
        if (req.body.date_new) {
          console.log("suemsh");
          await USER.findOneAndUpdate(
            { _id: req.body.id, "placement.company_id": req.userID.toString() },
            {
              $set: {
                "placement.$.level_of_placement": req.body.level_exam,
                "placement.$.current_status": "1",
                "placement.$.response": "0",
              },
            }
          );
        } else {
          console.log("ramesh");

          await USER.findOneAndUpdate(
            { _id: req.body.id, "placement.company_id": req.userID.toString() },
            {
              $set: {
                "placement.$.level_of_placement": "0",
                "placement.$.current_status": "1",
                "placement.$.response": "0",
              },
            }
          );
        }
        await user.save();

        const user_after_update = await USER.findById(req.body.id);
        if (user_after_update) {
          const My_interval = setInterval(async () => {
            const isOn = await user_after_update.isOn;
            const user_after_update_done = await USER.findById(req.body.id);

            console.log("interval ramesh");
            user_after_update_done.placement
              .filter((sumesh) => sumesh.company_id === req.userID.toString())
              .map(async (ramesh) => {
                console.log("rameshresponse", ramesh.response);

                if (ramesh.response === 0) {
                  await USER.findOneAndUpdate(
                    {
                      _id: req.body.id,
                      "placement.company_id": req.userID.toString(),
                    },
                    {
                      $set: {
                        "placement.$.level_of_placement": "0",
                        "placement.$.current_status": "1",
                        "placement.$.response": "2",
                      },
                    }
                  );
                }
              });
            clearInterval(My_interval);
          }, 120000);
        }
      }
      if (req.body.date_new) {
        console.log("hareesh");
        user.notifications.push({
          company_name: req.rootUser.name,
          company_id: req.userID.toString(),
          role: req.rootUser.Role,
          level_of_placement: req.body.level_exam,
          date: req.body.date_new,
          type_exam: req.body.exam_type,
          mode: req.body.exam_mode,
          send_date: new Date().toLocaleString(),

          requirements: [
            {
              laptop: req.body.requirements.laptop,
              internet: req.body.requirements.internet,
              more: req.body.requirements.description,
            },
          ],
        });
        await user.save();
      } else {
        console.log("sathashivan");

        user.notifications.push({
          company_name: req.rootUser.name,
          company_id: req.userID.toString(),
          level_of_placement: "0",
          role: req.rootUser.Role,
          send_date: new Date().toLocaleString(),
        });
        await user.save();
      }


      //mail send area

      // transporter.sendMail({
      //   from: "vyshnavk891@gmail.com",
      //   to: user.email,
      //   subject: "selected for placement",
      //   html: `
      //       <h3>${req.rootUser.name} select you as their employee</h3>
      //       <h3>pls click <a href="https://onetouch-vectorux.herokuapp.com/notification">link</a> or check notificaions page in onetouch website to submit or cancel the proposal</h3>

      //       `,
      // });
      // const reminder = setInterval(() => {
      //   transporter.sendMail({
      //     from: "vyshnavk891@gmail.com",
      //     to: user.email,
      //     subject: "selected for placement",
      //     html: `
      //     <h2>This is a remainder</h2>
      //     <h3>If you already responded never mind</h3>
      //     <h3>${req.rootUser.name} select you as their employee</h3>
      //     <h3>pls click <a href="https://onetouch-vectorux.herokuapp.com/notification">link</a> or check notificaions page in onetouch website to submit or cancel the proposal</h3>
      //     `,
      //   });
      //   clearInterval(reminder);
      // }, 120000);

      res.status(200).send("mail send successfully");
    } else {
      res.status(200).send("user not found");
    }
  } catch (error) {
    res.status(400).send("there is a problem");
  }
});

router.post("/send_student_response/interview", Authenticate, async (req, res) => {
  console.log(req.body);
  try {
    // Find the user and update their response
    const user = await USER.findOneAndUpdate(
      {
        _id: req.userID.toString(),
        "placement.company_id": req.body.company_id,
      },
      {
        $set: {
          "placement.$.response": req.body.response ? "1" : "2",
        },
      }
    );

    // Mark the notification as responded
    await USER.findOneAndUpdate(
      { _id: req.userID.toString(), "notifications._id": req.body.not_id },
      {
        $set: {
          "notifications.$.response": true,
        },
      }
    );
    const company = await USER.findById(req.body.company_id);



    // Get the company details

    // Update company's admin notifications
    company.notifications_admin.push({
      user_id: req.userID.toString(),
      name: req.rootUser.name,
      response: req.body.response,
      role: req.rootUser.Role,
      send_date: new Date().toLocaleString(),
    });

    await company.save();

    console.log(company.email);

  

    res.status(200).send(user);
  } catch (error) {
    console.error("send_stud_response error", error);
    res.status(400).send("send_stud_response error");
  }
});


router.post("/send_student_response", Authenticate, async (req, res) => {
  console.log(req.body);
  try {
    // Find the user and update their response
    const user = await USER.findOneAndUpdate(
      {
        _id: req.userID.toString(),
        "placement.company_id": req.body.company_id,
      },
      {
        $set: {
          "placement.$.response": req.body.response ? "1" : "2",
        },
      }
    );

    // Mark the notification as responded
    await USER.findOneAndUpdate(
      { _id: req.userID.toString(), "notifications._id": req.body.not_id },
      {
        $set: {
          "notifications.$.response": true,
        },
      }
    );
    const company = await USER.findById(req.body.company_id);

    // If the user accepted the offer, update employment status
    if (req.body.response) {
      const student = await USER.findById(req.userID.toString());


      student.recruitments.push({
        company_name: company.name,
        company_id: company._id,
      });

      
      // Check if they already have a job
      if (student.current_status === 1) {
        // Save previous job in experience history
        student.experience.push({
          company_name: student.company_name,
          company_id: student.company_id,
          start_date: student.start_date,
          end_date: new Date(),
        });
      }
      
      // Update with new company details
      student.company_name = company.name;
      student.company_id = company.id;
      student.current_status = 1;
      student.start_date = new Date();

      await student.save();
    }


    // Get the company details

    // Update company's admin notifications
    company.notifications_admin.push({
      user_id: req.userID.toString(),
      name: req.rootUser.name,
      response: req.body.response,
      role: req.rootUser.Role,
      send_date: new Date().toLocaleString(),
    });

    await company.save();

    console.log(company.email);


    res.status(200).send(user);
  } catch (error) {
    console.error("send_stud_response error", error);
    res.status(400).send("send_stud_response error");
  }
});


router.post("/send_train", Authenticate, async (req, res) => {
  try {
    await USER.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          Train: req.body.train,
        },
      }
    );
    res.status(200).send("Update training status success");
  } catch (error) {
    res.status(400).send("Training status error", error);
  }
});

router.post("/sendmail_basic", Authenticate, async (req, res) => {
  try {
    console.log(req.body);

    const user = await USER.findById({
      _id: req.body.id,
    });
    user.notifications.push({
      company_id: req.userID,
      company_name: req.rootUser.name,
      subject: req.body.subject,
      role: req.rootUser.Role,
      send_date: new Date().toLocaleString(),
    });
    await user.save();


    //mail send area

    // transporter.sendMail({
    //   from: "vyshnavk891@gmail.com",
    //   to: user.email,
    //   subject: `You have an notification from ${req.rootUser.name}`,
    //   html: `
    //   <h2>${req.body.subject}</h2>
    //   `,
    // });
    // console.log(user.email);
    res.status(200).send("Mail send successfully");
  } catch (error) {
    res.status(400).send("send mail error", error);
  }
});

router.post("/sendall_notification", Authenticate, async (req, res) => {
  try {
    const { bulk_msg, bulk_array_full } = req.body;
    // console.log(bulk_array_full);
    console.log(bulk_msg);

    for (i in bulk_array_full) {
      console.log(bulk_array_full[i]);
      const user = await USER.findById({
        _id: bulk_array_full[i],
      });
      user.notifications.push({
        company_id: req.userID,
        company_name: req.rootUser.name,
        subject: bulk_msg,
        role: req.rootUser.Role,
        send_date: new Date().toLocaleString(),
      });
      await user.save();
    }
    res.status(200).send("hello");
  } catch (error) {
    res.status(400).send("bulkerror", bulk_array);
  }
});


router.post("/resign", Authenticate, async (req, res) => {
  const { resignReason, companyId } = req.body; // Get resignation details from request

  try {
    const user = await USER.findById(req.userID); // Find the logged-in user
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const company = await USER.findById(companyId); // Find the company
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Create new resignation record
    const resignation = new Resignation({
      employee: user._id,
      company: company._id,
      resignReason,
    });

    await resignation.save(); // Save resignation to DB

    console.log(resignation);
    

    res.json({ success: true, message: "Resignation submitted successfully" });
  } catch (error) {
    console.error("Resignation error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.post("/resignations", Authenticate, async (req, res) => {
  try {
    // const resignations = await Resignation.find({ employee: req.userID }).populate("company", "name");
    const resignations = await Resignation.find({company: req.userID})
    .populate("company", "name email")
    .populate("employee", "name email");
    
    const userid = req.userID;

    console.log({userid, resignations});
    

    
    res.json({ success: true, resignations });
  } catch (error) {
    console.error("Error fetching resignations:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.put("/update-resignation/:id", Authenticate, async (req, res) => {
  const { status } = req.body; // Accept or Reject
  try {
    const resignation = await Resignation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if(status === "Approved"){
      
      const user = await USER.findById(resignation.employee);
      
      user.experience.push({
        company_name: user.company_name,
      company_id: user.company_id,
      start_date: user.start_date,
      end_date: new Date(),
    });
    
    user.current_status = "0";
    user.start_date = null;
    user.end_date = new Date();
    user.company_name=null;
    user.company_id=null;
    await user.save();
  }

    if (!resignation) {
      return res.status(404).json({ success: false, message: "Resignation not found" });
    }

    res.json({ success: true, message: `Resignation ${status} successfully` });
  } catch (error) {
    console.error("Error updating resignation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});




    

    // user.experience.push({
    //   company_name: user.company_name,
    //   company_id: user.company_id,
    //   start_date: user.start_date,
    //   end_date: new Date(),
    // });

    // user.current_status = "0";
    // user.start_date = null;
    // user.end_date = new Date();
    // user.company_name=null;
    // user.company_id=null;
    // await user.save();

    

module.exports = router;
