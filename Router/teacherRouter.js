const express = require('express');
const router = express.Router();

router.route('/getstd')
    .post(require('../Controller/teacherController').getStudents)

module.exports = router;