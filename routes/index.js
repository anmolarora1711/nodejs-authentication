const express = require("express");
const passport = require("passport");
const HomeController = require('../controllers/home');

const router = express.Router();

router.get('/', HomeController.home);
router.get('/dashboard', passport.checkAuthentication , HomeController.dashboard);
router.use('/user', require('./user'));

module.exports = router;