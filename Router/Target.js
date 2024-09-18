const express = require('express');
const router = express.Router();
const userModel = require('../Model/User'); // Assuming this is the correct path to your User model

// Route to get student details by registration number
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
router.get('/sgpas', async (req, res) => {
  const userId = 'userId'; // Replace with actual user ID logic

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.sgpas);
  } catch (error) {
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
// Route to set target CGPA
router.post('/set-target', async (req, res) => {
  const { targetCgpa, reg } = req.body;

  // Convert targetCgpa to a number
  const numericTargetCgpa = Number(targetCgpa);

  // Debugging logs
  console.log('Registration Number:', reg);
  console.log('Target CGPA:', numericTargetCgpa);

  // Validate request body
  if (isNaN(numericTargetCgpa) || numericTargetCgpa < 0 || numericTargetCgpa > 10) {
    return res.status(401).send('Invalid target CGPA value');
  }
  
  if (!reg) {
    return res.status(400).send('Registration number is required');
  }

  try {
    // Find user by registration number
    const user = await userModel.findOne({ Reg: reg });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update target CGPA
    user.targetCgpa = numericTargetCgpa;

    // Save the user document
    await user.save();

    res.status(200).send('Target CGPA set successfully');
  } catch (error) {
    console.error('Error setting target CGPA:', error);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
