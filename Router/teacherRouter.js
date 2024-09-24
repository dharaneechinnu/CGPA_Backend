const express = require('express');
const router = express.Router();

router.route('/getstd')
    .post(require('../Controller/teacherController').getStudents)
router.route('/login')
    .post(require('../Controller/teacherController').login)
module.exports = router;