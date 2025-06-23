const express = require("express");
const router = express.Router();
const Task = require("../modelschemas/TaskProject");
const Authenticate = require("../middleware/authenticate");
const { upload } = require("../helpers/filehelper");
const USER = require("../modelschemas/userschema");

// Fetch all tasks for a specific employee
router.post("/get_tasks", async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) return res.status(400).json({ error: "Employee ID is required" });

    const tasks = await Task.find({ employee_id }).populate("company_id","name");;

    console.log(tasks);
    

    res.json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/get_tasks/self",Authenticate, async (req, res) => {
    try {
  
  
      const tasks = await Task.find({employee_id:req.userID}).populate("company_id","name");;
  
      console.log(tasks);
      
  
      res.json({ success: true, tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


router.post("/upload_task",Authenticate, async (req, res) => {
    try {
      const { employee_id, task_name, task_description, deadline } = req.body;
  
      if (!employee_id ||  !task_name || !task_description || !deadline) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const newTask = new Task({
        employee_id,
        company_id:req.userID,
        task_name,
        task_description,
        deadline,
      });
  
      await newTask.save();

      const user = await USER.findById(employee_id); // Assuming role 1 = Admin
      console.log("Received deadline:", deadline);
      console.log("Type of deadline:", typeof deadline);
      
     // Create notification object
     user.notifications.push({
      company_id: req.userID,
      company_name: req.rootUser.name,
      subject: task_name,
      deadline: deadline,
      role: 2,
      send_date: new Date().toLocaleString(),
    });
    await user.save();
      res.json({ success: true, message: "Task uploaded successfully!" });
    } catch (error) {
      console.error("Error uploading task:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/upload_task_file", upload.single("taskFile"),Authenticate, async (req, res) => {
  try {

    console.log(req.body.token);
    
    const { task_id } = req.body;
    
    if (!task_id || !req.file) {
      return res.status(400).json({ error: "Task ID and file are required" });
    }

    const task = await Task.findById(task_id);
    console.log("uploaded task",task);
    

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.employee_id.toString() !== req.userID.toString()) {
      return res.status(403).json({ error: "Unauthorized to upload this file" });
    }

    task.completion_file = req.file.path;
    await task.save();

    


     // Find Admin users (role-based filtering)
     
 
  

    res.json({ success: true, message: "Task completion file uploaded successfully!", filePath: req.file.path });
  } catch (error) {
    console.error("Error uploading task file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update task status
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});





  
  

module.exports = router;
