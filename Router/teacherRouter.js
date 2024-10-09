const express = require('express');
const router = express.Router();
const { getStudents, login, getTopCGPAStudents, getTotalStudents, getClassCGPAAnalysis,getApprovedLeaves } = require('../Controller/teacherController');

// Routes
router.route('/getstd')
    .post(getStudents);

router.route('/login')
    .post(login);

// New route to get top CGPA students (changed to POST)
router.route('/topcgpa')
    .post(getTopCGPAStudents);

// New route to get total students count (changed to POST)
router.route('/totalstudents')
    .post(getTotalStudents);

// New route to get CGPA analysis of the class (changed to POST)
router.route('/classcgpa')
    .post(getClassCGPAAnalysis);

    router.route('/approved-leaves').post(getApprovedLeaves);
module.exports = router;
