const express = require('express');
const router = express.Router();

router.route('/register')
    .post(require('../Controller/adminController').register)
router.route('/regTeacher')
    .post(require('../Controller/adminController').registerTeacher)
router.route('/login')
    .post(require('../Controller/adminController').loginAdmin)
router.route('/:id')
    .put(require('../Controller/adminController').updateTeacher);
router.route('/:id')
    .put(require('../Controller/adminController').deleteTeacher);

module.exports = router;