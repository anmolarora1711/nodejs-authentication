const express = require('express');
const passport = require('passport');

const router = express.Router();

const UserController = require('../controllers/user');

router.get('/login', UserController.login);
router.get('/register', UserController.register);

router.post('/create', UserController.create);
router.post('/create-session', passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true,
}), UserController.createSession);

router.get('/logout', UserController.logout);

router.post('/:id/resetPassword', UserController.resetPassword);

// Social Authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/users/login',
    failureFlash: true,
}), UserController.createSession);

module.exports = router;