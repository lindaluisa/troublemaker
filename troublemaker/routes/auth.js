var express = require('express');
var router = express.Router();

const User = require('../models/user');

/* GET users listing. */
// sign-up route
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({
    username: username,
    password: password
  });
  newUser.save((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect('revolutions');
    }
  });
});

module.exports = router;
