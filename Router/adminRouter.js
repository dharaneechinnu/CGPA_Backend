const express = require('express');
const router = express.Router();

router.route('/register')
    .post(require('../Controller/adminController').register)
router.route('/regTeacher')
    .post(require('../Controller/adminController').registerTeacher)

module.exports = router;