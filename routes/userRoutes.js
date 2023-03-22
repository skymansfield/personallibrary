const router = require('express').Router();
const {
  userHome,
  registerUser,
  loginUser,
  userProfileGet,
  userProfilePost,
  userBooks,
  bookComment,
  logout,
  delOne,
  delAll
} = require("../controllers/userControllers");
const { ensureAuthenticated } = require('../ensure');
const passport = require('passport');

router.route('/').get(userHome);
router.route('/register').post(registerUser, passport.authenticate('local', { failureRedirect: '/' }), loginUser);
router.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), loginUser);
router.route('/profile').get(ensureAuthenticated, userProfileGet).post(userProfilePost);
router.route('/api/books').post(userBooks);
router.route('/api/comments').post(bookComment);
router.route('/logout').get(logout);
router.route('/delete').post(delOne);
router.route('/deleteAll').post(delAll)
module.exports = router;