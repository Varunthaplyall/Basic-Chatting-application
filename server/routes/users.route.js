const router = require('express').Router()
const {users} = require('../controller/authController');


router.get('/users', users);

module.exports = router