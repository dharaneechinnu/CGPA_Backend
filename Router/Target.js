const express = require('express');
const router = express.Router();
const userModel = require('../Model/User'); // Assuming this is the correct path to your User model
const Certificate = require('../Model/Certificated');
const Resume = require('../Model/ResumeModel');

router.get('/student/:reg', async (req, res) => {
  try {
    const regNo = req.params.reg; // Get the registration number from the URL params

    // Find the user by registration number
    const student = await userModel.findOne({ Reg: regNo });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Respond with the student details
    res.status(200).json(student);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/sgpa', async (req, res) => {
  const { semester, sgpa, reg } = req.body;
  console.log(reg)
  // Basic validation
  if (!semester || !sgpa || !reg) {
    return res.status(400).json({ message: 'Semester, SGPA, and registration number are required' });
  }

  try {
    // Find user by registration number
    const user = await userModel.findOne({ Reg: reg });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if SGPA for this semester already exists
    const existingSgpa = user.sgpas.find(s => s.semester === semester);
    if (existingSgpa) {
      return res.status(201).json({ message: `SGPA for semester ${semester} already exists` ,status: false});
    }

    // Add new SGPA entry
    user.sgpas.push({ semester, sgpa: parseFloat(sgpa) }); // Ensure SGPA is a number

    // Check for duplicate semesters in the sgpas array
    const semesterSet = new Set();
    for (const sgpaRecord of user.sgpas) {
      if (semesterSet.has(sgpaRecord.semester)) {
        return res.status(201).json({ message: `Duplicate SGPA entry for semester ${sgpaRecord.semester} is not allowed ` });
      }
      semesterSet.add(sgpaRecord.semester);
    }

    // Calculate CGPA
    const totalSgpa = user.sgpas.reduce((sum, sgpaRecord) => sum + sgpaRecord.sgpa, 0);
    user.cgpa = totalSgpa / user.sgpas.length;

    // Save user with updated SGPA and CGPA
    await user.save();
    res.status(200).json({ message: 'SGPA saved successfully', cgpa: user.cgpa });

  } catch (error) {
    console.error('Error saving SGPA:', error);
    res.status(500).json({ message: 'Error saving SGPA', error });
  }
});

router.get('/cgpa/:reg', async (req, res) => {
  try {
    const regNo = req.params.reg; // Get the registration number from the URL params
    console.log("Fetching CGPA for registration number:", regNo);

    const user = await userModel.findOne({ Reg: regNo }).exec();

    if (user) {
      res.status(200).json({ cgpa: user.cgpa });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching CGPA:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/sgpas/:reg', async (req, res) => {
  const reg = req.params.reg;

  try {
    // Find user by registration number
    const user = await userModel.findOne({ Reg: reg });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the SGPA data wrapped in an object
    res.status(200).json({ sgpas: user.sgpas });
  } catch (error) {
    console.error('Error fetching SGPA:', error);
    res.status(500).json({ message: 'Error fetching SGPA', error });
  }
});


// Update student details
router.put('/student/:reg', async (req, res) => {
  try {
    const { mobileNo, address, parentAddress, current_sem } = req.body;

    // Debugging logs
    console.log('Updating student with Reg:', req.params.reg);
    console.log('Request body:', req.body);

    const student = await userModel.findOneAndUpdate(
      { Reg: req.params.reg },
      { mobileNo, address, parentAddress, current_sem },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    console.error('Server error:', err); // Improved error logging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// GET endpoint to fetch SGPA data for a user
router.get('/sgpa/:reg', async (req, res) => {
  const { reg } = req.params;

  // Validate registration number
  if (!reg) {
    return res.status(400).json({ message: 'Registration number is required' });
  }

  try {
    // Find user by registration number
    const user = await userModel.findOne({ Reg: reg });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send SGPA data
    res.status(200).json({ sgpas: user.sgpas, cgpa: user.cgpa });

  } catch (error) {
    console.error('Error fetching SGPA data:', error);
    res.status(500).json({ message: 'Error fetching SGPA data', error });
  }
});
// Route to get target CGPA
router.get('/target-cgpa/:reg', async (req, res) => {
  const { reg } = req.params;

  // Debugging logs
  console.log('Registration Number:', reg);

  // Validate request parameter
  if (!reg) {
    return res.status(400).send('Registration number is required');
  }

  try {
    // Find user by registration number
    const user = await userModel.findOne({ Reg: reg });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send the target CGPA
    res.status(200).json({ targetCgpa: user.targetCgpa });
  } catch (error) {
    console.error('Error fetching target CGPA:', error);
    res.status(500).send('Server Error');
  }
});


// Route to upload a certificate
router.post('/upload-certificate', async (req, res) => {
  const { courseName, certificateUrl, reg } = req.body;

  try {
    const newCertificate = new Certificate({ courseName, certificateUrl, reg });
    await newCertificate.save();
    res.status(200).json({ certificate: newCertificate });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    res.status(500).json({ message: 'Error uploading certificate' });
  }
});

// Route to fetch certificates by registration number
router.get('/:reg', async (req, res) => {
  const { reg } = req.params;

  try {
    const certificates = await Certificate.find({ reg });
    res.status(200).json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Error fetching certificates' });
  }
});

// Endpoint to edit a certificate
router.put('/edit-certificate/:id', async (req, res) => {
  const { courseName, certificateUrl } = req.body;
  const { id } = req.params;

  try {
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.courseName = courseName;
    certificate.certificateUrl = certificateUrl;

    await certificate.save();
    res.status(200).json({ message: 'Certificate updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload a new resume
router.post('/upload-Resume', async (req, res) => {
  const { courseName, certificateUrl, reg } = req.body;

  try {
    const newResume = new Resume({ courseName, certificateUrl, reg });
    await newResume.save();
    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resume', error });
  }
});

// Fetch all resumes for a user
router.get('/resume/:reg', async (req, res) => {
  const { reg } = req.params;

  try {
    const resumes = await Resume.find({ reg });
    res.status(200).json({ certificates: resumes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes', error });
  }
});

// Edit a resume
router.put('/edit-Resume/:id', async (req, res) => {
  const { id } = req.params;
  const { courseName, certificateUrl, reg } = req.body;

  try {
    const updatedResume = await Resume.findByIdAndUpdate(id, { courseName, certificateUrl, reg }, { new: true });
    res.status(200).json(updatedResume);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resume', error });
  }
});

module.exports = router;
