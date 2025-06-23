// jobRoutes.js
const express = require('express');
const { default: mongoose } = require('mongoose');
const Authenticate = require('../middleware/authenticate');
const router = express.Router();
 // Assuming you have a Job model defined


const jobSchema = new mongoose.Schema({
    jobTitle: String,
    jobDescription: String,
    experience: String,
    salary: String,
    company_name: String,
    comp_id: String
  });
  
const Job = mongoose.model('Job', jobSchema);



const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  applicant_id: {
    type: String,
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  companyId: {
    type: String,
    required: true
  }

});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);





// POST /api/jobs
router.post('/',Authenticate, async (req, res) => {
  console.log("req.rootUser",req.rootUser);
  try {
    const { jobTitle, jobDescription, experience, salary } = req.body;
    const job = new Job({ jobTitle, jobDescription, experience, salary, company_name: req.rootUser.name, comp_id: req.rootUser._id });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  
    try {
      const jobs = await Job.find();
      console.log(jobs);
      res.json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });


  // DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(deletedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/apply',Authenticate, async (req, res) => {
  const { jobId,compid } = req.body;

  const applicantName= req.rootUser.name;

  try {
    // Create a new job application instance
    const jobApplication = new JobApplication({
      jobId,
      applicantName,
      applicant_id:req.userID,
      companyId: compid
    });

    // Save the job application to the database
    await jobApplication.save();

    // Respond with success or appropriate status code
    res.status(201).json({ message: 'Job application received', jobApplication });
  } catch (error) {
    console.error('Error processing job application:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /api/jobs/applications/company
router.post('/applications/company',Authenticate, async (req, res) => {


  const  companyId  = req.userID; // Assuming you have authentication middleware to extract companyId from authenticated user
  console.log("companyId",companyId);
  
  try {
    // Find all job applications associated with the authenticated company
    const jobApplications = await JobApplication.find({ companyId });
    res.json(jobApplications);
  } catch (error) {
    console.error('Error fetching job applications for company:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
