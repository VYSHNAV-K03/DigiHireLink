const mongoose = require("mongoose");
const USER = require("../modelschemas/userschema");

const DB = process.env.DB;
console.log(DB);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected successfully");

    // Check if an admin already exists
    const adminExist = await USER.findOne({ email: "admin@digi.com" });

    if (!adminExist) {
      // Creating a new admin user
      const adminUser = new USER({
        name: "Admin",
        email: "admin@digi.com",
        phone: "9999999999",
        password: "1234",
        cpassword: "1234",
        verfication: true,
        Role: 2, // 1 for Admin role
        profile: "",
      });

      await adminUser.save();
      console.log("Admin user created successfully");
    } else {
      console.log("Admin already exists");
    }
  })
  .catch((err) => console.log("Not connected", err));
