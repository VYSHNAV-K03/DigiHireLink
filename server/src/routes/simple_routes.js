const express = require("express");
const router = express.Router();
const Authenticate = require("../middleware/authenticate");
const USER = require("../modelschemas/userschema");

router.post("/change_notification_view", Authenticate, async (req, res) => {
  console.log(req.body.not_id);
  try {
    const user = await USER.findOneAndUpdate(
      {
        _id: req.userID.toString(),
        "notifications._id": req.body.not_id,
      },
      {
        $set: {
          "notifications.$.viewed": true,
        },
      }
    );

    res.status(200).send("view changed to true");
  } catch (error) {
    res.status(400).send("change error");
  }
});

module.exports = router;
